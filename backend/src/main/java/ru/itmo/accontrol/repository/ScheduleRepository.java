package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.Schedule;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByAirConditionerId(Long airConditionerId);
    
    List<Schedule> findByDayOfWeekAndIsActive(String dayOfWeek, Boolean isActive);
    
    List<Schedule> findByIsActive(Boolean isActive);
}
