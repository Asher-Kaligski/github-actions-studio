// This utility helps us manage the VS Code API singleton.
// It's a special object provided by VS Code in the webview's context.

import type { Workflow, WorkflowRun } from '../../types';
import { MOCK_WORKFLOWS } from '../../constants';


// We declare the type of the API object for TypeScript.
interface VsCodeApi {
  postMessage(message: any): void;
  getState(): any;
  setState(newState: any): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

/**
 * This function simulates the backend logic of extension.ts for browser-based development.
 * It listens to messages from the React app and posts responses back to the window.
 */
function handleMockMessage(message: any) {
  switch (message.command) {
    case 'connect':
      {
        const repo = message.repo;
        const workflows: Workflow[] = MOCK_WORKFLOWS;
        // Post response back to the window, mimicking the extension host
        window.postMessage({ command: 'connected', payload: { repo, workflows, selectedWorkflow: workflows[0] || null } }, '*');
      }
      return;
    
    case 'dispatch':
      {
        const { workflowId, inputs } = message.payload;
        const workflow = MOCK_WORKFLOWS.find(w => w.id === workflowId);
        if (!workflow) return;

        const newRun: WorkflowRun = {
          id: Date.now(),
          workflowId: workflow.id,
          workflowName: workflow.name,
          status: 'in_progress',
          inputs,
          startedAt: new Date(),
        };
        window.postMessage({ command: 'runStarted', payload: newRun }, '*');

        // Simulate workflow completion after a delay
        setTimeout(() => {
          const finalStatus = Math.random() > 0.3 ? 'success' : 'failure';
          const finishedRun = { ...newRun, status: finalStatus, finishedAt: new Date() };
          window.postMessage({ command: 'runFinished', payload: finishedRun }, '*');
        }, 4000 + Math.random() * 4000);
      }
      return;

    case 'getSuggestions':
      {
        // Simulate a successful AI response with mock data
        const suggestions = ['1.0.0-beta', 'latest', 'v2.1.5-hotfix'];
        setTimeout(() => {
            window.postMessage({ command: 'suggestionsLoaded', payload: { description: message.description, suggestions } }, '*');
        }, 800);
      }
      return;
  }
}

let vscode: VsCodeApi;
let isMockInitialized = false;

export function getVscodeApi(): VsCodeApi {
  if (!vscode) {
    // Check if we are in a real VS Code webview environment
    if (typeof acquireVsCodeApi === 'function') {
      vscode = acquireVsCodeApi();
    } else {
      // If not, we are in a browser. Create a mock for simulation.
      vscode = {
        postMessage: (message: any) => {
          console.log('%c[Webview -> Host]', 'color: #7BF5B4; font-weight: bold', message);
          handleMockMessage(message);
        },
        getState: () => ({}),
        setState: () => {},
      };
      
      // The mock needs to listen to its own "responses" to log them for debugging.
      // This setup runs only once.
      if (!isMockInitialized) {
        console.log('Using mock VS Code API for browser simulation.');
        window.addEventListener('message', (event) => {
            // We only care about messages from our own window
            if (event.source === window && event.data.command) {
                console.log('%c[Host -> Webview]', 'color: #A3A8FF; font-weight: bold', event.data);
            }
        });
        isMockInitialized = true;
      }
    }
  }
  return vscode;
}
