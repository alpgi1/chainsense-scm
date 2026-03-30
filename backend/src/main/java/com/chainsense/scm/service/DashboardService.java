package com.chainsense.scm.service;

import com.chainsense.scm.model.dto.DashboardResponse;
import com.chainsense.scm.model.entity.Inventory;
import com.chainsense.scm.model.entity.Product;
import com.chainsense.scm.model.entity.Supplier;
import com.chainsense.scm.model.enums.Criticality;
import com.chainsense.scm.repository.DisruptionLogRepository;
import com.chainsense.scm.repository.InventoryRepository;
import com.chainsense.scm.repository.ProductRepository;
import com.chainsense.scm.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final DisruptionLogRepository disruptionLogRepository;

    @Transactional(readOnly = true)
    public DashboardResponse buildDashboard() {
        List<Product> products = productRepository.findAll();
        List<Inventory> inventories = inventoryRepository.findAll();
        List<Supplier> suppliers = supplierRepository.findByIsActiveTrue();

        Map<UUID, Inventory> invMap = inventories.stream()
                .collect(Collectors.toMap(i -> i.getProduct().getId(), Function.identity()));

        // Build product summaries
        List<DashboardResponse.ProductSummary> productSummaries = products.stream()
                .map(p -> {
                    Inventory inv = invMap.get(p.getId());
                    int qty = inv != null ? inv.getQuantityOnHand() : 0;
                    int daily = inv != null ? inv.getDailyConsumptionRate() : 1;
                    int reorder = inv != null ? inv.getReorderPoint() : 0;
                    double days = daily > 0 ? (double) qty / daily : 0;
                    return new DashboardResponse.ProductSummary(
                            p.getId().toString(), p.getName(), p.getSku(),
                            p.getCategory(), p.getCriticality().name(),
                            qty, daily, reorder, Math.round(days * 10.0) / 10.0,
                            qty <= reorder
                    );
                })
                .collect(Collectors.toList());

        // Build alerts
        List<DashboardResponse.AlertItem> alerts = new ArrayList<>();
        for (Product p : products) {
            Inventory inv = invMap.get(p.getId());
            if (inv == null) continue;
            int qty = inv.getQuantityOnHand();
            int reorder = inv.getReorderPoint();
            int daily = inv.getDailyConsumptionRate();
            double days = daily > 0 ? (double) qty / daily : 0;

            if (qty <= reorder) {
                String level = p.getCriticality() == Criticality.CRITICAL || p.getCriticality() == Criticality.HIGH
                        ? "CRITICAL" : "WARNING";
                alerts.add(new DashboardResponse.AlertItem(
                        p.getId().toString(), p.getName(), p.getCriticality().name(),
                        qty, reorder, Math.round(days * 10.0) / 10.0, level
                ));
            }
        }

        // Stats
        long belowReorder = products.stream()
                .filter(p -> {
                    Inventory inv = invMap.get(p.getId());
                    return inv != null && inv.getQuantityOnHand() <= inv.getReorderPoint();
                }).count();

        long criticalCount = products.stream()
                .filter(p -> p.getCriticality() == Criticality.CRITICAL)
                .count();

        double avgDays = products.stream()
                .mapToDouble(p -> {
                    Inventory inv = invMap.get(p.getId());
                    if (inv == null || inv.getDailyConsumptionRate() == 0) return 0;
                    return (double) inv.getQuantityOnHand() / inv.getDailyConsumptionRate();
                })
                .average().orElse(0);

        DashboardResponse.InventoryStats stats = new DashboardResponse.InventoryStats(
                products.size(), (int) belowReorder, (int) criticalCount,
                Math.round(avgDays * 10.0) / 10.0
        );

        // Supplier summaries
        List<DashboardResponse.SupplierSummary> supplierSummaries = suppliers.stream()
                .map(s -> new DashboardResponse.SupplierSummary(
                        s.getId().toString(), s.getName(),
                        s.getRegion().getCountry(),
                        s.getReliabilityScore().doubleValue(),
                        s.getLeadTimeDays(), s.getIsActive(),
                        s.getRegion().getLatitude() != null ? s.getRegion().getLatitude().doubleValue() : 0,
                        s.getRegion().getLongitude() != null ? s.getRegion().getLongitude().doubleValue() : 0
                ))
                .collect(Collectors.toList());

        // Recent disruptions
        List<DashboardResponse.RecentDisruption> recentDisruptions = disruptionLogRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 5))
                .getContent().stream()
                .map(d -> new DashboardResponse.RecentDisruption(
                        d.getId().toString(), d.getChaosPrompt(),
                        d.getOverallRiskScore() != null ? d.getOverallRiskScore() : 0,
                        d.getStatus().name(), d.getRetrievalMode().name(),
                        d.getCreatedAt().toString()
                ))
                .collect(Collectors.toList());

        return new DashboardResponse(stats, productSummaries, supplierSummaries, alerts, recentDisruptions);
    }
}
