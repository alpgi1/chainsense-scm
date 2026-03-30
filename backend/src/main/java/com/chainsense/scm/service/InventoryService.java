package com.chainsense.scm.service;

import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.entity.Inventory;
import com.chainsense.scm.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public List<Inventory> findAll() {
        return inventoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Inventory findById(UUID id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", id));
    }

    @Transactional(readOnly = true)
    public List<Inventory> findBelowReorderPoint() {
        return inventoryRepository.findBelowReorderPoint();
    }

    @Transactional
    public Inventory update(UUID id, Map<String, Object> updates) {
        Inventory inventory = findById(id);
        if (updates.containsKey("quantityOnHand")) {
            inventory.setQuantityOnHand(((Number) updates.get("quantityOnHand")).intValue());
        }
        if (updates.containsKey("dailyConsumptionRate")) {
            inventory.setDailyConsumptionRate(((Number) updates.get("dailyConsumptionRate")).intValue());
        }
        if (updates.containsKey("reorderPoint")) {
            inventory.setReorderPoint(((Number) updates.get("reorderPoint")).intValue());
        }
        inventory.setLastUpdated(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }
}
