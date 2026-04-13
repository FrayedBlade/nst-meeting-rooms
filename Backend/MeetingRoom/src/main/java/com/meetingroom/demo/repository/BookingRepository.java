package com.meetingroom.demo.repository;

import com.meetingroom.demo.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUser_UserID(Integer userId);

    List<Booking> findByRoom_RoomID(Integer roomId);

    List<Booking> findByEndDateTimeAfter(LocalDateTime currentDateTime);

    @Query("SELECT b FROM Booking b WHERE b.room.roomID = :roomId " +
           "AND b.startDateTime < :endDateTime " +
           "AND b.endDateTime > :startDateTime")
    List<Booking> findOverlappingBookings(
            @Param("roomId") Integer roomId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );
}
