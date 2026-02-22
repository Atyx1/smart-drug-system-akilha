package com.akilha.logging.repository;

import com.akilha.logging.entity.ActivityLog;
import com.akilha.logging.entity.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    
    List<ActivityLog> findByTimestampBetweenOrderByTimestampDesc(
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    List<ActivityLog> findByUsernameAndTimestampBetweenOrderByTimestampDesc(
        String username,
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    List<ActivityLog> findByActionTypeAndTimestampBetweenOrderByTimestampDesc(
        ActivityType actionType,
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    List<ActivityLog> findByActionTypeInAndTimestampBetweenOrderByTimestampDesc(
        List<ActivityType> actionTypes,
        LocalDateTime startDate, 
        LocalDateTime endDate
    );

    @Query("SELECT al FROM ActivityLog al WHERE al.actionType IN :actionTypes AND al.timestamp BETWEEN :startDate AND :endDate ORDER BY al.timestamp DESC")
    List<ActivityLog> findByActionTypesAndDateRange(
        @Param("actionTypes") List<ActivityType> actionTypes,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // Son N günün loglarını getir
    @Query("SELECT al FROM ActivityLog al WHERE al.timestamp >= :sinceDate ORDER BY al.timestamp DESC")
    List<ActivityLog> findLogsSinceDate(@Param("sinceDate") LocalDateTime sinceDate);

    // Belirli bir kullanıcının son N günlük aktivitelerini getir
    @Query("SELECT al FROM ActivityLog al WHERE al.username = :username AND al.timestamp >= :sinceDate ORDER BY al.timestamp DESC")
    List<ActivityLog> findUserLogsSinceDate(
        @Param("username") String username,
        @Param("sinceDate") LocalDateTime sinceDate
    );
} 