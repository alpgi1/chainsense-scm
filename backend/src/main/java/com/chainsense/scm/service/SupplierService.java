package com.chainsense.scm.service;

import com.chainsense.scm.exception.ResourceNotFoundException;
import com.chainsense.scm.model.entity.Supplier;
import com.chainsense.scm.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<Supplier> findAll() {
        return supplierRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Supplier findById(UUID id) {
        return supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", id));
    }

    @Transactional(readOnly = true)
    public List<Supplier> findActive() {
        return supplierRepository.findByIsActiveTrue();
    }
}
