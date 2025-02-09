'use client';

import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {Button }from '@/components/ui/button';
// Local Imports (Adjust paths if needed)
import Header from '@/components/game/Header';
import Tasks from '@/components/game/Task';
import Stats from '@/components/game/Stats';
import Modal from '@/components/game/Modal';
 // Assuming you have this

// --- Main App Component ---
const DeFiGame = () => {
  const { toast } = useToast();

  // Faked State
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userStakedAmount, setUserStakedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userCompletedTasks, setUserCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [stakingAmount, setStakingAmount] = useState('');
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  const [stats, setStats] = useState<{ [key: string]: number | string }>({
    totalUsers: 0,
    totalPointsAwarded: 0,
    activeStakers: 0,
    rewardsDistributed: 0,
  });

  const [tasks, setTasks] = useState<any[]>([
    { id: '1', name: 'Stake 100 AMB Tokens', points: 50, requiredAmount: 100, taskType: 0 },
    { id: '2', name: 'Add Liquidity to AMB/ETH Pool', points: 100, requiredAmount: 200, taskType: 2 },
    { id: '3', name: 'Vote in Governance Proposal', points: 75, requiredAmount: 0, taskType: 1 },
    { id: '4', name: 'Hold AMB for 30 Days', points: 150, requiredAmount: 500, taskType: 3 },
  ]);

  const [leaders] = useState([ // Example leaderboard data
    { address: "0x1234...5678", points: 1500 },
    { address: "0x8765...4321", points: 1200 },
    { address: "0x9876...3210", points: 1000 },
    { address: "0x4321...8765", points: 800 }
  ]);

  // Faked Connection
  const handleConnect = () => {
    setUserAddress('0x1234...5678');
    setUserPoints(100);
    setUserStakedAmount(500); // Give some initial staked amount for testing
        toast({
            title: "Wallet Connected",
            description: "Successfully connected to your wallet",
        });
  };

  const handleDisconnect = () => {
    setUserAddress(null);
    setUserPoints(0);
    setUserStakedAmount(0);
    setUserCompletedTasks({});
    toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from your wallet",
    });
  };

  // Faked Staking
  const handleStake = async () => {
    setLoading(true);
    try {
      const amount = parseFloat(stakingAmount);
      if (isNaN(amount) || amount <= 0) {
          toast({
            title: "Invalid amount",
            description: "Please enter a valid amount to stake",
            variant: "destructive",
        });
        return;
      }

      // Simulate staking
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserStakedAmount(prev => prev + amount);
      setUserPoints(prev => prev + 50);
      setUserCompletedTasks(prev => ({ ...prev, '1': true }));
      toast({
            title: "Stake Successful",
            description: `Successfully staked ${stakingAmount} AMB.`,
        });
      setStakingAmount('');
      setIsStakeModalOpen(false);
    } catch (error) {
      console.error("Staking error:", error);
        toast({
            title: "Staking Failed",
            description: "An error occurred while staking.",
            variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  };

  // Faked Task Completion
const completeTask = async (taskId: string) => {
    setLoading(true);
    try {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        if (task.taskType === 0) {
            setIsStakeModalOpen(true)
            return;
        }
        // Simulate task completion
        await new Promise(resolve => setTimeout(resolve, 1000));

        setUserCompletedTasks(prev => ({ ...prev, [taskId]: true }));

        const completedTask = tasks.find(t => t.id === taskId);
        if (completedTask) {
            setUserPoints(prev => prev + completedTask.points);
        }
        toast({
            title: "Task Completed",
            description: "Task completed successfully!",
        });

    } catch (error: any) {
        console.error("Error completing task:", error);
        toast({
            title: "Task Failed",
            description:  `Error: ${error.message}`,
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="p-4">
      <Header
        userAddress={userAddress}
        userPoints={userPoints}
        userStakedAmount={userStakedAmount}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      <Stats stats={stats}  />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tasks
          tasks={tasks}
          onCompleteTask={completeTask}
          isConnected={!!userAddress}
          loading={loading}
          userCompletedTasks={userCompletedTasks}
          onStake={() => setIsStakeModalOpen(true)}
        />
        
      </div>
        

      {/* Stake Modal */}
      <Modal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        title="Stake AMB"
      >
        <input
          type="number"
          placeholder="Enter amount"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
        />
        <div className="flex justify-end">
          <Button variant="secondary" onClick={() => setIsStakeModalOpen(false)}>Cancel</Button>
          <Button onClick={handleStake} disabled={loading}>
            {loading ? 'Staking...' : 'Confirm Stake'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DeFiGame;