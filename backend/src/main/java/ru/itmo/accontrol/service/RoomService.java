package ru.itmo.accontrol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.Building;
import ru.itmo.accontrol.entity.Room;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.RoomRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final BuildingService buildingService;

    @Transactional(readOnly = true)
    public List<Room> findAll() {
        return roomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Room findById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room", id));
    }

    @Transactional(readOnly = true)
    public List<Room> findByBuildingId(Long buildingId) {
        return roomRepository.findByBuildingId(buildingId);
    }

    @Transactional(readOnly = true)
    public List<Room> searchByName(String name) {
        return roomRepository.findByNameContainingIgnoreCase(name);
    }

    public Room create(Long buildingId, Room room) {
        Building building = buildingService.findById(buildingId);
        room.setBuilding(building);
        return roomRepository.save(room);
    }

    public Room update(Long id, Room roomDetails) {
        Room room = findById(id);
        room.setName(roomDetails.getName());
        return roomRepository.save(room);
    }

    public void delete(Long id) {
        Room room = findById(id);
        roomRepository.delete(room);
    }
}
