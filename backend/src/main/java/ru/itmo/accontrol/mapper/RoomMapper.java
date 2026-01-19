package ru.itmo.accontrol.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import ru.itmo.accontrol.dto.RoomDto;
import ru.itmo.accontrol.entity.Room;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface RoomMapper {
    
    @Mapping(source = "building.id", target = "buildingId")
    @Mapping(source = "building.name", target = "buildingName")
    RoomDto toDto(Room room);
    
    Room toEntity(RoomDto dto);
    
    List<RoomDto> toDtoList(List<Room> rooms);
}
