package ru.itmo.accontrol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.Room;
import ru.itmo.accontrol.entity.TemperatureSensor;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.TemperatureSensorRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TemperatureSensorService {

    private final TemperatureSensorRepository sensorRepository;
    private final RoomService roomService;

    @Transactional(readOnly = true)
    public List<TemperatureSensor> findAll() {
        return sensorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TemperatureSensor findById(Long id) {
        return sensorRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("TemperatureSensor", id));
    }

    @Transactional(readOnly = true)
    public List<TemperatureSensor> findByRoomId(Long roomId) {
        return sensorRepository.findByRoomId(roomId.intValue());
    }

    @Transactional(readOnly = true)
    public List<TemperatureSensor> findByBuildingId(Long buildingId) {
        return sensorRepository.findByBuildingId(buildingId.intValue());
    }

    public TemperatureSensor create(Long roomId, TemperatureSensor sensor) {
        Room room = roomService.findById(roomId);
        sensor.setRoom(room);
        return sensorRepository.save(sensor);
    }

    public TemperatureSensor update(Long id, TemperatureSensor sensorDetails) {
        TemperatureSensor sensor = findById(id);
        sensor.setName(sensorDetails.getName());
        sensor.setModel(sensorDetails.getModel());
        sensor.setCurrentTemperature(sensorDetails.getCurrentTemperature());
        return sensorRepository.save(sensor);
    }

    public TemperatureSensor updateTemperature(Long id, Double temperature) {
        TemperatureSensor sensor = findById(id);
        sensor.setCurrentTemperature(temperature);
        return sensorRepository.save(sensor);
    }

    public void delete(Long id) {
        TemperatureSensor sensor = findById(id);
        sensorRepository.delete(sensor);
    }
}
