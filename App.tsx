import React, { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { WorkflowExplorer } from './components/WorkflowExplorer';
import { WorkflowDetailView } from './components/WorkflowDetailView';
import { WorkflowRunsPanel } from './components/WorkflowRunsPanel';
import { SecretsPanel } from './components/SecretsPanel';
import { MarketplacePanel } from './components/MarketplacePanel';
import type { View, Workflow, WorkflowRun } from './types';
import { getVscodeApi } from './src/webview/vscode';
import { GithubIcon } from './constants';

const vscode = getVscodeApi();

const App: React.FC = () => {
  const [repoInput, setRepoInput] = useState<string>('owner/repo-name');
  const [repo, setRepo] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<View>('explorer');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent
      switch (message.command) {
        case 'connected':
          setConnected(true);
          setRepo(message.payload.repo);
          setWorkflows(message.payload.workflows);
          setSelectedWorkflow(message.payload.workflows[0] || null);
          break;
        case 'runStarted':
          setRuns(prevRuns => [message.payload, ...prevRuns]);
          setActiveView('runs');
          break;
        case 'runFinished':
          setRuns(prevRuns =>
            prevRuns.map(run =>
              run.id === message.payload.id ? message.payload : run
            )
          );
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleConnect = () => {
    if (repoInput.trim() !== '') {
      vscode.postMessage({
        command: 'connect',
        repo: repoInput,
      });
    }
  };

  const handleDispatch = useCallback((workflowId: string, inputs: Record<string, string>) => {
    vscode.postMessage({
      command: 'dispatch',
      payload: { workflowId, inputs },
    });
  }, []);

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
              value={repoInput}
              onChange={e => setRepoInput(e.target.value)}
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