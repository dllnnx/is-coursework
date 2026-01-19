package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import ru.itmo.accontrol.dto.AirConditionerDto;
import ru.itmo.accontrol.entity.AirConditioner;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AirConditionerMapper {
    
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "room.name", target = "roomName")
    AirConditionerDto toDto(AirConditioner airConditioner);
    
    AirConditioner toEntity(AirConditionerDto dto);
    
    List<AirConditionerDto> toDtoList(List<AirConditioner> airConditioners);
}
