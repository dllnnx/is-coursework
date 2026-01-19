package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.AcGroup;

import java.util.Optional;

@Repository
public interface AcGroupRepository extends JpaRepository<AcGroup, Integer> {
    
    Optional<AcGroup> findByName(String name);
}
