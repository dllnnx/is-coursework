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
import ru.itmo.accontrol.dto.BuildingDto;
import ru.itmo.accontrol.mapper.BuildingMapper;
import ru.itmo.accontrol.service.BuildingService;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
@Tag(name = "Buildings", description = "Building management API")
public class BuildingController {

    private final BuildingService buildingService;
    private final BuildingMapper buildingMapper;

    @GetMapping
    @Operation(summary = "Get all buildings")
    public ResponseEntity<List<BuildingDto>> getAll() {
        return ResponseEntity.ok(buildingMapper.toDtoList(buildingService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get building by ID")
    public ResponseEntity<BuildingDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(buildingMapper.toDto(buildingService.findById(id)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search buildings by name")
    public ResponseEntity<List<BuildingDto>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(buildingMapper.toDtoList(buildingService.searchByName(name)));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get buildings accessible by user")
    public ResponseEntity<List<BuildingDto>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(buildingMapper.toDtoList(buildingService.findByUserId(userId)));
    }

    @PostMapping
    @Operation(summary = "Create a new building")
    public ResponseEntity<BuildingDto> create(@RequestBody BuildingDto dto) {
        var building = buildingMapper.toEntity(dto);
        var created = buildingService.create(building);
        return ResponseEntity.status(HttpStatus.CREATED).body(buildingMapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a building")
    public ResponseEntity<BuildingDto> update(@PathVariable Long id, @RequestBody BuildingDto dto) {
        var building = buildingMapper.toEntity(dto);
        var updated = buildingService.update(id, building);
        return ResponseEntity.ok(buildingMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a building")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        buildingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
