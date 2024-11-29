package com.controller;

import com.model.Appointment;
import com.request.AppointmentRequest;
import com.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointment")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;


    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAppointments());
    }

    // for customer to not assign the appointment same time
    @GetMapping("/check-availability") // Updated to avoid conflicts
    public ResponseEntity<Boolean> isAppointmentAvailable(@RequestParam("date") String date) {
        try {
            LocalDateTime appointmentDate = LocalDateTime.parse(date);
            boolean isAvailable = appointmentService.isAppointmentAvailable(appointmentDate);
            return ResponseEntity.ok(isAvailable);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(null); // Handle invalid date format
        }
    }

    // get available appointment for customers
    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableAppointments(
            @RequestParam(value = "mechanicUsername", required = false) String mechanicUsername) {
        if (mechanicUsername != null && appointmentService.isMechanicAssignedToAppointment(mechanicUsername)) {
            return ResponseEntity.badRequest()
                    .body(List.of(Map.of("error", "You already have an assigned appointment.")));
        }

        List<Appointment> availableAppointments = appointmentService.getUnassignedAppointments();
        List<Map<String, Object>> response = availableAppointments.stream().map(appointment -> {
            Map<String, Object> appointmentInfo = new HashMap<>();
            appointmentInfo.put("receiptId", appointment.getReceiptId());
            appointmentInfo.put("username", appointment.getUsername());
            appointmentInfo.put("phone", appointment.getPhone());
            appointmentInfo.put("carMake", appointment.getCarMake());
            appointmentInfo.put("carModel", appointment.getCarModel());
            appointmentInfo.put("carYear", appointment.getCarYear());
            appointmentInfo.put("serviceName", appointment.getServiceName());
            appointmentInfo.put("appointmentDate", appointment.getAppointmentDate());
            appointmentInfo.put("estimatedTime", appointment.getEstimatedTime());
            appointmentInfo.put("resources", appointment.getResources());
            return appointmentInfo;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // book appointment for the customer
    @PostMapping
    public ResponseEntity<?> bookAppointment(
            @RequestBody AppointmentRequest request,
            @RequestHeader(value = "Username", required = false) String username) {
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required.");
        }
        try {
            // Process the booking with rewards if applicable
            Appointment savedAppointment = appointmentService.createAppointment(request, username);
            return ResponseEntity.ok(savedAppointment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/rewards/{customerId}")
    public ResponseEntity<?> getAvailableRewards(@PathVariable Long customerId) {
        try {
            List<Map<String, Object>> availableRewards = appointmentService.getAvailableRewards(customerId);
            return ResponseEntity.ok(availableRewards);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // assign appointment to the mechanic
    @PostMapping("/assign")
    public ResponseEntity<?> assignAppointmentToMechanic(
            @RequestParam String receiptId,
            @RequestParam String mechanicUsername) {
        try {
            Appointment assignedAppointment = appointmentService.assignAppointmentToMechanic(receiptId, mechanicUsername);
            return ResponseEntity.ok(Map.of(
                    "message", "Appointment assigned successfully.",
                    "appointment", assignedAppointment
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // assign appintment
    @GetMapping("/assigned")
    public ResponseEntity<?> getAssignedAppointment(@RequestParam String mechanicUsername) {
        try {
            Appointment assignedAppointment = appointmentService.getAssignedAppointment(mechanicUsername);
            return ResponseEntity.ok(assignedAppointment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // get appointment by date range
    @GetMapping("/range")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateRange(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        try {
            LocalDateTime start = LocalDateTime.parse(startDate);
            LocalDateTime end = LocalDateTime.parse(endDate);
            return ResponseEntity.ok(appointmentService.getAppointmentsByDateRange(start, end));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(null); // Handle invalid date formats
        }
    }


    // get appointment stuff by username for multiple pages
    @GetMapping("/details/{username}")
    public ResponseEntity<?> getAppointmentDetailsByUsername(@PathVariable String username) {
        Appointment appointment = appointmentService.getLatestAppointmentByUsername(username);

        if (appointment == null) {
            return ResponseEntity.ok(Map.of("receiptId", "None", "status", "None"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("receiptId", appointment.getReceiptId());
        response.put("carMake", appointment.getCarMake() != null ? appointment.getCarMake() : "N/A");
        response.put("carModel", appointment.getCarModel() != null ? appointment.getCarModel() : "N/A");
        response.put("carYear", appointment.getCarYear() != 0 ? appointment.getCarYear() : "N/A");
        response.put("serviceName", appointment.getServiceName() != null ? appointment.getServiceName() : "N/A");
        response.put("appointmentDate", appointment.getAppointmentDate() != null
                ? appointment.getAppointmentDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm"))
                : "N/A");
        response.put("estimatedTime", appointment.getEstimatedTime() != null ? appointment.getEstimatedTime() : "N/A");
        response.put("selectedRewards", appointment.getSelectedRewards());
        response.put("resources", appointment.getResources() != null ? appointment.getResources() : "N/A");
        response.put("status", appointmentService.getAppointmentStatus(appointment.getReceiptId()));

        return ResponseEntity.ok(response);
    }

    // delete appointment for the mechanic homepage
    @DeleteMapping("/{receiptId}")
    public ResponseEntity<?> deleteAppointment(@PathVariable String receiptId) {
        try {
            appointmentService.deleteAppointmentByReceiptId(receiptId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
