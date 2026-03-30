package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RegionRepository extends JpaRepository<Region, UUID> {
}
