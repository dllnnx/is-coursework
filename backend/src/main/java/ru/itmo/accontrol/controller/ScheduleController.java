package ru.itmo.accontrol.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.accontrol.dto.ScheduleDto;
import ru.itmo.accontrol.entity.Schedule;
import ru.itmo.accontrol.mapper.ScheduleMapper;
import ru.itmo.accontrol.service.ScheduleService;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Tag(name = "Schedules", description = "Schedule management API")
public class ScheduleController {

    private final ScheduleService scheduleService;
    private final ScheduleMapper scheduleMapper;

    @GetMapping
    @Operation(summary = "Get all schedules")
    public ResponseEntity<List<ScheduleDto>> getAll() {
        return ResponseEntity.ok(scheduleMapper.toDtoList(scheduleService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get schedule by ID")
    public ResponseEntity<ScheduleDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleMapper.toDto(scheduleService.findById(id)));
    }

    @GetMapping("/air-conditioner/{acId}")
    @Operation(summary = "Get schedules by air conditioner ID")
    public ResponseEntity<List<ScheduleDto>> getByAirConditionerId(@PathVariable Long acId) {
        return ResponseEntity.ok(scheduleMapper.toDtoList(scheduleService.findByAirConditionerId(acId)));
    }

    @GetMapping("/active")
    @Operation(summary = "Get all active schedules")
    public ResponseEntity<List<ScheduleDto>> getActiveSchedules(
            @RequestParam(required = false) String dayOfWeek) {
        if (dayOfWeek != null) {
            return ResponseEntity.ok(scheduleMapper.toDtoList(
                    scheduleService.findActiveSchedulesByDayOfWeek(dayOfWeek)));
        }
        return ResponseEntity.ok(scheduleMapper.toDtoList(scheduleService.findActiveSchedules()));
    }

    @PostMapping("/air-conditioner/{acId}")
    @Operation(summary = "Create a new schedule for an air conditioner")
    public ResponseEntity<ScheduleDto> create(@PathVariable Long acId, @RequestBody ScheduleDto dto) {
        Schedule schedule = Schedule.builder()
                .name(dto.getName())
                .dayOfWeek(dto.getDayOfWeek())
                .specificDate(dto.getSpecificDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .mode(dto.getMode())
                .targetTemperature(dto.getTargetTemperature())
                .periodicity(dto.getPeriodicity())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        var created = scheduleService.create(acId, schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(scheduleMapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a schedule")
    public ResponseEntity<ScheduleDto> update(@PathVariable Long id, @RequestBody ScheduleDto dto) {
        var schedule = scheduleMapper.toEntity(dto);
        var updated = scheduleService.update(id, schedule);
        return ResponseEntity.ok(scheduleMapper.toDto(updated));
    }

    @PostMapping("/{id}/toggle")
    @Operation(summary = "Toggle schedule active status")
    public ResponseEntity<ScheduleDto> toggleActive(@PathVariable Long id) {
        var schedule = scheduleService.toggleActive(id);
        return ResponseEntity.ok(scheduleMapper.toDto(schedule));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a schedule")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
