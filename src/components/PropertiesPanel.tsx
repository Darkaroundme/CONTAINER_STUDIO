import React from 'react';
import { X, Code } from 'lucide-react';
import { FlowNode, BlockProperty } from '../types';

interface PropertiesPanelProps {
  selectedNode: FlowNode | null;
  onUpdateProperties: (nodeId: string, properties: Record<string, string | number | boolean>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onClose: () => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onUpdateProperties,
  onDeleteNode,
  onDuplicateNode,
  onClose
}) => {
  if (!selectedNode) {
    return (
      <div className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-100 rounded-full mb-4">
          <Code className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-700">No Block Selected</h3>
        <p className="text-xs text-gray-500 mt-1">
          Click on a block to edit its properties
        </p>
      </div>
    );
  }

  const { definition, properties } = selectedNode.data;

  const handlePropertyChange = (propName: string, value: string | number | boolean) => {
    onUpdateProperties(selectedNode.id, { [propName]: value });
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{definition.title}</h2>
            <p className="text-xs text-gray-500">{definition.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-2 bg-gray-100 p-2 rounded text-xs font-mono text-gray-600 max-h-20 overflow-auto">
          <pre className="whitespace-pre-wrap break-all">
            {definition.codeTemplate}
          </pre>
        </div>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Properties
        </h3>

        {definition.properties.map(prop => (
          <PropertyField
            key={prop.name}
            property={prop}
            value={properties[prop.name] ?? prop.default}
            onChange={(value) => handlePropertyChange(prop.name, value)}
          />
        ))}

        {definition.properties.length === 0 && (
          <p className="text-sm text-gray-500 italic">No editable properties</p>
        )}
      </div>

      {/* Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-2">
        <button
          onClick={() => onDuplicateNode(selectedNode.id)}
          className="w-full py-2 px-3 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          Duplicate Block
        </button>
        <button
          onClick={() => {
            onDeleteNode(selectedNode.id);
            onClose();
          }}
          className="w-full py-2 px-3 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
        >
          Delete Block
        </button>
      </div>
    </div>
  );
};

interface PropertyFieldProps {
  property: BlockProperty;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

const PropertyField: React.FC<PropertyFieldProps> = ({ property, value, onChange }) => {
  if (property.type === 'boolean') {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={e => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">{property.label}</span>
      </label>
    );
  }

  if (property.type === 'number') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {property.label}
        </label>
        <input
          type="number"
          value={Number(value)}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    );
  }

  if (property.type === 'code') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {property.label}
        </label>
        <textarea
          value={String(value)}
          onChange={e => onChange(e.target.value)}
          rows={4}
          spellCheck={false}
          className="w-full px-2 py-1.5 text-sm font-mono border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-gray-900 text-green-400"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {property.label}
      </label>
      <input
        type="text"
        value={String(value)}
        onChange={e => onChange(e.target.value)}
        placeholder={`Enter ${property.label.toLowerCase()}`}
        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default PropertiesPanel;
