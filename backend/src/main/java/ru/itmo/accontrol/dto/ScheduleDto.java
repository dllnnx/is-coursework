package ru.itmo.accontrol.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleDto {
    private Long id;
    private Long airConditionerId;
    private String airConditionerName;
    private String name;
    private String dayOfWeek;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Schema(type = "string", format = "date", example = "2025-01-20")
    private LocalDate specificDate;
    
    @JsonFormat(pattern = "HH:mm:ss")
    @Schema(type = "string", format = "time", example = "09:00:00")
    private LocalTime startTime;
    
    @JsonFormat(pattern = "HH:mm:ss")
    @Schema(type = "string", format = "time", example = "17:00:00")
    private LocalTime endTime;
    
    private String mode;
    private Double targetTemperature;
    private String periodicity;
    private Boolean isActive;
}
