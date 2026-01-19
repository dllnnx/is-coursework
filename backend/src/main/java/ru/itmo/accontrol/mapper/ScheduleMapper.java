package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import ru.itmo.accontrol.dto.ScheduleDto;
import ru.itmo.accontrol.entity.Schedule;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ScheduleMapper {
    
    @Mapping(source = "airConditioner.id", target = "airConditionerId")
    @Mapping(source = "airConditioner.name", target = "airConditionerName")
    ScheduleDto toDto(Schedule schedule);
    
    Schedule toEntity(ScheduleDto dto);
    
    List<ScheduleDto> toDtoList(List<Schedule> schedules);
}
