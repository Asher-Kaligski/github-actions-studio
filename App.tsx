
import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkflowExplorer } from './components/WorkflowExplorer';
import { WorkflowDetailView } from './components/WorkflowDetailView';
import { WorkflowRunsPanel } from './components/WorkflowRunsPanel';
import { SecretsPanel } from './components/SecretsPanel';
import { MarketplacePanel } from './components/MarketplacePanel';
import type { View, Workflow, WorkflowRun, WorkflowDispatchInput } from './types';
import { MOCK_WORKFLOWS } from './constants';
import { GithubIcon } from './constants';

const App: React.FC = () => {
  const [repo, setRepo] = useState<string>('owner/repo-name');
  const [connected, setConnected] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<View>('explorer');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);

  const handleConnect = () => {
    if (repo.trim() !== '') {
      setConnected(true);
      setWorkflows(MOCK_WORKFLOWS);
      setSelectedWorkflow(MOCK_WORKFLOWS[0] || null);
    }
  };

  const handleDispatch = useCallback((workflowId: string, inputs: Record<string, string>) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (!workflow) return;

    const newRun: WorkflowRun = {
      id: Date.now(),
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: 'in_progress',
      inputs,
      startedAt: new Date(),
    };
    setRuns(prevRuns => [newRun, ...prevRuns]);
    setActiveView('runs');

    // Simulate workflow completion
    setTimeout(() => {
      setRuns(prevRuns =>
        prevRuns.map(run =>
          run.id === newRun.id
            ? { ...run, status: Math.random() > 0.3 ? 'success' : 'failure', finishedAt: new Date() }
            : run
        )
      );
    }, 5000 + Math.random() * 5000);
  }, [workflows]);

  const renderView = () => {
    switch (activeView) {
      case 'explorer':
        return selectedWorkflow ? (
          <WorkflowDetailView workflow={selectedWorkflow} onDispatch={handleDispatch} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a workflow to view details.</div>
        );
      case 'runs':
        return <WorkflowRunsPanel runs={runs} />;
      case 'secrets':
        return <SecretsPanel />;
      case 'marketplace':
        return <MarketplacePanel />;
      default:
        return null;
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-800">
        <div className="bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-md text-center">
          <div className="mx-auto h-16 w-16 text-white">{GithubIcon}</div>
          <h1 className="text-2xl font-bold text-white mt-4">GitHub Actions Companion</h1>
          <p className="text-gray-400 mt-2">Connect to your repository to manage workflows.</p>
          <div className="mt-6">
            <input
              type="text"
              value={repo}
              onChange={e => setRepo(e.target.value)}
              placeholder="e.g., octocat/Hello-World"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleConnect}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex bg-gray-800">
        <WorkflowExplorer
          repo={repo}
          workflows={workflows}
          selectedWorkflowId={selectedWorkflow?.id || null}
          onSelectWorkflow={setSelectedWorkflow}
        />
        <main className="flex-1 flex flex-col bg-gray-900">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
