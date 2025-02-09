// components/game/Tasks.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskItem from '../game/TaskItem';
import { Target } from 'lucide-react';

interface TasksProps {
    tasks: any[];
    onCompleteTask: (id: string) => Promise<void>;
    isConnected: boolean;
    loading: boolean;
    userCompletedTasks: { [key: string]: boolean };
    onStake: () => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onCompleteTask, isConnected, loading, userCompletedTasks, onStake }) => (
    <Card >
        <CardHeader >
            <CardTitle className="flex items-center">
                <Target className='h-5 w-5 mr-2 text-purple-500' />
                Available Tasks
            </CardTitle>
        </CardHeader>
        <CardContent >
            <div >
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onCompleteTask={onCompleteTask}
                        isConnected={isConnected}
                        loading={loading}
                        userCompletedTasks={userCompletedTasks}
                    />
                ))}
            </div>
        </CardContent>
    </Card>
);

export default Tasks;