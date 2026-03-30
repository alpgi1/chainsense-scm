package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {

    Optional<Inventory> findByProductId(UUID productId);

    @Query("SELECT i FROM Inventory i WHERE i.quantityOnHand <= i.reorderPoint")
    List<Inventory> findBelowReorderPoint();
}
