import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoGate } from './components/shared/DemoGate';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ChaosAnalysisPage } from './pages/ChaosAnalysisPage';
import { HistoryPage } from './pages/HistoryPage';
import { InventoryPage } from './pages/InventoryPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { RetrievalModeProvider } from './context/RetrievalModeContext';
import { ToastProvider } from './context/ToastContext';
import { CommandPalette } from './components/shared/CommandPalette';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function AppInner() {
  const { paletteOpen, setPaletteOpen } = useKeyboardShortcuts();

  return (
    <>
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
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </>
  );
}

function App() {
  return (
    <RetrievalModeProvider>
      <ToastProvider>
        <DemoGate>
          <AppInner />
        </DemoGate>
      </ToastProvider>
    </RetrievalModeProvider>
  );
}

export default App;
