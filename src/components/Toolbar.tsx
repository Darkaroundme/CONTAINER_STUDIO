import { useState, useEffect } from 'react';
import {
  Play, Save, FolderOpen, FilePlus, Download,
  ChevronDown, Loader, Code2
} from 'lucide-react';

interface ToolbarProps {
  projectName: string;
  projectId: string | null;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  onProjectNameChange: (name: string) => void;
  onSave: () => void;
  onNewProject: () => void;
  onLoadProject: (projectId: string) => void;
  onGenerateCode: () => void;
  onDownloadCode: () => void;
  listProjects: () => Promise<{ id: string; name: string; updated_at: string }[]>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  projectName,
  projectId: _projectId,
  isLoading,
  hasUnsavedChanges,
  onProjectNameChange,
  onSave,
  onNewProject,
  onLoadProject,
  onGenerateCode,
  onDownloadCode,
  listProjects
}) => {
  const [showProjects, setShowProjects] = useState(false);
  const [projects, setProjects] = useState<{ id: string; name: string; updated_at: string }[]>([]);

  useEffect(() => {
    if (showProjects) {
      listProjects().then(setProjects);
    }
  }, [showProjects, listProjects]);

  return (
    <div className="h-12 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
      {/* Left section - Logo and project name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900">FlowPy</span>
        </div>

        <div className="h-6 w-px bg-gray-200" />

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={projectName}
            onChange={e => onProjectNameChange(e.target.value)}
            className="px-2 py-1 text-sm border border-transparent hover:border-gray-300 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 font-medium">Unsaved</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onSave}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Open</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showProjects && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProjects(false)}
                />
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                  {projects.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-gray-500">No saved projects</p>
                  ) : (
                    projects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => {
                          onLoadProject(project.id);
                          setShowProjects(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span className="text-sm text-gray-800">{project.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            <FilePlus className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Right section - Generate/Download */}
      <div className="flex items-center gap-2">
        <button
          onClick={onGenerateCode}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg shadow-sm transition-all"
        >
          <Play className="w-4 h-4" />
          <span>Generate Python</span>
        </button>

        <button
          onClick={onDownloadCode}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download .py</span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
