package com.service;

import com.model.Appointment;
import com.model.Customer;
import com.model.Rewards;
import com.repository.AppointmentRepository;
import com.repository.CustomerRepository;
import com.repository.RewardsRepository;
import com.request.AppointmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RewardsRepository rewardsRepository; // Add RewardsRepository for handling rewards


    /**
     * Retrieve all appointments.
     *
     * @return List of all appointments.
     */
    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    /**
     * Retrieve appointments within a specific date range.
     *
     * @param start Start date and time.
     * @param end   End date and time.
     * @return List of appointments within the date range.
     */
    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateBetween(start, end);
    }

    /**
     * Check if a specific appointment time is available.
     *
     * @param appointmentDate Date and time of the appointment.
     * @return True if the time is available, false otherwise.
     */
    public boolean isAppointmentAvailable(LocalDateTime appointmentDate) {
        return !appointmentRepository.existsByAppointmentDate(appointmentDate);
    }

    /**
     * Save a new appointment.
     *
     * @param appointment The appointment to save.
     * @return The saved appointment object.
     */
    public Appointment saveAppointment(Appointment appointment) {
        if (appointment == null || appointment.getAppointmentDate() == null) {
            throw new IllegalArgumentException("Appointment or appointment date cannot be null.");
        }

        if (!isAppointmentAvailable(appointment.getAppointmentDate())) {
            throw new IllegalArgumentException("The selected time is already booked.");
        }
        return appointmentRepository.save(appointment);
    }

    /**
     * Create a new appointment for a logged-in user and handle rewards.
     *
     * @param request          The appointment request.
     * @param loggedInUsername The username of the logged-in user.
     * @return The created appointment object.
     */
    public Appointment createAppointment(AppointmentRequest request, String loggedInUsername) {
        Customer customer = customerRepository.findByUsername(loggedInUsername)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found for username: " + loggedInUsername));

        // Check if the user already has an appointment
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

    /**
     * Handle rewards for a customer creating their first appointment.
     *
     * @param customer The customer object.
     */
    private void handleRewardsForFirstAppointment(Customer customer) {
        List<Rewards> rewardsList = rewardsRepository.findByCustomerId(customer.getId());

        if (rewardsList.isEmpty()) {
            // Create a new rewards entry for the customer
            Rewards newRewards = new Rewards();
            newRewards.setCustomer(customer);
            newRewards.setTotalPoints(100); // Initial points for creating the first appointment
            newRewards.setRedeemedPoints(0);

            rewardsRepository.save(newRewards);
        }
    }

    /**
     * Get the latest appointment for a specific username.
     *
     * @param username The username of the customer.
     * @return The latest appointment for the user.
     */
    public Appointment getLatestAppointmentByUsername(String username) {
        return appointmentRepository.findByUsername(username).stream()
                .max(Comparator.comparing(Appointment::getAppointmentDate))
                .orElse(null);
    }

    /**
     * Retrieve all unassigned appointments.
     *
     * @return List of unassigned appointments.
     */
    public List<Appointment> getUnassignedAppointments() {
        return appointmentRepository.findUnassignedAppointments();
    }

    /**
     * Check if a mechanic already has an assigned appointment.
     *
     * @param mechanicUsername The username of the mechanic.
     * @return True if the mechanic has an assigned appointment, false otherwise.
     */
    public boolean isMechanicAssignedToAppointment(String mechanicUsername) {
        return appointmentRepository.isMechanicAssignedToAppointment(mechanicUsername);
    }

    /**
     * Assign an appointment to a mechanic.
     *
     * @param receiptId        The receipt ID of the appointment to assign.
     * @param mechanicUsername The username of the mechanic.
     * @return The updated appointment with mechanic details.
     */
    public Appointment assignAppointmentToMechanic(String receiptId, String mechanicUsername) {
        Appointment appointment = appointmentRepository.findByReceiptId(receiptId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found for receipt ID: " + receiptId));

        if (appointment.getMechanicUsername() != null) {
            throw new IllegalArgumentException("This appointment is already assigned to a mechanic.");
        }

        appointment.setMechanicUsername(mechanicUsername);
        return appointmentRepository.save(appointment);
    }

    /**
     * Retrieve the assigned appointment for a specific mechanic.
     *
     * @param mechanicUsername The username of the mechanic.
     * @return The assigned appointment for the mechanic.
     */
    public Appointment getAssignedAppointment(String mechanicUsername) {
        return appointmentRepository.findByMechanicUsername(mechanicUsername)
                .orElseThrow(() -> new IllegalArgumentException("No assigned appointment found for the mechanic."));
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
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found for receiptId: " + receiptId));

        appointmentRepository.delete(appointment);
    }

    /**
     * Get the status of an appointment based on mechanic assignment.
     *
     * @param receiptId The receipt ID of the appointment.
     * @return "Not Started", "In Progress", or "None".
     */
    public String getAppointmentStatus(String receiptId) {
        Appointment appointment = appointmentRepository.findByReceiptId(receiptId)
                .orElse(null);

        if (appointment == null) {
            return "None"; // No appointment means it's finished or doesn't exist
        }

        return (appointment.getMechanicUsername() == null) ? "Not Started" : "In Progress";
    }



}
