package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.Building;

import java.util.List;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    
    List<Building> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT DISTINCT b FROM Building b JOIN b.userRoles ur WHERE ur.user.id = :userId")
    List<Building> findBuildingsByUserId(@Param("userId") Long userId);
}
