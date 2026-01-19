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
import ru.itmo.accontrol.dto.AcGroupDto;
import ru.itmo.accontrol.dto.AirConditionerDto;
import ru.itmo.accontrol.dto.SetModeRequest;
import ru.itmo.accontrol.entity.AcGroup;
import ru.itmo.accontrol.mapper.AcGroupMapper;
import ru.itmo.accontrol.mapper.AirConditionerMapper;
import ru.itmo.accontrol.service.AcGroupService;
import ru.itmo.accontrol.service.AirConditionerService;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
@Tag(name = "AC Groups", description = "Air conditioner group management API")
public class AcGroupController {

    private final AcGroupService groupService;
    private final AirConditionerService acService;
    private final AcGroupMapper groupMapper;
    private final AirConditionerMapper acMapper;

    @GetMapping
    @Operation(summary = "Get all AC groups")
    public ResponseEntity<List<AcGroupDto>> getAll() {
        return ResponseEntity.ok(groupMapper.toDtoList(groupService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get AC group by ID")
    public ResponseEntity<AcGroupDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(groupMapper.toDto(groupService.findById(id)));
    }

    @GetMapping("/{id}/air-conditioners")
    @Operation(summary = "Get air conditioners in a group")
    public ResponseEntity<List<AirConditionerDto>> getAirConditioners(@PathVariable Long id) {
        return ResponseEntity.ok(acMapper.toDtoList(acService.findByGroupId(id)));
    }

    @PostMapping
    @Operation(summary = "Create a new AC group")
    public ResponseEntity<AcGroupDto> create(@RequestBody AcGroupDto dto) {
        AcGroup group = AcGroup.builder().name(dto.getName()).build();
        var created = groupService.create(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(groupMapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an AC group")
    public ResponseEntity<AcGroupDto> update(@PathVariable Long id, @RequestBody AcGroupDto dto) {
        var group = groupMapper.toEntity(dto);
        var updated = groupService.update(id, group);
        return ResponseEntity.ok(groupMapper.toDto(updated));
    }

    @PostMapping("/{groupId}/air-conditioners/{acId}")
    @Operation(summary = "Add an air conditioner to a group")
    public ResponseEntity<AcGroupDto> addAirConditioner(
            @PathVariable Long groupId, @PathVariable Long acId) {
        var group = groupService.addAirConditioner(groupId, acId);
        return ResponseEntity.ok(groupMapper.toDto(group));
    }

    @DeleteMapping("/{groupId}/air-conditioners/{acId}")
    @Operation(summary = "Remove an air conditioner from a group")
    public ResponseEntity<AcGroupDto> removeAirConditioner(
            @PathVariable Long groupId, @PathVariable Long acId) {
        var group = groupService.removeAirConditioner(groupId, acId);
        return ResponseEntity.ok(groupMapper.toDto(group));
    }

    @PostMapping("/{id}/set-mode")
    @Operation(summary = "Set mode for all air conditioners in a group")
    public ResponseEntity<Void> setGroupMode(@PathVariable Long id, @RequestBody SetModeRequest request) {
        groupService.setGroupMode(id, request.getMode(), request.getTargetTemperature());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/turn-on")
    @Operation(summary = "Turn on all air conditioners in a group")
    public ResponseEntity<Void> turnOnGroup(@PathVariable Long id) {
        groupService.turnOnGroup(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/turn-off")
    @Operation(summary = "Turn off all air conditioners in a group")
    public ResponseEntity<Void> turnOffGroup(@PathVariable Long id) {
        groupService.turnOffGroup(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an AC group")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        groupService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
