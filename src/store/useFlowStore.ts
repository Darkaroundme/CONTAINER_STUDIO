import { create } from 'zustand';
import { Connection } from 'reactflow';
import { supabase } from '../lib/supabase';
import { FlowNode, FlowEdge, BlockProperty } from '../types';
import { getBlockDefinition } from '../blocks/definitions';

interface FlowState {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNode: FlowNode | null;
  projectName: string;
  projectId: string | null;
  generatedCode: string;
  isLoading: boolean;
  error: string | null;

  // Node actions
  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  updateNodeProperties: (nodeId: string, properties: Record<string, string | number | boolean>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (node: FlowNode | null) => void;
  duplicateNode: (nodeId: string) => void;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;

  // Edge actions
  addEdge: (edge: Connection) => void;
  deleteEdge: (edgeId: string) => void;

  // Code generation
  generateCode: () => void;

  // Project actions
  setProjectName: (name: string) => void;
  saveProject: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  newProject: () => void;
  listProjects: () => Promise<{ id: string; name: string; updated_at: string }[]>;

  // Utility
  clearError: () => void;
}

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  projectName: 'Untitled Project',
  projectId: null,
  generatedCode: '# Generate Python code by adding blocks and connecting them',
  isLoading: false,
  error: null,

  addNode: (type, position) => {
    const definition = getBlockDefinition(type);
    if (!definition) return;

    const defaultProperties: Record<string, string | number | boolean> = {};
    definition.properties.forEach((prop: BlockProperty) => {
      defaultProperties[prop.name] = prop.default;
    });

    const newNode: FlowNode = {
      id: generateUniqueId(),
      type: 'custom',
      position,
      data: {
        type,
        label: definition.title,
        properties: defaultProperties,
        definition
      }
    };

    set(state => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNodePosition: (nodeId, position) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId
          ? { ...node, position }
          : node
      )
    }));
  },

  updateNodeProperties: (nodeId, properties) => {
    set(state => ({
      nodes: state.nodes.map(node =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                properties: { ...node.data.properties, ...properties }
              }
            }
          : node
      ),
      selectedNode: state.selectedNode?.id === nodeId
        ? {
            ...state.selectedNode,
            data: {
              ...state.selectedNode.data,
              properties: { ...state.selectedNode.data.properties, ...properties }
            }
          }
        : state.selectedNode
    }));
  },

  deleteNode: (nodeId) => {
    set(state => ({
      nodes: state.nodes.filter(node => node.id !== nodeId),
      edges: state.edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode
    }));
  },

  selectNode: (node) => {
    set({ selectedNode: node });
  },

  duplicateNode: (nodeId) => {
    const { nodes } = get();
    const nodeToDuplicate = nodes.find(n => n.id === nodeId);
    if (!nodeToDuplicate) return;

    const newNode: FlowNode = {
      ...nodeToDuplicate,
      id: generateUniqueId(),
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50
      },
      data: {
        ...nodeToDuplicate.data,
        properties: { ...nodeToDuplicate.data.properties }
      }
    };

    set(state => ({ nodes: [...state.nodes, newNode] }));
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  addEdge: (connection) => {
    if (!connection.source || !connection.target) return;

    const { edges } = get();

    // Prevent self-loops
    if (connection.source === connection.target) return;

    // Check if edge already exists
    const edgeExists = edges.some(
      edge =>
        edge.source === connection.source &&
        edge.target === connection.target &&
        edge.sourceHandle === connection.sourceHandle &&
        edge.targetHandle === connection.targetHandle
    );

    if (edgeExists) return;

    const newEdge: FlowEdge = {
      id: generateUniqueId(),
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
      type: 'smoothstep',
      animated: true
    };

    set(state => ({ edges: [...state.edges, newEdge] }));
  },

  deleteEdge: (edgeId) => {
    set(state => ({
      edges: state.edges.filter(edge => edge.id !== edgeId)
    }));
  },

  generateCode: () => {
    const { nodes, edges } = get();

    if (nodes.length === 0) {
      set({ generatedCode: '# Add blocks to generate code' });
      return;
    }

    // Build adjacency list and find execution order using topological sort
    const adjacencyList = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(node => {
      adjacencyList.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
      const targets = adjacencyList.get(edge.source) || [];
      targets.push(edge.target);
      adjacencyList.set(edge.source, targets);

      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Find starting nodes (no incoming edges)
    const queue: string[] = [];
    nodes.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push(node.id);
      }
    });

    const orderedNodes: FlowNode[] = [];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const node = nodes.find(n => n.id === currentId);
      if (node) orderedNodes.push(node);

      const targets = adjacencyList.get(currentId) || [];
      targets.forEach(targetId => {
        const newDegree = (inDegree.get(targetId) || 1) - 1;
        inDegree.set(targetId, newDegree);
        if (newDegree === 0 && !visited.has(targetId)) {
          queue.push(targetId);
        }
      });
    }

    // Add any remaining nodes (disconnected components)
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        orderedNodes.push(node);
      }
    });

    // Generate code by replacing placeholders
    const codeLines: string[] = [];

    orderedNodes.forEach(node => {
      const { definition, properties } = node.data;
      let code = definition.codeTemplate;

      // Replace placeholder variables with actual values
      definition.properties.forEach((prop: BlockProperty) => {
        const value = properties[prop.name] ?? prop.default;
        const placeholder = `{{${prop.name}}}`;

        // Handle empty values - remove the placeholder or use sensible defaults
        if (value === '' || value === undefined) {
          if (prop.name === 'alias') {
            code = code.replace(placeholder, '');
          } else if (prop.name === 'condition') {
            // Keep condition as empty or use a sensible default
            code = code.replace(placeholder, 'True');
          } else {
            code = code.replace(placeholder, String(prop.default));
          }
        } else {
          code = code.replace(placeholder, String(value));
        }
      });

      // Clean up any remaining double curly braces placeholders
      code = code.replace(/\{\{\w+\}\}/g, '');

      // Clean up edge cases in templates
      code = code.replace(/as \s+/g, 'as ');
      code = code.replace(/import \s+/g, 'import ');

      codeLines.push(code);
    });

    set({ generatedCode: codeLines.join('\n') });
  },

  setProjectName: (name) => {
    set({ projectName: name });
  },

  saveProject: async () => {
    const { projectName, projectId, nodes, edges } = get();
    set({ isLoading: true, error: null });

    try {
      let newProjectId = projectId;

      if (projectId) {
        // Update existing project
        const { error: projectError } = await supabase
          .from('projects')
          .update({
            name: projectName,
            updated_at: new Date().toISOString()
          })
          .eq('id', projectId);

        if (projectError) throw projectError;

        // Delete existing nodes and edges
        await supabase.from('edges').delete().eq('project_id', projectId);
        await supabase.from('nodes').delete().eq('project_id', projectId);
      } else {
        // Create new project
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .insert({ name: projectName })
          .select()
          .single();

        if (projectError) throw projectError;
        newProjectId = projectData.id;
      }

      // Insert nodes
      if (nodes.length > 0) {
        const nodesData = nodes.map(node => ({
          project_id: newProjectId,
          type: node.data.type,
          position_x: node.position.x,
          position_y: node.position.y,
          properties: node.data.properties
        }));

        const { data: insertedNodes, error: nodesError } = await supabase
          .from('nodes')
          .insert(nodesData)
          .select();

        if (nodesError) throw nodesError;

        // Create a mapping from old node IDs to new node IDs
        const nodeIdMap = new Map<string, string>();
        nodes.forEach((node, index) => {
          if (insertedNodes[index]) {
            nodeIdMap.set(node.id, insertedNodes[index].id);
          }
        });

        // Insert edges with mapped node IDs
        if (edges.length > 0) {
          const edgesData = edges
            .filter(edge => nodeIdMap.has(edge.source) && nodeIdMap.has(edge.target))
            .map(edge => ({
              project_id: newProjectId,
              source_node: nodeIdMap.get(edge.source),
              target_node: nodeIdMap.get(edge.target),
              source_handle: edge.sourceHandle,
              target_handle: edge.targetHandle
            }));

          if (edgesData.length > 0) {
            const { error: edgesError } = await supabase
              .from('edges')
              .insert(edgesData);

            if (edgesError) throw edgesError;
          }
        }
      }

      set({ projectId: newProjectId, isLoading: false });
    } catch (error) {
      console.error('Save project error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to save project'
      });
    }
  },

  loadProject: async (id) => {
    set({ isLoading: true, error: null });

    try {
      // Load project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      if (!project) throw new Error('Project not found');

      // Load nodes
      const { data: nodesData, error: nodesError } = await supabase
        .from('nodes')
        .select('*')
        .eq('project_id', id);

      if (nodesError) throw nodesError;

      // Load edges
      const { data: edgesData, error: edgesError } = await supabase
        .from('edges')
        .select('*')
        .eq('project_id', id);

      if (edgesError) throw edgesError;

      // Convert database records to flow nodes
      const loadedNodes: FlowNode[] = (nodesData || []).map(dbNode => {
        const definition = getBlockDefinition(dbNode.type);
        const defaultProperties: Record<string, string | number | boolean> = {};
        definition?.properties.forEach((prop: BlockProperty) => {
          defaultProperties[prop.name] = prop.default;
        });

        return {
          id: dbNode.id,
          type: 'custom',
          position: { x: dbNode.position_x, y: dbNode.position_y },
          data: {
            type: dbNode.type,
            label: definition?.title || dbNode.type,
            properties: { ...defaultProperties, ...dbNode.properties },
            definition: definition!
          }
        };
      });

      // Convert database records to flow edges
      const loadedEdges: FlowEdge[] = (edgesData || []).map(dbEdge => ({
        id: dbEdge.id,
        source: dbEdge.source_node,
        target: dbEdge.target_node,
        sourceHandle: dbEdge.source_handle || undefined,
        targetHandle: dbEdge.target_handle || undefined,
        type: 'custom',
        animated: true
      }));

      set({
        projectId: id,
        projectName: project.name,
        nodes: loadedNodes,
        edges: loadedEdges,
        selectedNode: null,
        isLoading: false
      });
    } catch (error) {
      console.error('Load project error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load project'
      });
    }
  },

  newProject: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      projectName: 'Untitled Project',
      projectId: null,
      generatedCode: '# Generate Python code by adding blocks and connecting them'
    });
  },

  listProjects: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('id, name, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('List projects error:', error);
      return [];
    }

    return data || [];
  },

  clearError: () => set({ error: null })
}));
