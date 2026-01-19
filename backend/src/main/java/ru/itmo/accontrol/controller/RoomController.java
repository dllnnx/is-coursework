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
import ru.itmo.accontrol.dto.RoomDto;
import ru.itmo.accontrol.entity.Room;
import ru.itmo.accontrol.mapper.RoomMapper;
import ru.itmo.accontrol.service.RoomService;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "Rooms", description = "Room management API")
public class RoomController {

    private final RoomService roomService;
    private final RoomMapper roomMapper;

    @GetMapping
    @Operation(summary = "Get all rooms")
    public ResponseEntity<List<RoomDto>> getAll() {
        return ResponseEntity.ok(roomMapper.toDtoList(roomService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get room by ID")
    public ResponseEntity<RoomDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(roomMapper.toDto(roomService.findById(id)));
    }

    @GetMapping("/building/{buildingId}")
    @Operation(summary = "Get rooms by building ID")
    public ResponseEntity<List<RoomDto>> getByBuildingId(@PathVariable Long buildingId) {
        return ResponseEntity.ok(roomMapper.toDtoList(roomService.findByBuildingId(buildingId)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search rooms by name")
    public ResponseEntity<List<RoomDto>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(roomMapper.toDtoList(roomService.searchByName(name)));
    }

    @PostMapping("/building/{buildingId}")
    @Operation(summary = "Create a new room in a building")
    public ResponseEntity<RoomDto> create(@PathVariable Long buildingId, @RequestBody RoomDto dto) {
        Room room = Room.builder().name(dto.getName()).build();
        var created = roomService.create(buildingId, room);
        return ResponseEntity.status(HttpStatus.CREATED).body(roomMapper.toDto(created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a room")
    public ResponseEntity<RoomDto> update(@PathVariable Long id, @RequestBody RoomDto dto) {
        var room = roomMapper.toEntity(dto);
        var updated = roomService.update(id, room);
        return ResponseEntity.ok(roomMapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a room")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
