package com.chainsense.scm.service;

import com.chainsense.scm.model.entity.Inventory;
import com.chainsense.scm.model.entity.Product;
import com.chainsense.scm.model.entity.Supplier;
import com.chainsense.scm.model.entity.SupplyRoute;
import com.chainsense.scm.repository.InventoryRepository;
import com.chainsense.scm.repository.ProductRepository;
import com.chainsense.scm.repository.SupplierRepository;
import com.chainsense.scm.repository.SupplyRouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupplyChainQueryService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final SupplyRouteRepository supplyRouteRepository;

    @Transactional(readOnly = true)
    public String buildFullContext() {
        List<Product> products = productRepository.findAll();
        List<SupplyRoute> routes = supplyRouteRepository.findAllWithDetails();
        List<Inventory> inventories = inventoryRepository.findAll();

        Map<UUID, Inventory> inventoryByProduct = inventories.stream()
                .collect(Collectors.toMap(i -> i.getProduct().getId(), Function.identity()));

        StringBuilder sb = new StringBuilder();
        sb.append("=== SUPPLY CHAIN CONTEXT ===\n\n");

        sb.append("--- PRODUCTS & INVENTORY ---\n");
        for (Product p : products) {
            Inventory inv = inventoryByProduct.get(p.getId());
            double daysLeft = inv != null && inv.getDailyConsumptionRate() > 0
                    ? (double) inv.getQuantityOnHand() / inv.getDailyConsumptionRate()
                    : 0;
            sb.append(String.format(
                    "PRODUCT[%s] %s (%s) | criticality=%s | stock=%d | daily_use=%d | days_left=%.1f | reorder_at=%d%n",
                    p.getId(), p.getName(), p.getSku(),
                    p.getCriticality(),
                    inv != null ? inv.getQuantityOnHand() : 0,
                    inv != null ? inv.getDailyConsumptionRate() : 0,
                    daysLeft,
                    inv != null ? inv.getReorderPoint() : 0
            ));
        }

        sb.append("\n--- SUPPLY ROUTES ---\n");
        for (SupplyRoute r : routes) {
            String hubPorts = r.getHubPorts() != null ? String.join(", ", r.getHubPorts()) : "none";
            sb.append(String.format(
                    "ROUTE | product=%s | supplier=%s | region=%s | transit_days=%d | cost=%.2f | primary=%s | hub_ports=[%s] | route=%s%n",
                    r.getProduct().getName(),
                    r.getSupplier().getName(),
                    r.getSupplier().getRegion().getName(),
                    r.getTransitDays(),
                    r.getUnitCost(),
                    r.getIsPrimary() ? "YES" : "no",
                    hubPorts,
                    r.getTransitRoute()
            ));
        }

        return sb.toString();
    }

    @Transactional(readOnly = true)
    public String buildAlternativeContext(List<UUID> affectedProductIds) {
        if (affectedProductIds == null || affectedProductIds.isEmpty()) {
            return "";
        }

        List<SupplyRoute> routes = supplyRouteRepository.findByProductIdIn(affectedProductIds);
        List<Inventory> inventories = inventoryRepository.findAll();

        Map<UUID, Inventory> inventoryByProduct = inventories.stream()
                .collect(Collectors.toMap(i -> i.getProduct().getId(), Function.identity()));

        StringBuilder sb = new StringBuilder();
        sb.append("=== ALTERNATIVE SUPPLIERS FOR AFFECTED PRODUCTS ===\n\n");

        for (SupplyRoute r : routes) {
            Supplier s = r.getSupplier();
            Inventory inv = inventoryByProduct.get(r.getProduct().getId());
            double daysLeft = inv != null && inv.getDailyConsumptionRate() > 0
                    ? (double) inv.getQuantityOnHand() / inv.getDailyConsumptionRate()
                    : 0;
            String hubPorts = r.getHubPorts() != null ? String.join(", ", r.getHubPorts()) : "none";

            sb.append(String.format(
                    "OPTION | product=%s (id=%s) | supplier=%s (id=%s) | reliability=%.2f | lead_days=%d | region=%s | transit_days=%d | unit_cost=%.2f | primary=%s | hub_ports=[%s] | stock_days_left=%.1f%n",
                    r.getProduct().getName(), r.getProduct().getId(),
                    s.getName(), s.getId(),
                    s.getReliabilityScore(), s.getLeadTimeDays(),
                    s.getRegion().getName(),
                    r.getTransitDays(), r.getUnitCost(),
                    r.getIsPrimary() ? "YES" : "no",
                    hubPorts, daysLeft
            ));
        }

        return sb.toString();
    }
}
