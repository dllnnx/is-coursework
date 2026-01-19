package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import ru.itmo.accontrol.dto.TemperatureSensorDto;
import ru.itmo.accontrol.entity.TemperatureSensor;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface TemperatureSensorMapper {
    
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "room.name", target = "roomName")
    TemperatureSensorDto toDto(TemperatureSensor sensor);
    
    TemperatureSensor toEntity(TemperatureSensorDto dto);
    
    List<TemperatureSensorDto> toDtoList(List<TemperatureSensor> sensors);
}
