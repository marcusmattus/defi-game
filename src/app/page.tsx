// app/defi-game/page.tsx
// app/defi-game/page.tsx
import DeFiGame from '@/components/game/DeFiGame'; // Adjust path if needed
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'DeFi Game',
    description: 'AirDAO DeFi Game Dashboard',
};


const DefiGamePage = () => {
  return (
      <DeFiGame />
  );
};

export default DefiGamePage;
