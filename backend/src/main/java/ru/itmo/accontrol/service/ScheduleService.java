package ru.itmo.accontrol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.AirConditioner;
import ru.itmo.accontrol.entity.Schedule;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.ScheduleRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final AirConditionerService airConditionerService;

    @Transactional(readOnly = true)
    public List<Schedule> findAll() {
        return scheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Schedule findById(Long id) {
        return scheduleRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule", id));
    }

    @Transactional(readOnly = true)
    public List<Schedule> findByAirConditionerId(Long airConditionerId) {
        return scheduleRepository.findByAirConditionerId(airConditionerId.intValue());
    }

    @Transactional(readOnly = true)
    public List<Schedule> findActiveSchedulesByDayOfWeek(String dayOfWeek) {
        return scheduleRepository.findByDayOfWeekAndIsActive(dayOfWeek, true);
    }

    @Transactional(readOnly = true)
    public List<Schedule> findActiveSchedules() {
        return scheduleRepository.findByIsActive(true);
    }

    public Schedule create(Long airConditionerId, Schedule schedule) {
        AirConditioner ac = airConditionerService.findById(airConditionerId);
        schedule.setAirConditioner(ac);
        return scheduleRepository.save(schedule);
    }

    public Schedule update(Long id, Schedule scheduleDetails) {
        Schedule schedule = findById(id);
        schedule.setName(scheduleDetails.getName());
        schedule.setDayOfWeek(scheduleDetails.getDayOfWeek());
        schedule.setSpecificDate(scheduleDetails.getSpecificDate());
        schedule.setStartTime(scheduleDetails.getStartTime());
        schedule.setEndTime(scheduleDetails.getEndTime());
        schedule.setMode(scheduleDetails.getMode());
        schedule.setTargetTemperature(scheduleDetails.getTargetTemperature());
        schedule.setPeriodicity(scheduleDetails.getPeriodicity());
        schedule.setIsActive(scheduleDetails.getIsActive());
        return scheduleRepository.save(schedule);
    }

    public Schedule toggleActive(Long id) {
        Schedule schedule = findById(id);
        schedule.setIsActive(!schedule.getIsActive());
        return scheduleRepository.save(schedule);
    }

    public void delete(Long id) {
        Schedule schedule = findById(id);
        scheduleRepository.delete(schedule);
    }
}
