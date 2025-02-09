// components/game/Stats.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsProps {
  stats: { [key: string]: number | string };
}

const Stats: React.FC<StatsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Object.entries(stats).map(([key, value]) => (
       <Card key={key} >
        <CardContent className="p-4">
          <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default Stats;