package ru.itmo.accontrol.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SetModeRequest {
    @NotBlank
    private String mode;
    private Double targetTemperature;
}
