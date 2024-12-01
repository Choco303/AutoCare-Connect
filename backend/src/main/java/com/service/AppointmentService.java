package com.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.Appointment;
import com.model.Customer;
import com.model.Rewards;
import com.model.RedeemedRewards;
import com.repository.AppointmentRepository;
import com.repository.CustomerRepository;
import com.repository.RewardsRepository;
import com.repository.RedeemedRewardsRepository;
import com.request.AppointmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RewardsRepository rewardsRepository;

    @Autowired
    private RedeemedRewardsRepository redeemedRewardsRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }

    public boolean isAppointmentAvailable(LocalDateTime appointmentDate) {
        return !appointmentRepository.existsByAppointmentDate(appointmentDate);
    }

    public Appointment saveAppointment(Appointment appointment) {
        if (appointment == null || appointment.getAppointmentDate() == null) {
            throw new IllegalArgumentException("Appointment or appointment date cannot be null.");
        }

        if (!isAppointmentAvailable(appointment.getAppointmentDate())) {
            throw new IllegalArgumentException("The selected time is already booked.");
        }
        return appointmentRepository.save(appointment);
    }

    // create appointments filling all categories so it works with other stuff
    public Appointment createAppointment(AppointmentRequest request, String loggedInUsername) {
        Customer customer = customerRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for username: " + loggedInUsername));

        if (appointmentRepository.existsByUsername(loggedInUsername)) {
            throw new IllegalArgumentException("User already has an appointment.");
        }

        if (request.getAppointmentDate() == null) {
            throw new IllegalArgumentException("Appointment date cannot be null.");
        }

        if (!isAppointmentAvailable(request.getAppointmentDate())) {
            throw new IllegalArgumentException("The selected time is already booked.");
        }

        Appointment appointment = new Appointment();
        appointment.setCustomerId(customer.getId());
        appointment.setUsername(customer.getUsername());
        appointment.setPhone(customer.getPhone());
        appointment.setCarMake(request.getCarMake());
        appointment.setCarModel(request.getCarModel());
        appointment.setCarYear(request.getCarYear());
        appointment.setServiceName(request.getServiceName());
        appointment.setEstimatedTime(request.getEstimatedTime());
        appointment.setResources(request.getResources());
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setSelectedRewards(request.getSelectedReward());

        // Adjust appointment date to PST
        ZonedDateTime zonedDateTimePST = request.getAppointmentDate()
                .atZone(ZoneId.of("UTC")) // Assuming incoming date is in UTC
                .withZoneSameInstant(ZoneId.of("America/Los_Angeles")); // Convert to PST

        LocalDateTime adjustedAppointmentDate = zonedDateTimePST.toLocalDateTime();
        appointment.setAppointmentDate(adjustedAppointmentDate);

        // Format the time for display purposes
        String formattedTime = adjustedAppointmentDate.toLocalTime()
                .format(DateTimeFormatter.ofPattern("hh:mm a")); // Format as "04:30 PM"
        appointment.setFormattedAppointmentTime(formattedTime);

        // Generate a random 6-character receipt ID
        appointment.setReceiptId(generateUniqueReceiptId());

        // Save the appointment
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Add the customer to the rewards table and give initial points if they don't exist
        handleRewardsForFirstAppointment(customer);

        return savedAppointment;
    }

    private void updateSelectedRewards(Long customerId, List<Map<String, Object>> selectedRewards) {
        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new IllegalArgumentException("No rewards found for the customer."));

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> allRewards = objectMapper.readValue(
                    redeemedRewards.getRedeemedRewards(),
                    new TypeReference<>() {}
            );

            List<Map<String, Object>> updatedRewards = allRewards.stream().peek(reward -> {
                if (selectedRewards.contains(reward)) {
                    reward.put("isUsed", true);
                }
            }).collect(Collectors.toList());

            redeemedRewards.setRedeemedRewards(objectMapper.writeValueAsString(updatedRewards));
            redeemedRewardsRepository.save(redeemedRewards);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to update selected rewards.", e);
        }
    }


    // handle rewards for first appointments so new users can use rewards also
    private void handleRewardsForFirstAppointment(Customer customer) {
        List<Rewards> rewardsList = rewardsRepository.findByCustomerId(customer.getId());

        if (rewardsList.isEmpty()) {
            Rewards newRewards = new Rewards();
            newRewards.setCustomer(customer);
            newRewards.setTotalPoints(100);
            newRewards.setRedeemedPoints(0);

            rewardsRepository.save(newRewards);
        }
    }

    public Appointment getLatestAppointmentByUsername(String username) {
        return appointmentRepository.findByUsername(username).stream()
                .max(Comparator.comparing(Appointment::getAppointmentDate))
                .orElse(null);
    }

    public List<Appointment> getUnassignedAppointments() {
        return appointmentRepository.findUnassignedAppointments();
    }


    public boolean isMechanicAssignedToAppointment(String mechanicUsername) {
        return appointmentRepository.isMechanicAssignedToAppointment(mechanicUsername);
    }

    public Appointment assignAppointmentToMechanic(String receiptId, String mechanicUsername) {
        Appointment appointment = appointmentRepository.findByReceiptId(receiptId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found for receipt ID: " + receiptId));

        if (appointment.getMechanicUsername() != null) {
            throw new IllegalArgumentException("already assigned for this mechanic");
        }

        appointment.setMechanicUsername(mechanicUsername);
        return appointmentRepository.save(appointment);
    }

    public Appointment getAssignedAppointment(String mechanicUsername) {
        return appointmentRepository.findByMechanicUsername(mechanicUsername)
                .orElseThrow(() -> new IllegalArgumentException("No assignment appointment for mechanic"));
    }


    private String generateReceiptId() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder receiptId = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            int index = (int) (Math.random() * characters.length());
            receiptId.append(characters.charAt(index));
        }
        return receiptId.toString();
    }

    private String generateUniqueReceiptId() {
        String receiptId;
        do {
            receiptId = generateReceiptId();
        } while (appointmentRepository.findByReceiptId(receiptId).isPresent());
        return receiptId;
    }

    public void deleteAppointmentByReceiptId(String receiptId) {
        Appointment appointment = appointmentRepository.findByReceiptId(receiptId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not with" + receiptId));

        appointmentRepository.delete(appointment);
    }

    public String getAppointmentStatus(String receiptId) {
        Appointment appointment = appointmentRepository.findByReceiptId(receiptId)
                .orElse(null);

        if (appointment == null) {
            return "None";
        }

        return (appointment.getMechanicUsername() == null) ? "Not Started" : "In Progress";
    }

    public List<Map<String, Object>> getAvailableRewards(Long customerId) {
        Optional<RedeemedRewards> redeemedRewardsOpt = redeemedRewardsRepository.findByCustomerId(customerId);

        if (redeemedRewardsOpt.isEmpty()) {
            return List.of(); // Return an empty list if no rewards are found
        }

        RedeemedRewards redeemedRewards = redeemedRewardsOpt.get();
        if (redeemedRewards.getRedeemedRewards() == null) {
            throw new IllegalArgumentException("Redeemed rewards data is null for customer ID: " + customerId);
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Map<String, Object>> rewardsList = objectMapper.readValue(
                    redeemedRewards.getRedeemedRewards(),
                    new TypeReference<>() {}
            );

            return rewardsList.stream()
                    .filter(reward -> !Boolean.parseBoolean(reward.get("isUsed").toString()))
                    .collect(Collectors.toList());

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse redeemed rewards data.", e);
        }
    }

    public void updateAppointmentDateByReceiptId(String receiptId, LocalDateTime newDate) {
        Appointment appointment = appointmentRepository.findByReceiptId(receiptId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found for receipt ID: " + receiptId));

        appointment.setAppointmentDate(newDate);

        String formattedTime = newDate.toLocalTime()
                .format(DateTimeFormatter.ofPattern("hh:mm a"));
        appointment.setFormattedAppointmentTime(formattedTime);

        appointmentRepository.save(appointment);
    }


}
