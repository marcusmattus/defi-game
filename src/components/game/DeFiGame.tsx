'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Award, Target, Wallet, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; //Make sure that this path is correct

// --- Main App Component ---
const DeFiGame = () => {
    const { toast } = useToast();

    // Faked State (Replace with real blockchain data later)
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
        activeStakers: 0, // Fake data
        rewardsDistributed: 0, // Fake data
    });

    const [tasks, setTasks] = useState<any[]>([
        { id: '1', name: 'Stake 100 AMB Tokens', points: 50, requiredAmount: 100, taskType: 0 },
        { id: '2', name: 'Add Liquidity to AMB/ETH Pool', points: 100, requiredAmount: 200, taskType: 2 },
        { id: '3', name: 'Vote in Governance Proposal', points: 75, requiredAmount: 0, taskType: 1 },
        { id: '4', name: 'Hold AMB for 30 Days', points: 150, requiredAmount: 500, taskType: 3 },
    ]);
    const [leaders] = useState([
        { address: "0x1234...5678", points: 1500 },
        { address: "0x8765...4321", points: 1200 },
        { address: "0x9876...3210", points: 1000 },
        { address: "0x4321...8765", points: 800 }
    ]);

    // --- Faked Connection Logic ---
    const handleConnect = () => {
        setUserAddress('0x1234...5678'); // Fake address
        setUserPoints(100); // Initial points
        setUserStakedAmount(0);
        toast({
            title: "Wallet Connected",
            description: "Successfully connected to your wallet",
        });
    };

    const handleDisconnect = () => {
        setUserAddress(null);
        setUserPoints(0);
        setUserStakedAmount(0)
        setUserCompletedTasks({}); // Reset completed tasks
        toast({
            title: "Wallet Disconnected",
            description: "Successfully disconnected from your wallet",
        });
    };
    // --- Faked Staking Logic ---
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
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

            setUserStakedAmount(prevStakedAmount => prevStakedAmount + amount);
            setUserPoints(prevPoints => prevPoints + 50);  // Example: Award 50 points for staking
            setUserCompletedTasks(prevCompletedTasks => ({ ...prevCompletedTasks, '1': true }))
            toast({
                title: "Stake Successful",
                description: `Successfully staked ${stakingAmount} AMB.`,
            });

            setStakingAmount('');
            setIsStakeModalOpen(false);

        } catch (error: any) {
            console.error("Staking error:", error);
            toast({
                title: "Staking Failed",
                description: `Error: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // --- Faked Task Completion Logic ---
    const completeTask = async (taskId: string) => {

        setLoading(true);
        try {
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;

            if (task.taskType === 0) {
                setIsStakeModalOpen(true)
                return;
            }
            //Simulate delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setUserCompletedTasks(prevCompletedTasks => ({
                ...prevCompletedTasks,
                [taskId]: true,
            }));

            // Find the task and add its points to userPoints (simulate reward)
            const completedTask = tasks.find(t => t.id === taskId);
            if (completedTask) {
                setUserPoints(prevPoints => prevPoints + completedTask.points);
            }
            toast({
                title: "Task Completed",
                description: "Task completed successfully!",
            });

        } catch (error: any) {
            console.error("Error completing task:", error);
            toast({
                title: "Task Failed",
                description: `Error: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <Header
                    userAddress={userAddress}
                    userPoints={userPoints}
                    userStakedAmount={userStakedAmount}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                />

                <Stats stats={stats} />

                <div className="grid-container">
                    <Tasks
                        tasks={tasks}
                        onCompleteTask={completeTask}
                        isConnected={!!userAddress}
                        loading={loading}
                        userCompletedTasks={userCompletedTasks}
                        onStake={() => setIsStakeModalOpen(true)}
                    />
                    <Leaderboard leaders={leaders} />
                </div>

                <Rewards />

                {/* Stake Modal */}
                <Modal
                    isOpen={isStakeModalOpen}
                    onClose={() => setIsStakeModalOpen(false)}
                    title="Stake AMB"
                >
                    <input
                        type="number"
                        placeholder="Enter amount"
                        className="input input-bordered w-full mb-4"
                        value={stakingAmount}
                        onChange={(e) => setStakingAmount(e.target.value)}
                    />
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={() => setIsStakeModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="default" className="primary-button" onClick={handleStake} disabled={loading}>
                            Confirm Stake
                            {loading && (
                                <div className="loading-overlay">
                                    <div className="loading-spinner" />
                                </div>
                            )}
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default DeFiGame;