import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlowProvider,
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import { useFlowStore } from './store/useFlowStore';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import CodePanel from './components/CodePanel';
import { FlowNode, FlowEdge } from './types';

function AppContent() {
  const {
    nodes,
    edges,
    selectedNode,
    projectName,
    projectId,
    generatedCode,
    isLoading,
    addNode,
    updateNodePosition,
    updateNodeProperties,
    deleteNode,
    selectNode,
    duplicateNode,
    addEdge,
    deleteEdge,
    generateCode,
    setProjectName,
    saveProject,
    loadProject,
    newProject,
    listProjects,
    setNodes,
    setEdges
  } = useFlowStore();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [codePanelExpanded, setCodePanelExpanded] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updatedNodes = applyNodeChanges(changes, nodes) as FlowNode[];
      setNodes(updatedNodes);

      changes.forEach(change => {
        if (change.type === 'position' && change.position && change.dragging === false) {
          updateNodePosition(change.id, change.position);
        }
        if (change.type === 'remove') {
          deleteNode(change.id);
        }
      });
    },
    [nodes, setNodes, updateNodePosition, deleteNode]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updatedEdges = applyEdgeChanges(changes, edges) as FlowEdge[];
      setEdges(updatedEdges);

      changes.forEach(change => {
        if (change.type === 'remove') {
          deleteEdge(change.id);
        }
      });
    },
    [edges, setEdges, deleteEdge]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      addEdge(connection);
      setHasUnsavedChanges(true);
    },
    [addEdge]
  );

  const onDragStart = useCallback((e: React.DragEvent, blockType: string) => {
    setDraggedBlock(blockType);
    e.dataTransfer.setData('application/reactflow', blockType);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const blockType = draggedBlock;
      if (!blockType) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = {
        x: e.clientX - bounds.left - 100,
        y: e.clientY - bounds.top - 50
      };

      addNode(blockType, position);
      setHasUnsavedChanges(true);
      setDraggedBlock(null);
    },
    [addNode, draggedBlock]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNode) {
          deleteNode(selectedNode.id);
          selectNode(null);
          setHasUnsavedChanges(true);
        }
      }
    },
    [selectedNode, deleteNode, selectNode]
  );

  const handleSave = useCallback(() => {
    saveProject();
    setHasUnsavedChanges(false);
  }, [saveProject]);

  const handleNewProject = useCallback(() => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Create a new project anyway?')) {
        return;
      }
    }
    newProject();
    setHasUnsavedChanges(false);
  }, [newProject, hasUnsavedChanges]);

  const handleLoadProject = useCallback(
    (projectId: string) => {
      loadProject(projectId);
      setHasUnsavedChanges(false);
    },
    [loadProject]
  );

  const handleGenerateCode = useCallback(() => {
    generateCode();
  }, [generateCode]);

  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([generatedCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_program.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedCode]);

  const handleProjectNameChange = useCallback(
    (name: string) => {
      setProjectName(name);
      setHasUnsavedChanges(true);
    },
    [setProjectName]
  );

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [nodes, edges]);

  // Get the selected node from current nodes (for up-to-date properties)
  const currentSelectedNode = useMemo(() => {
    if (!selectedNode) return null;
    return nodes.find(n => n.id === selectedNode.id) || selectedNode;
  }, [selectedNode, nodes]);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-100">
      <Toolbar
        projectName={projectName}
        projectId={projectId}
        isLoading={isLoading}
        hasUnsavedChanges={hasUnsavedChanges}
        onProjectNameChange={handleProjectNameChange}
        onSave={handleSave}
        onNewProject={handleNewProject}
        onLoadProject={handleLoadProject}
        onGenerateCode={handleGenerateCode}
        onDownloadCode={handleDownloadCode}
        listProjects={listProjects}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onDragStart={onDragStart}
        />

        <div className="flex-1 flex flex-col overflow-hidden" ref={reactFlowWrapper}>
          <div className="flex-1 flex relative">
            <div className="flex-1">
              <Canvas
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onKeyDown={onKeyDown}
              />
            </div>

            <div className="absolute right-0 top-0 bottom-0 flex items-center">
              <button
                onClick={() => setCodePanelExpanded(!codePanelExpanded)}
                className="absolute right-2 top-2 z-10 p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                title={codePanelExpanded ? 'Collapse code panel' : 'Expand code panel'}
                style={{ right: codePanelExpanded ? 'calc(50% + 8px)' : '8px' }}
              >
                <svg
                  className={`w-4 h-4 transition-transform ${codePanelExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div
              className="transition-all duration-300 ease-in-out"
              style={{
                width: codePanelExpanded ? '40%' : '0',
                minWidth: codePanelExpanded ? '320px' : '0',
                opacity: codePanelExpanded ? 1 : 0,
                overflow: 'hidden'
              }}
            >
              <div className="h-full p-2 pr-0">
                <CodePanel generatedCode={generatedCode} />
              </div>
            </div>
          </div>
        </div>

        {currentSelectedNode && !codePanelExpanded && (
          <PropertiesPanel
            selectedNode={currentSelectedNode}
            onUpdateProperties={(nodeId, props) => {
              updateNodeProperties(nodeId, props);
              setHasUnsavedChanges(true);
            }}
            onDeleteNode={(nodeId) => {
              deleteNode(nodeId);
              selectNode(null);
              setHasUnsavedChanges(true);
            }}
            onDuplicateNode={(nodeId) => {
              duplicateNode(nodeId);
              setHasUnsavedChanges(true);
            }}
            onClose={() => selectNode(null)}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

export default App;
