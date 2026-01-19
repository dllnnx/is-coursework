package ru.itmo.accontrol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String yandexId;
    private String name;
    private String email;
    private String registrationStatus;
    private List<UserRoleDto> roles;
}
