package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import ru.itmo.accontrol.dto.UserDto;
import ru.itmo.accontrol.dto.UserRoleDto;
import ru.itmo.accontrol.entity.RegistrationRequest;
import ru.itmo.accontrol.entity.User;
import ru.itmo.accontrol.entity.UserRole;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {
    
    @Mapping(source = "userRoles", target = "roles", qualifiedByName = "toRoleDtos")
    @Mapping(source = "registrationRequest", target = "registrationStatus", qualifiedByName = "toStatus")
    UserDto toDto(User user);
    
    User toEntity(UserDto dto);
    
    List<UserDto> toDtoList(List<User> users);
    
    @Named("toRoleDtos")
    default List<UserRoleDto> toRoleDtos(Set<UserRole> userRoles) {
        if (userRoles == null) {
            return List.of();
        }
        return userRoles.stream()
                .map(ur -> UserRoleDto.builder()
                        .roleId(Long.valueOf(ur.getRole().getId()))
                        .roleName(ur.getRole().getName())
                        .buildingId(Long.valueOf(ur.getBuilding().getId()))
                        .buildingName(ur.getBuilding().getName())
                        .build())
                .collect(Collectors.toList());
    }
    
    @Named("toStatus")
    default String toStatus(RegistrationRequest request) {
        return request != null ? request.getStatus() : null;
    }
}
