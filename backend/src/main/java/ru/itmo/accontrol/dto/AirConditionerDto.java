package ru.itmo.accontrol.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AirConditionerDto {
    private Long id;
    private Long roomId;
    private String roomName;
    private String name;
    private String model;
    private String status;
    private String mode;
    private Double targetTemperature;
}
