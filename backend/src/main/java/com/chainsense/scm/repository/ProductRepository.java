package com.chainsense.scm.repository;

import com.chainsense.scm.model.entity.Product;
import com.chainsense.scm.model.enums.Criticality;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    List<Product> findByCriticality(Criticality criticality);

    List<Product> findByCategory(String category);
}
