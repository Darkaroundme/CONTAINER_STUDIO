import { useState } from 'react';
import { blockDefinitions, getBlocksByCategory } from '../blocks/definitions';
import * as LucideIcons from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onDragStart: (e: React.DragEvent, blockType: string) => void;
}

const categoryNames: Record<string, string> = {
  input: 'Input',
  control: 'Control Flow',
  process: 'Process',
  output: 'Output',
  function: 'Functions'
};

const categoryColors: Record<string, string> = {
  input: 'border-l-amber-500 bg-amber-50 hover:bg-amber-100',
  control: 'border-l-teal-500 bg-teal-50 hover:bg-teal-100',
  process: 'border-l-indigo-500 bg-indigo-50 hover:bg-indigo-100',
  output: 'border-l-red-500 bg-red-50 hover:bg-red-100',
  function: 'border-l-violet-500 bg-violet-50 hover:bg-violet-100'
};

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, onDragStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['input', 'control', 'process', 'output', 'function'])
  );

  const blocksByCategory = getBlocksByCategory();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const filteredBlocks = searchQuery
    ? blockDefinitions.filter(
        block =>
          block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          block.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className={`h-full bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-72'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        {!isCollapsed && <h2 className="text-sm font-semibold text-gray-700">Blocks</h2>}
        <button onClick={onToggle} className="p-1.5 rounded-md hover:bg-gray-100">
          <LucideIcons.ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <LucideIcons.Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Block Categories */}
          <div className="p-3 space-y-3 h-[calc(100%-80px)] overflow-y-auto">
            {filteredBlocks ? (
              <div className="space-y-2">
                {filteredBlocks.map(block => (
                  <BlockItem key={block.type} block={block} onDragStart={onDragStart} />
                ))}
              </div>
            ) : (
              Object.keys(blocksByCategory).map(category => (
                <CategorySection
                  key={category}
                  category={category}
                  blocks={blocksByCategory[category]}
                  isExpanded={expandedCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  onDragStart={onDragStart}
                />
              ))
            )}
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="p-2 space-y-2">
          {Object.keys(categoryNames).map(category => {
            const IconComponent = category === 'input' ? LucideIcons.Import
              : category === 'control' ? LucideIcons.GitBranch
              : category === 'process' ? LucideIcons.Cog
              : category === 'output' ? LucideIcons.Monitor
              : LucideIcons.Box;
            return (
              <button
                key={category}
                className="p-2 w-full flex justify-center rounded-md hover:bg-gray-100"
                title={categoryNames[category]}
              >
                <IconComponent className="w-4 h-4 text-gray-500" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface CategorySectionProps {
  category: string;
  blocks: { type: string; title: string; description: string; icon: string; category: string }[];
  isExpanded: boolean;
  onToggle: () => void;
  onDragStart: (e: React.DragEvent, blockType: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  blocks,
  isExpanded,
  onToggle,
  onDragStart
}: CategorySectionProps) => {
  if (blocks.length === 0) return null;

  const IconComponent = category === 'input' ? LucideIcons.Import
    : category === 'control' ? LucideIcons.GitBranch
    : category === 'process' ? LucideIcons.Cog
    : category === 'output' ? LucideIcons.Monitor
    : LucideIcons.Box;

  const iconStyle = category === 'input' ? 'text-amber-600'
    : category === 'control' ? 'text-teal-600'
    : category === 'process' ? 'text-indigo-600'
    : category === 'output' ? 'text-red-600'
    : 'text-violet-600';

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <IconComponent className={`w-4 h-4 ${iconStyle}`} />
        <span>{categoryNames[category]}</span>
        <LucideIcons.ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-1.5 pl-6">
          {blocks.map(block => (
            <BlockItem key={block.type} block={block} onDragStart={onDragStart} />
          ))}
        </div>
      )}
    </div>
  );
};

interface BlockItemProps {
  block: { type: string; title: string; description: string; icon: string; category: string };
  onDragStart: (e: React.DragEvent, blockType: string) => void;
}

const BlockItem: React.FC<BlockItemProps> = ({ block, onDragStart }) => {
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[block.icon]
    || LucideIcons.Square;

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, block.type)}
      className={`flex items-center gap-2 p-2 pl-3 rounded-md cursor-grab border-l-4 active:cursor-grabbing transition-colors ${categoryColors[block.category]}`}
      title={block.description}
    >
      <IconComponent className="w-4 h-4 text-gray-600" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{block.title}</p>
        <p className="text-xs text-gray-500 truncate">{block.description}</p>
      </div>
    </div>
  );
};

export default Sidebar;
