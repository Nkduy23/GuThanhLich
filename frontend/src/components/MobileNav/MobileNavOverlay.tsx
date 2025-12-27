// src/components/layout/MobileNav/MobileNavOverlay.tsx
import { memo } from "react";

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavOverlay = memo(({ isOpen, onClose }: MobileNavOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-40 md:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
});

MobileNavOverlay.displayName = "MobileNavOverlay";
export default MobileNavOverlay;
