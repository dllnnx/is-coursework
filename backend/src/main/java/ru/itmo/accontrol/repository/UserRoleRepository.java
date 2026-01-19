package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.UserRole;
import ru.itmo.accontrol.entity.UserRoleId;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {
    
    List<UserRole> findByUserId(Integer userId);
    
    List<UserRole> findByBuildingId(Integer buildingId);
    
    List<UserRole> findByUserIdAndBuildingId(Integer userId, Integer buildingId);
}
