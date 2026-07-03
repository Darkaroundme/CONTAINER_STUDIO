import { Node, Edge } from 'reactflow';

export interface BlockProperty {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'code';
  default: string | number | boolean;
}

export interface BlockDefinition {
  type: string;
  title: string;
  description: string;
  category: 'input' | 'process' | 'output' | 'control' | 'function';
  icon: string;
  color: string;
  codeTemplate: string;
  properties: BlockProperty[];
  inputs: { name: string; label: string }[];
  outputs: { name: string; label: string }[];
}

export interface FlowNodeData {
  type: string;
  label: string;
  properties: Record<string, string | number | boolean>;
  definition: BlockDefinition;
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge;

export interface Project {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
