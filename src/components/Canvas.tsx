import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Connection,
  OnNodesChange,
  OnEdgesChange,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FlowNode, FlowEdge } from '../types';
import { useFlowStore } from '../store/useFlowStore';
import FlowNodeComponent from './blocks/FlowNode';

interface CanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

const nodeTypes = {
  custom: FlowNodeComponent
};

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDrop,
  onDragOver,
  onKeyDown
}) => {
  const { selectNode } = useFlowStore();

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      selectNode(node);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const isValidConnection = useCallback((connection: Connection) => {
    // Prevent self-loops
    if (connection.source === connection.target) return false;
    return true;
  }, []);

  return (
    <div className="w-full h-full relative" tabIndex={0} onKeyDown={onKeyDown}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        isValidConnection={isValidConnection}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true
        }}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        connectionLineType={ConnectionLineType.SmoothStep}
        deleteKeyCode={['Backspace', 'Delete']}
        className="bg-gray-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#CBD5E1"
        />
        <Controls className="bg-white border border-gray-200 rounded-lg shadow-lg" />
        <MiniMap
          className="bg-white border border-gray-200 rounded-lg shadow-lg"
          nodeColor={(node) => {
            const data = node.data as { definition?: { color?: string } };
            return data?.definition?.color || '#6366F1';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable
          zoomable
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 max-w-sm">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l11.657 11.657M11 7.343l-4.243 4.243M11 7.343V3m11.657 15.657L18.414 19.5M11.343 7.657l.657.686"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Building Your Flow
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Drag blocks from the left sidebar onto the canvas, then connect them to create
              your Python program graphically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
