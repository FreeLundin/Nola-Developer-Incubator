import React from 'react';
import { Shop } from '@/components/ui/Shop';

export function CosmeticShop({ onClose }: { onClose: () => void }) {
  return <Shop onClose={onClose} />;
}
