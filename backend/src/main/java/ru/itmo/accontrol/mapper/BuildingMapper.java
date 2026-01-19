package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import ru.itmo.accontrol.dto.BuildingDto;
import ru.itmo.accontrol.entity.Building;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BuildingMapper {
    
    BuildingDto toDto(Building building);
    
    Building toEntity(BuildingDto dto);
    
    List<BuildingDto> toDtoList(List<Building> buildings);
}
