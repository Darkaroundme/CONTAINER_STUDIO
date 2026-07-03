import React, { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

interface CodePanelProps {
  generatedCode: string;
  onCodeChange?: (code: string) => void;
}

const CodePanel: React.FC<CodePanelProps> = ({ generatedCode, onCodeChange }) => {
  const codeRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedCode, setEditedCode] = React.useState(generatedCode);

  useEffect(() => {
    setEditedCode(generatedCode);
  }, [generatedCode]);

  useEffect(() => {
    if (codeRef.current && !isEditing) {
      Prism.highlightElement(codeRef.current);
    }
  }, [editedCode, isEditing]);

  const handleEditToggle = () => {
    if (isEditing && onCodeChange) {
      onCodeChange(editedCode);
    }
    setIsEditing(!isEditing);
  };

  const lineCount = editedCode.split('\n').length;

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-mono text-gray-400 ml-2">generated_program.py</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleEditToggle}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              isEditing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            onClick={() => setEditedCode(generatedCode)}
            className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            title="Reset to generated code"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto font-mono text-sm relative">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedCode}
            onChange={e => setEditedCode(e.target.value)}
            className="absolute inset-0 w-full h-full bg-gray-900 text-gray-300 p-4 font-mono text-sm resize-none focus:outline-none"
            spellCheck={false}
          />
        ) : (
          <div className="flex">
            {/* Line numbers */}
            <div className="select-none text-right pr-4 py-4 text-gray-500 border-r border-gray-700 bg-gray-800/50">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i + 1} className="leading-6 px-2">
                  {i + 1}
                </div>
              ))}
            </div>
            {/* Code */}
            <pre className="flex-1 p-4 overflow-x-auto">
              <code ref={codeRef} className="language-python leading-6">
                {editedCode}
              </code>
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex items-center justify-between text-xs text-gray-500">
        <span>{lineCount} lines</span>
        <span>{editedCode.length} characters</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          Python
        </span>
      </div>
    </div>
  );
};

export default CodePanel;
