package com.chainsense.scm.controller;

import com.chainsense.scm.model.dto.ApiResponse;
import com.chainsense.scm.model.entity.Product;
import com.chainsense.scm.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(productService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(productService.findById(id)));
    }
}
