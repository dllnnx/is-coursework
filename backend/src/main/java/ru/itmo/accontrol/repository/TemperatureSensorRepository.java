package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.TemperatureSensor;

import java.util.List;

@Repository
public interface TemperatureSensorRepository extends JpaRepository<TemperatureSensor, Long> {
    
    List<TemperatureSensor> findByRoomId(Long roomId);
    
    @Query("SELECT ts FROM TemperatureSensor ts WHERE ts.room.building.id = :buildingId")
    List<TemperatureSensor> findByBuildingId(@Param("buildingId") Long buildingId);
}
