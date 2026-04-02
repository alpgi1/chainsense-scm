import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoGate } from './components/shared/DemoGate';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ChaosAnalysisPage } from './pages/ChaosAnalysisPage';
import { HistoryPage } from './pages/HistoryPage';
import { InventoryPage } from './pages/InventoryPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { RetrievalModeProvider } from './context/RetrievalModeContext';

function App() {
  return (
    <RetrievalModeProvider>
      <DemoGate>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/chaos" element={<ChaosAnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </DemoGate>
    </RetrievalModeProvider>
  );
}

export default App;
