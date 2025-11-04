
export type View = 'explorer' | 'runs' | 'secrets' | 'marketplace';

export interface WorkflowDispatchInput {
  name: string;
  description: string;
  required: boolean;
  default?: string;
  type: 'string' | 'choice' | 'boolean' | 'environment';
  options?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  path: string;
  yaml: string;
  dispatchInputs?: WorkflowDispatchInput[];
}

export interface WorkflowRun {
  id: number;
  workflowId: string;
  workflowName: string;
  status: 'in_progress' | 'success' | 'failure';
  inputs: Record<string, string>;
  startedAt: Date;
  finishedAt?: Date;
}
