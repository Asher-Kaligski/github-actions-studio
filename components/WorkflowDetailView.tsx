
import React, { useState, useEffect } from 'react';
import type { Workflow, WorkflowDispatchInput } from '../types';
import { InputWithSuggestions } from './InputWithSuggestions';
import { CodeViewer } from './CodeViewer';

interface WorkflowDetailViewProps {
  workflow: Workflow;
  onDispatch: (workflowId: string, inputs: Record<string, string>) => void;
}

const Dispatcher: React.FC<{ workflow: Workflow; onDispatch: (workflowId: string, inputs: Record<string, string>) => void }> = ({ workflow, onDispatch }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const defaultInputs: Record<string, string> = {};
    workflow.dispatchInputs?.forEach(input => {
      if (input.type === 'boolean') {
        defaultInputs[input.name] = 'false';
      } else if (input.default) {
        defaultInputs[input.name] = input.default;
      } else {
        defaultInputs[input.name] = '';
      }
    });
    setInputs(defaultInputs);
  }, [workflow]);

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onDispatch(workflow.id, inputs);
    // No need to set isSubmitting to false, as the view will likely change.
  };

  if (!workflow.dispatchInputs || workflow.dispatchInputs.length === 0) {
    return <div className="p-4 text-gray-500 text-sm">This workflow cannot be manually dispatched.</div>;
  }
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-white mb-4">Run workflow: {workflow.name}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {workflow.dispatchInputs.map(input => (
          <div key={input.name}>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {input.name} {input.required && <span className="text-red-400">*</span>}
            </label>
            <p className="text-xs text-gray-400 mb-2">{input.description}</p>
            {input.type === 'choice' ? (
              <select
                value={inputs[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                required={input.required}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {input.options?.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : input.type === 'boolean' ? (
              <select
                value={inputs[input.name] || 'false'}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                required={input.required}
                 className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <InputWithSuggestions
                name={input.name}
                value={inputs[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                onSuggestionClick={(value) => handleInputChange(input.name, value)}
                placeholder={`Default: ${input.default || 'none'}`}
                required={input.required}
                description={input.description}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:bg-green-800 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Dispatching...' : 'Run Workflow'}
        </button>
      </form>
    </div>
  );
};


export const WorkflowDetailView: React.FC<WorkflowDetailViewProps> = ({ workflow, onDispatch }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'actions'>('code');

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 text-sm ${activeTab === 'code' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('code')}
        >
          {workflow.path.split('/').pop()}
        </button>
        <button
          className={`px-4 py-2 text-sm ${activeTab === 'actions' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}
          onClick={() => setActiveTab('actions')}
        >
          Actions
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'code' && <CodeViewer code={workflow.yaml} />}
        {activeTab === 'actions' && <Dispatcher workflow={workflow} onDispatch={onDispatch} />}
      </div>
    </div>
  );
};
