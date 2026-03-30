package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    List<Supplier> findByIsActiveTrue();

    List<Supplier> findByRegionId(UUID regionId);
}
