import * as vscode from 'vscode';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';
import { MOCK_WORKFLOWS } from './constants';
import type { Workflow, WorkflowRun } from './types';

// This function is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('githubActionsCompanion.start', () => {
    // Create and show a new webview panel
    const panel = vscode.window.createWebviewPanel(
      'githubActionsCompanion', // Identifies the type of the webview. Used internally
      'GitHub Actions Companion', // Title of the panel displayed to the user
      vscode.ViewColumn.One, // Editor column to show the new webview panel in.
      {
        enableScripts: true, // Enable javascript in the webview
        // Restrict the webview to only loading content from our extension's `media` directory.
        // In a real extension, you would bundle your React app and reference the assets here.
      }
    );

    // Set the webview's initial HTML content
    panel.webview.html = getWebviewContent();

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'connect':
            const repo = message.repo;
            // In a real extension, you'd fetch this from the GitHub API
            const workflows: Workflow[] = MOCK_WORKFLOWS;
            panel.webview.postMessage({ command: 'connected', payload: { repo, workflows } });
            return;
          
          case 'dispatch':
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
            panel.webview.postMessage({ command: 'runStarted', payload: newRun });

            // Simulate workflow completion
            setTimeout(() => {
              const finalStatus = Math.random() > 0.3 ? 'success' : 'failure';
              const finishedRun = { ...newRun, status: finalStatus, finishedAt: new Date() };
              panel.webview.postMessage({ command: 'runFinished', payload: finishedRun });
            }, 5000 + Math.random() * 5000);
            return;

          case 'getSuggestions':
            const description = message.description;
            const prompt = `You are an expert in GitHub Actions. For a workflow input with the description "${description}", provide a JSON array of 3 common and realistic example values. For example, for "The environment to deploy to", you should return ["staging", "production", "development"]. Only return the JSON array of strings.`;
            try {
              const response: GenerateContentResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.STRING,
                    },
                  },
                },
              });
              const jsonText = response.text.trim();
              const suggestions = JSON.parse(jsonText);
              panel.webview.postMessage({ command: 'suggestionsLoaded', payload: { description, suggestions } });
            } catch (error) {
              console.error('Gemini API Error:', error);
              vscode.window.showErrorMessage('Failed to get AI suggestions.');
              panel.webview.postMessage({ command: 'suggestionsLoaded', payload: { description, suggestions: [] } });
            }
            return;
        }
      },
      undefined,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

// This function is called when your extension is deactivated
export function deactivate() {}

function getWebviewContent() {
  // In a real extension, you would generate a URI to your bundled React app script.
  // For this example, we'll embed the CDN links, similar to the original index.html.
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Actions Companion</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script type="importmap">
        {
          "imports": {
            "@google/genai": "https://aistudiocdn.com/@google/genai@^1.28.0",
            "react/": "https://aistudiocdn.com/react@^19.2.0/",
            "react": "https://aistudiocdn.com/react@^19.2.0",
            "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/"
          }
        }
        </script>
    </head>
    <body class="bg-gray-900 text-gray-200">
        <div id="root"></div>
        <!-- In a real extension, you would replace this with a local script URI -->
        <script type="module" src="/index.tsx"></script>
    </body>
    </html>`;
}
