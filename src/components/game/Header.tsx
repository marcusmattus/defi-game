// components/game/Header.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming Button is from Shadcn
import { Badge } from '@/components/ui/badge';  // Assuming Badge is from Shadcn
import { Wallet, Activity } from 'lucide-react';

interface HeaderProps {
    userAddress: string | null;
    userPoints: number;
    userStakedAmount: number;
    onConnect: () => void;
    onDisconnect: () => void;
}

const Header: React.FC<HeaderProps> = ({ userAddress, userPoints, userStakedAmount, onConnect, onDisconnect }) => (
    <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground shadow-md">
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6" />
        <h1 className="text-xl font-bold">AirDAO DeFi Game</h1>
      </div>
        {!userAddress ? (
            <Button onClick={onConnect} variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
            </Button>
        ) : (
            <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-white text-blue-600 font-semibold">
                    {userPoints} Points
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-white text-blue-600 font-semibold">
                   {userStakedAmount} AMB Staked
                 </Badge>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-mono">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </span>
                 <Button onClick={onDisconnect} variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                    Disconnect
                </Button>
            </div>
        )}
    </div>
);

export default Header;