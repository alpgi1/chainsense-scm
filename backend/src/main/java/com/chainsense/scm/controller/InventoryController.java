package com.chainsense.scm.controller;

import com.chainsense.scm.model.dto.ApiResponse;
import com.chainsense.scm.model.entity.Inventory;
import com.chainsense.scm.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Inventory>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findAll()));
    }

    @GetMapping("/alerts")
    public ResponseEntity<ApiResponse<List<Inventory>>> getBelowReorder() {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findBelowReorderPoint()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Inventory>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.findById(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<Inventory>> update(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(ApiResponse.ok(inventoryService.update(id, updates), "Inventory updated"));
    }
}
