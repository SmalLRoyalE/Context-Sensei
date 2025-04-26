// src/components/features/analysis/TaskTable.tsx
import React from 'react';
import { TaskTable as TaskTableType } from '../../../types/analysis';

interface TaskTableProps {
  taskTable?: TaskTableType;
  className?: string;
}

export const TaskTable: React.FC<TaskTableProps> = ({ taskTable, className = '' }) => {
  if (!taskTable || taskTable.rows.length === 0) {
    return <div className="text-center p-4">No task data available</div>;
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Assignee</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Tasks</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Assigned Date</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Deadline</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300">Priority</th>
          </tr>
        </thead>
        <tbody>
          {taskTable.rows.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
              <td className="px-4 py-3 text-sm font-medium">{row.assignee}</td>
              <td className="px-4 py-3 text-sm">
                <ul className="list-disc list-inside">
                  {row.tasks.map((task, taskIndex) => (
                    <li key={taskIndex} className="mb-1">{task}</li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 text-sm">{row.assignedDate || 'N/A'}</td>
              <td className="px-4 py-3 text-sm">{row.deadline}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium
                  ${row.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : ''}
                  ${row.priority.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : ''}
                  ${row.priority.toLowerCase() === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : ''}
                  `}
                >
                  {row.priority}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">Task Summary</h4>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p>Total Tasks: <span className="font-bold">{taskTable.metadata.totalTasks}</span></p>
          </div>
          <div>
            <p>With Deadlines: <span className="font-bold">{taskTable.metadata.tasksWithDeadlines}</span></p>
          </div>
          <div>
            <p>High Priority: <span className="font-bold">{taskTable.metadata.highPriorityTasks}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;