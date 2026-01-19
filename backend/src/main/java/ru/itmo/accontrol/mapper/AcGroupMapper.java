package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.Named;
import ru.itmo.accontrol.dto.AcGroupDto;
import ru.itmo.accontrol.entity.AcGroup;
import ru.itmo.accontrol.entity.AirConditioner;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface AcGroupMapper {
    
    @Mapping(source = "airConditioners", target = "airConditionerIds", qualifiedByName = "toAcIds")
    AcGroupDto toDto(AcGroup group);
    
    AcGroup toEntity(AcGroupDto dto);
    
    List<AcGroupDto> toDtoList(List<AcGroup> groups);
    
    @Named("toAcIds")
    default List<Long> toAcIds(Set<AirConditioner> airConditioners) {
        if (airConditioners == null) {
            return List.of();
        }
        return airConditioners.stream()
                .map(AirConditioner::getId)
                .map(Long::valueOf)
                .collect(Collectors.toList());
    }
}
