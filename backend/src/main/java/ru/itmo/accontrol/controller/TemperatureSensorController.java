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
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.accontrol.dto.TemperatureSensorDto;
import ru.itmo.accontrol.entity.TemperatureSensor;
import ru.itmo.accontrol.mapper.TemperatureSensorMapper;
import ru.itmo.accontrol.service.TemperatureSensorService;

import java.util.List;

@RestController
@RequestMapping("/api/sensors")
@RequiredArgsConstructor
@Tag(name = "Temperature Sensors", description = "Temperature sensor management API")
public class TemperatureSensorController {

    private final TemperatureSensorService sensorService;
    private final TemperatureSensorMapper sensorMapper;

    @GetMapping
    @Operation(summary = "Get all temperature sensors")
    public ResponseEntity<List<TemperatureSensorDto>> getAll() {
        return ResponseEntity.ok(sensorMapper.toDtoList(sensorService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get temperature sensor by ID")
    public ResponseEntity<TemperatureSensorDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(sensorMapper.toDto(sensorService.findById(id)));
    }

    @GetMapping("/room/{roomId}")
    @Operation(summary = "Get temperature sensors by room ID")
    public ResponseEntity<List<TemperatureSensorDto>> getByRoomId(@PathVariable Long roomId) {
        return ResponseEntity.ok(sensorMapper.toDtoList(sensorService.findByRoomId(roomId)));
    }

    @GetMapping("/building/{buildingId}")
    @Operation(summary = "Get temperature sensors by building ID")
    public ResponseEntity<List<TemperatureSensorDto>> getByBuildingId(@PathVariable Long buildingId) {
        return ResponseEntity.ok(sensorMapper.toDtoList(sensorService.findByBuildingId(buildingId)));
    }

    @PostMapping("/room/{roomId}")
    @Operation(summary = "Create a new temperature sensor in a room")
    public ResponseEntity<TemperatureSensorDto> create(@PathVariable Long roomId, @RequestBody TemperatureSensorDto dto) {
        TemperatureSensor sensor = TemperatureSensor.builder()
                .name(dto.getName())
                .model(dto.getModel())
                .currentTemperature(dto.getCurrentTemperature() != null ? dto.getCurrentTemperature() : 20.0)
                .build();
        var created = sensorService.create(roomId, sensor);
        return ResponseEntity.status(HttpStatus.CREATED).body(sensorMapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a temperature sensor")
    public ResponseEntity<TemperatureSensorDto> update(@PathVariable Long id, @RequestBody TemperatureSensorDto dto) {
        var sensor = sensorMapper.toEntity(dto);
        var updated = sensorService.update(id, sensor);
        return ResponseEntity.ok(sensorMapper.toDto(updated));
    }

    @PutMapping("/{id}/temperature")
    @Operation(summary = "Update current temperature reading")
    public ResponseEntity<TemperatureSensorDto> updateTemperature(@PathVariable Long id, @RequestBody Double temperature) {
        var sensor = sensorService.updateTemperature(id, temperature);
        return ResponseEntity.ok(sensorMapper.toDto(sensor));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a temperature sensor")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sensorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
