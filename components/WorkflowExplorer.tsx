
import React from 'react';
import type { Workflow } from '../types';
import { FileIcon, FolderIcon } from '../constants';

interface WorkflowExplorerProps {
  repo: string;
  workflows: Workflow[];
  selectedWorkflowId: string | null;
  onSelectWorkflow: (workflow: Workflow) => void;
}

export const WorkflowExplorer: React.FC<WorkflowExplorerProps> = ({ repo, workflows, selectedWorkflowId, onSelectWorkflow }) => {
  return (
    <aside className="w-64 bg-gray-800 p-4 border-r border-gray-700">
      <h2 className="text-sm font-bold uppercase text-gray-400 mb-2">Explorer</h2>
      <p className="text-xs text-gray-300 truncate mb-4">{repo}</p>
      
      <div className="flex items-center text-sm text-gray-300">
        {FolderIcon}
        <span>.github</span>
      </div>
      <div className="pl-4 flex items-center text-sm text-gray-300">
        {FolderIcon}
        <span>workflows</span>
      </div>
      
      <ul className="mt-2 pl-8">
        {workflows.map(workflow => (
          <li key={workflow.id}>
            <button
              onClick={() => onSelectWorkflow(workflow)}
              className={`w-full text-left flex items-center py-1 px-2 rounded-md text-sm transition-colors duration-200 ${
                selectedWorkflowId === workflow.id
                  ? 'bg-blue-600/30 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {FileIcon}
              <span>{workflow.path.split('/').pop()}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
