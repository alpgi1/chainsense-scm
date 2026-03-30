package com.chainsense.scm.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inventory")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity_on_hand", nullable = false)
    @Builder.Default
    private Integer quantityOnHand = 0;

    @Column(name = "daily_consumption_rate", nullable = false)
    @Builder.Default
    private Integer dailyConsumptionRate = 0;

    @Column(name = "reorder_point", nullable = false)
    @Builder.Default
    private Integer reorderPoint = 0;

    @Column(name = "max_capacity", nullable = false)
    @Builder.Default
    private Integer maxCapacity = 10000;

    @Column(name = "warehouse_location", length = 100)
    @Builder.Default
    private String warehouseLocation = "Munich HQ";

    @Column(name = "last_updated")
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();
}
