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
import ru.itmo.accontrol.dto.AirConditionerDto;
import ru.itmo.accontrol.dto.SetModeRequest;
import ru.itmo.accontrol.entity.AirConditioner;
import ru.itmo.accontrol.mapper.AirConditionerMapper;
import ru.itmo.accontrol.service.AirConditionerService;

import java.util.List;

@RestController
@RequestMapping("/api/air-conditioners")
@RequiredArgsConstructor
@Tag(name = "Air Conditioners", description = "Air conditioner management API")
public class AirConditionerController {

    private final AirConditionerService acService;
    private final AirConditionerMapper acMapper;

    @GetMapping
    @Operation(summary = "Get all air conditioners")
    public ResponseEntity<List<AirConditionerDto>> getAll() {
        return ResponseEntity.ok(acMapper.toDtoList(acService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get air conditioner by ID")
    public ResponseEntity<AirConditionerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(acMapper.toDto(acService.findById(id)));
    }

    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get air conditioners by room ID")
    public ResponseEntity<List<AirConditionerDto>> getByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(acMapper.toDtoList(acService.findByRoomId(roomId)));
    }

    @GetMapping("/building/{buildingId}")
    @Operation(summary = "Get air conditioners by building ID")
    public ResponseEntity<List<AirConditionerDto>> getByBuildingId(@PathVariable Long buildingId) {
        return ResponseEntity.ok(acMapper.toDtoList(acService.findByBuildingId(buildingId)));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter air conditioners by status or mode")
    public ResponseEntity<List<AirConditionerDto>> filter(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String mode) {
        if (status != null) {
            return ResponseEntity.ok(acMapper.toDtoList(acService.findByStatus(status)));
        } else if (mode != null) {
            return ResponseEntity.ok(acMapper.toDtoList(acService.findByMode(mode)));
        }
        return ResponseEntity.ok(acMapper.toDtoList(acService.findAll()));
    }

    @PostMapping("/room/{roomId}")
    @Operation(summary = "Create a new air conditioner in a room")
    public ResponseEntity<AirConditionerDto> create(@PathVariable Long roomId, @RequestBody AirConditionerDto dto) {
        AirConditioner ac = AirConditioner.builder()
                .name(dto.getName())
                .model(dto.getModel())
                .status(dto.getStatus() != null ? dto.getStatus() : "inactive")
                .mode(dto.getMode())
                .targetTemperature(dto.getTargetTemperature())
                .build();
        var created = acService.create(roomId, ac);
        return ResponseEntity.status(HttpStatus.CREATED).body(acMapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an air conditioner")
    public ResponseEntity<AirConditionerDto> update(@PathVariable Long id, @RequestBody AirConditionerDto dto) {
        var ac = acMapper.toEntity(dto);
        var updated = acService.update(id, ac);
        return ResponseEntity.ok(acMapper.toDto(updated));
    }

    @PostMapping("/{id}/turn-on")
    @Operation(summary = "Turn on an air conditioner")
    public ResponseEntity<AirConditionerDto> turnOn(@PathVariable Long id) {
        var ac = acService.turnOn(id);
        return ResponseEntity.ok(acMapper.toDto(ac));
    }

    @PostMapping("/{id}/turn-off")
    @Operation(summary = "Turn off an air conditioner")
    public ResponseEntity<AirConditionerDto> turnOff(@PathVariable Long id) {
        var ac = acService.turnOff(id);
        return ResponseEntity.ok(acMapper.toDto(ac));
    }

    @PostMapping("/{id}/set-mode")
    @Operation(summary = "Set mode and target temperature for an air conditioner")
    public ResponseEntity<AirConditionerDto> setMode(@PathVariable Long id, @RequestBody SetModeRequest request) {
        var ac = acService.setMode(id, request.getMode(), request.getTargetTemperature());
        return ResponseEntity.ok(acMapper.toDto(ac));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an air conditioner")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        acService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
