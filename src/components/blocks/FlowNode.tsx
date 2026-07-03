import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as LucideIcons from 'lucide-react';
import { FlowNodeData } from '../../types';

const categoryStyles = {
  input: {
    header: 'bg-gradient-to-r from-amber-500 to-orange-500',
    border: 'border-amber-500/30',
    handle: '#F59E0B'
  },
  control: {
    header: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    border: 'border-teal-500/30',
    handle: '#14B8A6'
  },
  process: {
    header: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    border: 'border-indigo-500/30',
    handle: '#6366F1'
  },
  output: {
    header: 'bg-gradient-to-r from-red-500 to-rose-500',
    border: 'border-red-500/30',
    handle: '#EF4444'
  },
  function: {
    header: 'bg-gradient-to-r from-violet-500 to-purple-500',
    border: 'border-violet-500/30',
    handle: '#8B5CF6'
  }
};

const FlowNode = memo(({ data, selected }: NodeProps<FlowNodeData>) => {
  const { definition, properties, label } = data;
  const iconStyle = categoryStyles[definition.category];

  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[definition.icon]
    || LucideIcons.Square;

  return (
    <div
      className={`min-w-[200px] rounded-lg shadow-lg border-2 ${iconStyle.border} bg-white transition-all duration-200 ${
        selected ? 'ring-2 ring-blue-500 ring-offset-2 shadow-xl scale-105' : 'hover:shadow-xl'
      }`}
    >
      {/* Header */}
      <div className={`${iconStyle.header} px-3 py-2 rounded-t-lg flex items-center gap-2 min-h-[44px]`}>
        <div className="p-1.5 bg-white/20 rounded-md">
          <IconComponent className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <p className="text-xs text-white/80 truncate max-w-[150px]">{definition.type}</p>
        </div>
      </div>

      {/* Body - Show key properties */}
      <div className="px-3 py-2 space-y-1.5 relative">
        {/* Input Handles - positioned on the left side of the body */}
        {definition.inputs.map((input, index) => (
          <Handle
            key={`input-${input.name}`}
            type="target"
            position={Position.Left}
            id={input.name}
            style={{
              backgroundColor: iconStyle.handle,
              width: '12px',
              height: '12px',
              border: '2px solid white',
              left: '-6px',
              top: `${16 + index * 24}px`
            }}
          />
        ))}

        {definition.properties.slice(0, 3).map(prop => (
          <div key={prop.name} className="flex items-center gap-2 text-xs min-h-[20px]">
            <span className="text-gray-500 w-24 truncate">{prop.label}:</span>
            <span className="text-gray-800 font-medium truncate flex-1">
              {String(properties[prop.name] || prop.default)}
            </span>
          </div>
        ))}
        {definition.properties.length > 3 && (
          <p className="text-xs text-gray-400 italic">
            +{definition.properties.length - 3} more properties
          </p>
        )}

        {/* Output Handles - positioned on the right side of the body */}
        {definition.outputs.map((output, index) => (
          <Handle
            key={`output-${output.name}`}
            type="source"
            position={Position.Right}
            id={output.name}
            style={{
              backgroundColor: output.name === 'true' ? '#22C55E' : output.name === 'false' ? '#EF4444' : iconStyle.handle,
              width: '12px',
              height: '12px',
              border: '2px solid white',
              right: '-6px',
              top: `${16 + index * 24}px`
            }}
          />
        ))}
      </div>
    </div>
  );
});

FlowNode.displayName = 'FlowNode';

export default FlowNode;
