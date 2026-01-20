package ru.itmo.accontrol.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.itmo.accontrol.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    @EntityGraph(attributePaths = {"userRoles", "userRoles.role", "userRoles.building", "registrationRequest"})
    Optional<User> findById(Integer id);
    
    Optional<User> findByYandexId(String yandexId);

    Optional<User> findByEmail(String email);
    
    boolean existsByYandexId(String yandexId);
    
    boolean existsByEmail(String email);
}
