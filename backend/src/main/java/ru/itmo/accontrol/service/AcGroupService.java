package ru.itmo.accontrol.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.itmo.accontrol.entity.AcGroup;
import ru.itmo.accontrol.entity.AirConditioner;
import ru.itmo.accontrol.exception.ResourceNotFoundException;
import ru.itmo.accontrol.repository.AcGroupRepository;
import ru.itmo.accontrol.repository.AirConditionerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AcGroupService {

    private final AcGroupRepository groupRepository;
    private final AirConditionerRepository airConditionerRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public List<AcGroup> findAll() {
        return groupRepository.findAll();
    }

    @Transactional(readOnly = true)
    public AcGroup findById(Long id) {
        return groupRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("AcGroup", id));
    }

    public AcGroup create(AcGroup group) {
        return groupRepository.save(group);
    }

    public AcGroup update(Long id, AcGroup groupDetails) {
        AcGroup group = findById(id);
        group.setName(groupDetails.getName());
        return groupRepository.save(group);
    }

    public AcGroup addAirConditioner(Long groupId, Long airConditionerId) {
        AcGroup group = findById(groupId);
        AirConditioner ac = airConditionerRepository.findById(airConditionerId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("AirConditioner", airConditionerId));
        ac.getGroups().add(group);
        airConditionerRepository.save(ac);
        return group;
    }

    public AcGroup removeAirConditioner(Long groupId, Long airConditionerId) {
        AcGroup group = findById(groupId);
        AirConditioner ac = airConditionerRepository.findById(airConditionerId.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("AirConditioner", airConditionerId));
        ac.getGroups().remove(group);
        airConditionerRepository.save(ac);
        return group;
    }

    public void setGroupMode(Long groupId, String mode, Double targetTemperature) {
        entityManager.createNativeQuery("CALL set_group_ac_mode(:groupId, :mode, :temp)")
                .setParameter("groupId", groupId.intValue())
                .setParameter("mode", mode)
                .setParameter("temp", targetTemperature)
                .executeUpdate();
    }

    public void turnOnGroup(Long groupId) {
        List<AirConditioner> acs = airConditionerRepository.findByGroupId(groupId.intValue());
        for (AirConditioner ac : acs) {
            ac.setStatus("active");
        }
        airConditionerRepository.saveAll(acs);
    }

    public void turnOffGroup(Long groupId) {
        List<AirConditioner> acs = airConditionerRepository.findByGroupId(groupId.intValue());
        for (AirConditioner ac : acs) {
            ac.setStatus("inactive");
            ac.setMode("off");
        }
        airConditionerRepository.saveAll(acs);
    }

    public void delete(Long id) {
        AcGroup group = findById(id);
        groupRepository.delete(group);
    }
}
