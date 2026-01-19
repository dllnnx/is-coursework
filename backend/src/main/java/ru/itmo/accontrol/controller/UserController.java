package ru.itmo.accontrol.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.itmo.accontrol.dto.AssignRoleRequest;
import ru.itmo.accontrol.dto.UserDto;
import ru.itmo.accontrol.dto.UserRoleDto;
import ru.itmo.accontrol.entity.RegistrationRequest;
import ru.itmo.accontrol.mapper.UserMapper;
import ru.itmo.accontrol.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management API")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserDto>> getAll() {
        return ResponseEntity.ok(userMapper.toDtoList(userService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userMapper.toDto(userService.findById(id)));
    }

    @GetMapping("/{id}/roles")
    @Operation(summary = "Get roles of a user")
    public ResponseEntity<List<UserRoleDto>> getUserRoles(@PathVariable Long id) {
        var roles = userService.getUserRoles(id);
        return ResponseEntity.ok(roles.stream()
                .map(ur -> UserRoleDto.builder()
                        .roleId(Long.valueOf(ur.getRole().getId()))
                        .roleName(ur.getRole().getName())
                        .buildingId(Long.valueOf(ur.getBuilding().getId()))
                        .buildingName(ur.getBuilding().getName())
                        .build())
                .collect(Collectors.toList()));
    }

    @GetMapping("/pending")
    @Operation(summary = "Get pending registration requests")
    public ResponseEntity<List<UserDto>> getPendingRequests() {
        List<RegistrationRequest> requests = userService.findPendingRequests();
        return ResponseEntity.ok(requests.stream()
                .map(r -> userMapper.toDto(r.getUser()))
                .collect(Collectors.toList()));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve a user registration")
    public ResponseEntity<UserDto> approveRegistration(@PathVariable Long id) {
        var user = userService.approveRegistration(id);
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject a user registration")
    public ResponseEntity<UserDto> rejectRegistration(@PathVariable Long id) {
        var user = userService.rejectRegistration(id);
        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @PostMapping("/{id}/roles")
    @Operation(summary = "Assign a role to a user")
    public ResponseEntity<UserRoleDto> assignRole(
            @PathVariable Long id, @RequestBody AssignRoleRequest request) {
        var userRole = userService.assignRole(id, request.getRoleId(), request.getBuildingId());
        return ResponseEntity.ok(UserRoleDto.builder()
                .roleId(Long.valueOf(userRole.getRole().getId()))
                .roleName(userRole.getRole().getName())
                .buildingId(Long.valueOf(userRole.getBuilding().getId()))
                .buildingName(userRole.getBuilding().getName())
                .build());
    }

    @DeleteMapping("/{userId}/roles/{roleId}/buildings/{buildingId}")
    @Operation(summary = "Remove a role from a user")
    public ResponseEntity<Void> removeRole(
            @PathVariable Long userId,
            @PathVariable Long roleId,
            @PathVariable Long buildingId) {
        userService.removeRole(userId, roleId, buildingId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
