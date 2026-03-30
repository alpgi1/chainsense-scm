package com.chainsense.scm.model.entity;

import com.chainsense.scm.model.enums.ActionType;
import com.chainsense.scm.model.enums.Priority;
import com.chainsense.scm.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "decision_actions")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DecisionAction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disruption_id", nullable = false)
    private DisruptionLog disruption;

    @Enumerated(EnumType.STRING)
    @Column(name = "action_type", nullable = false, length = 50)
    private ActionType actionType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affected_product_id")
    private Product affectedProduct;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommended_supplier_id")
    private Supplier recommendedSupplier;

    @Column(name = "cost_impact", precision = 10, scale = 2)
    private BigDecimal costImpact;

    @Column(name = "time_impact_days")
    private Integer timeImpactDays;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Status status = Status.PROPOSED;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
