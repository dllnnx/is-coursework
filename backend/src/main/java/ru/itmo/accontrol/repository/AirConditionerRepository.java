package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.AirConditioner;

import java.util.List;

@Repository
public interface AirConditionerRepository extends JpaRepository<AirConditioner, Long> {
    
    List<AirConditioner> findByRoomId(Long roomId);
    
    List<AirConditioner> findByStatus(String status);
    
    List<AirConditioner> findByMode(String mode);
    
    @Query("SELECT ac FROM AirConditioner ac WHERE ac.room.building.id = :buildingId")
    List<AirConditioner> findByBuildingId(@Param("buildingId") Long buildingId);
    
    @Query("SELECT ac FROM AirConditioner ac JOIN ac.groups g WHERE g.id = :groupId")
    List<AirConditioner> findByGroupId(@Param("groupId") Long groupId);
}
