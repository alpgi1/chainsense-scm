package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.DecisionAction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DecisionActionRepository extends JpaRepository<DecisionAction, UUID> {

    List<DecisionAction> findByDisruptionId(UUID disruptionId);
}
