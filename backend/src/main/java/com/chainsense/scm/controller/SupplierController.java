package com.chainsense.scm.controller;

import com.chainsense.scm.model.dto.ApiResponse;
import com.chainsense.scm.model.entity.Supplier;
import com.chainsense.scm.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Supplier>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Supplier>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.findById(id)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Supplier>>> getActive() {
        return ResponseEntity.ok(ApiResponse.ok(supplierService.findActive()));
    }
}
