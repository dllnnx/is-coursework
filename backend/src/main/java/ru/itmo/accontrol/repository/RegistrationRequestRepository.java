package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.RegistrationRequest;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRequestRepository extends JpaRepository<RegistrationRequest, Long> {
    
    Optional<RegistrationRequest> findByUserId(Long userId);
    
    List<RegistrationRequest> findByStatus(String status);
}
