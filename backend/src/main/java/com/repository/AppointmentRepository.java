package com.repository;

import com.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Fetch appointments within a specific date range
    List<Appointment> findByAppointmentDateBetween(LocalDateTime start, LocalDateTime end);

    // Check if a specific time slot is already booked
    boolean existsByAppointmentDate(LocalDateTime appointmentDate);

    // Fetch all appointments for a specific customer
    List<Appointment> findByCustomerId(Long customerId);

    // Check if an appointment exists for a given username
    boolean existsByUsername(String username);

    // Find an appointment by its receipt ID
    Optional<Appointment> findByReceiptId(String receiptId);

    // Fetch all appointments for a specific username
    List<Appointment> findByUsername(String username);

    // Fetch the assigned appointment for a specific mechanic
    Optional<Appointment> findByMechanicUsername(String mechanicUsername);

    // Fetch the most recent appointment for a specific username
    @Query("SELECT a FROM Appointment a WHERE a.username = :username ORDER BY a.appointmentDate DESC")
    Optional<Appointment> findLatestAppointmentByUsername(String username);

    // Fetch all unassigned appointments
    @Query("SELECT a FROM Appointment a WHERE a.mechanicUsername IS NULL")
    List<Appointment> findUnassignedAppointments();

    // Check if a mechanic is already assigned to an appointment
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.mechanicUsername = :mechanicUsername")
    boolean isMechanicAssignedToAppointment(String mechanicUsername);
}

