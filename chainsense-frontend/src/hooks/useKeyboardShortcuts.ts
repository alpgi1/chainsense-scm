import { useState, useEffect } from 'react';

interface KeyboardShortcutsResult {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
}

export function useKeyboardShortcuts(): KeyboardShortcutsResult {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      // Escape — close palette
      if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { paletteOpen, setPaletteOpen };
}
