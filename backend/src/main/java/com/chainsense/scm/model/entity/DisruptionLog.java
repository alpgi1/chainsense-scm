package com.chainsense.scm.model.entity;

import com.chainsense.scm.model.enums.RetrievalMode;
import com.chainsense.scm.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "disruption_log")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DisruptionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "chaos_prompt", nullable = false, columnDefinition = "TEXT")
    private String chaosPrompt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "risk_analysis", nullable = false, columnDefinition = "jsonb")
    private String riskAnalysis;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "action_plan", columnDefinition = "jsonb")
    private String actionPlan;

    @Column(name = "overall_risk_score")
    private Integer overallRiskScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "retrieval_mode", length = 20)
    @Builder.Default
    private RetrievalMode retrievalMode = RetrievalMode.CONTEXT;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "disruption", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DecisionAction> actions = new ArrayList<>();
}
