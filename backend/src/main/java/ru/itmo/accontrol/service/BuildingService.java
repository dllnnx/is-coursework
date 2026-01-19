package ru.itmo.accontrol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.Building;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.BuildingRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BuildingService {

    private final BuildingRepository buildingRepository;

    @Transactional(readOnly = true)
    public List<Building> findAll() {
        return buildingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Building findById(Long id) {
        return buildingRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Building", id));
    }

    @Transactional(readOnly = true)
    public List<Building> findByUserId(Long userId) {
        return buildingRepository.findBuildingsByUserId(userId.intValue());
    }

    @Transactional(readOnly = true)
    public List<Building> searchByName(String name) {
        return buildingRepository.findByNameContainingIgnoreCase(name);
    }

    public Building create(Building building) {
        return buildingRepository.save(building);
    }

    public Building update(Long id, Building buildingDetails) {
        Building building = findById(id);
        building.setName(buildingDetails.getName());
        building.setAddress(buildingDetails.getAddress());
        return buildingRepository.save(building);
    }

    public void delete(Long id) {
        Building building = findById(id);
        buildingRepository.delete(building);
    }
}
