package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.SupplyRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.UUID;

public interface SupplyRouteRepository extends JpaRepository<SupplyRoute, UUID> {

    List<SupplyRoute> findByProductId(UUID productId);

    List<SupplyRoute> findBySupplierId(UUID supplierId);

    List<SupplyRoute> findByIsPrimaryTrue();

    @Query("SELECT sr FROM SupplyRoute sr " +
           "JOIN FETCH sr.supplier s " +
           "JOIN FETCH s.region " +
           "JOIN FETCH sr.product p")
    List<SupplyRoute> findAllWithDetails();

    List<SupplyRoute> findByProductIdIn(List<UUID> productIds);
}
