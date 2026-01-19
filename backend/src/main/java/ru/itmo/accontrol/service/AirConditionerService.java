package ru.itmo.accontrol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.AirConditioner;
import ru.itmo.accontrol.entity.Room;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.AirConditionerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AirConditionerService {

    private final AirConditionerRepository airConditionerRepository;
    private final RoomService roomService;

    @Transactional(readOnly = true)
    public List<AirConditioner> findAll() {
        return airConditionerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AirConditioner findById(Long id) {
        return airConditionerRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("AirConditioner", id));
    }

    @Transactional(readOnly = true)
    public List<AirConditioner> findByRoomId(Long roomId) {
        return airConditionerRepository.findByRoomId(roomId.intValue());
    }

    @Transactional(readOnly = true)
    public List<AirConditioner> findByBuildingId(Long buildingId) {
        return airConditionerRepository.findByBuildingId(buildingId.intValue());
    }

    @Transactional(readOnly = true)
    public List<AirConditioner> findByStatus(String status) {
        return airConditionerRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<AirConditioner> findByMode(String mode) {
        return airConditionerRepository.findByMode(mode);
    }

    @Transactional(readOnly = true)
    public List<AirConditioner> findByGroupId(Long groupId) {
        return airConditionerRepository.findByGroupId(groupId.intValue());
    }

    public AirConditioner create(Long roomId, AirConditioner airConditioner) {
        Room room = roomService.findById(roomId);
        airConditioner.setRoom(room);
        return airConditionerRepository.save(airConditioner);
    }

    public AirConditioner update(Long id, AirConditioner acDetails) {
        AirConditioner ac = findById(id);
        ac.setName(acDetails.getName());
        ac.setModel(acDetails.getModel());
        ac.setStatus(acDetails.getStatus());
        ac.setMode(acDetails.getMode());
        ac.setTargetTemperature(acDetails.getTargetTemperature());
        return airConditionerRepository.save(ac);
    }

    public AirConditioner turnOn(Long id) {
        AirConditioner ac = findById(id);
        ac.setStatus("active");
        return airConditionerRepository.save(ac);
    }

    public AirConditioner turnOff(Long id) {
        AirConditioner ac = findById(id);
        ac.setStatus("inactive");
        ac.setMode("off");
        return airConditionerRepository.save(ac);
    }

    public AirConditioner setMode(Long id, String mode, Double targetTemperature) {
        AirConditioner ac = findById(id);
        ac.setMode(mode);
        if (targetTemperature != null) {
            ac.setTargetTemperature(targetTemperature);
        }
        if (!"off".equals(mode)) {
            ac.setStatus("active");
        }
        return airConditionerRepository.save(ac);
    }

    public void delete(Long id) {
        AirConditioner ac = findById(id);
        airConditionerRepository.delete(ac);
    }
}
