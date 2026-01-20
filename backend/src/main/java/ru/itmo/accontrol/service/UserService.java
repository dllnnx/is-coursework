package ru.itmo.accontrol.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.Building;
import ru.itmo.accontrol.entity.RegistrationRequest;
import ru.itmo.accontrol.entity.Role;
import ru.itmo.accontrol.entity.User;
import ru.itmo.accontrol.entity.UserRole;
import ru.itmo.accontrol.entity.UserRoleId;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.BuildingRepository;
import ru.itmo.accontrol.repository.RegistrationRequestRepository;
import ru.itmo.accontrol.repository.RoleRepository;
import ru.itmo.accontrol.repository.UserRepository;
import ru.itmo.accontrol.repository.UserRoleRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final BuildingRepository buildingRepository;
    private final RegistrationRequestRepository registrationRequestRepository;

    @Transactional(readOnly = true)
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    @Transactional(readOnly = true)
    public User findByIdWithRelations(Long id) {
        return userRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    @Transactional(readOnly = true)
    public Optional<User> findByYandexId(String yandexId) {
        return userRepository.findByYandexId(yandexId);
    }

    @Transactional(readOnly = true)
    public List<RegistrationRequest> findPendingRequests() {
        return registrationRequestRepository.findByStatus("pending");
    }

    public User createWithPendingRequest(User user) {
        User savedUser = userRepository.save(user);
        RegistrationRequest request = RegistrationRequest.builder()
                .user(savedUser)
                .status("pending")
                .build();
        registrationRequestRepository.save(request);
        return savedUser;
    }

    public User approveRegistration(Long userId) {
        User user = findById(userId);
        RegistrationRequest request = registrationRequestRepository.findByUserId(userId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("RegistrationRequest for user", userId));
        request.setStatus("approved");
        registrationRequestRepository.save(request);
        return user;
    }

    public User rejectRegistration(Long userId) {
        User user = findById(userId);
        RegistrationRequest request = registrationRequestRepository.findByUserId(userId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("RegistrationRequest for user", userId));
        request.setStatus("rejected");
        registrationRequestRepository.save(request);
        return user;
    }

    public UserRole assignRole(Long userId, Long roleId, Long buildingId) {
        User user = findById(userId);
        Role role = roleRepository.findById(roleId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Role", roleId));
        Building building = buildingRepository.findById(buildingId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Building", buildingId));

        UserRoleId userRoleId = new UserRoleId(userId.intValue(), roleId.intValue(), buildingId.intValue());
        UserRole userRole = UserRole.builder()
                .id(userRoleId)
                .user(user)
                .role(role)
                .building(building)
                .build();
        
        return userRoleRepository.save(userRole);
    }

    public void removeRole(Long userId, Long roleId, Long buildingId) {
        UserRoleId userRoleId = new UserRoleId(userId.intValue(), roleId.intValue(), buildingId.intValue());
        userRoleRepository.deleteById(userRoleId);
    }

    @Transactional(readOnly = true)
    public List<UserRole> getUserRoles(Long userId) {
        return userRoleRepository.findByUserId(userId.intValue());
    }

    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }
}
