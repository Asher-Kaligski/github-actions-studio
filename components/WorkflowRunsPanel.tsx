
import React from 'react';
import type { WorkflowRun } from '../types';

const StatusIcon: React.FC<{ status: WorkflowRun['status'] }> = ({ status }) => {
  switch (status) {
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'failure':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'in_progress':
      return (
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
    default:
      return null;
  }
};

const formatDuration = (start: Date, end?: Date): string => {
    if (!end) return '...';
    const durationMs = end.getTime() - start.getTime();
    if (durationMs < 1000) return `${durationMs}ms`;
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
}

export const WorkflowRunsPanel: React.FC<{ runs: WorkflowRun[] }> = ({ runs }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Workflow Runs</h2>
      {runs.length === 0 ? (
        <p className="text-gray-500">No workflow runs to display. Trigger a workflow to see its status here.</p>
      ) : (
        <ul className="space-y-3">
          {runs.map(run => (
            <li key={run.id} className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <StatusIcon status={run.status} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{run.workflowName}</p>
                <div className="text-sm text-gray-400">
                  <span>
                    Triggered {run.startedAt.toLocaleTimeString()}
                  </span>
                  <span className="mx-2 text-gray-600">&#8226;</span>
                  <span>
                    Duration: {formatDuration(run.startedAt, run.finishedAt)}
                  </span>
                </div>
                <div className="mt-2 text-xs bg-gray-900 p-2 rounded-md font-mono">
                  {Object.entries(run.inputs).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-500">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
