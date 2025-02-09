// components/game/TaskItem.tsx
import React, {useState} from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Modal from './Modal';


interface TaskItemProps {
  task: any;
  onCompleteTask: (id: string) => Promise<void>;
  isConnected: boolean;
  loading: boolean;
  userCompletedTasks: { [key: string]: boolean };
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onCompleteTask, isConnected, loading, userCompletedTasks }) => {
 const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleTaskClick = async () => {
    if (!isConnected || loading || userCompletedTasks[task.id]) {
      return;
    }

    if(task.taskType === 0){
      onCompleteTask(task.id)
    }else{
      setIsTaskModalOpen(true);
    }

  };

  return (
    <>
      <div
        key={task.id}
        className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleTaskClick}

      >
        <div>
          <h3 className="text-lg font-semibold">{task.name}</h3>
          <div className="text-sm text-gray-500">
            <Badge variant="outline">{task.points} Points</Badge>
            {task.requiredAmount > 0 && (
              <span className="ml-2">Requires {task.requiredAmount} AMB</span>
            )}
          </div>
        </div>
         <Button
          disabled={true}
          variant="default"
          className={`${userCompletedTasks[task.id]
            ? 'bg-green-500 text-white cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {userCompletedTasks[task.id] ? 'Completed' :  (task.taskType === 0 ? 'Stake' : 'Complete')}
        </Button>
      </div>
        {/* Task Completion Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={`Complete Task: ${task.name}`}
      >
        <p className="mb-4 text-gray-700">
          Are you sure you want to complete this task?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsTaskModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
                onCompleteTask(task.id);
              setIsTaskModalOpen(false); // Close modal after completing
            }}
            disabled={loading}
          >
            Confirm
            {loading && (
              <>
                {/*  Placeholder for a loading animation/indicator */}
              </>
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
};
export default TaskItem;