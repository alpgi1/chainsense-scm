package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.DisruptionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;

public interface DisruptionLogRepository extends JpaRepository<DisruptionLog, UUID> {

    Page<DisruptionLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
