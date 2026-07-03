import { BlockDefinition } from '../types';

export const blockDefinitions: BlockDefinition[] = [
  // Input Blocks
  {
    type: 'start',
    title: 'Start',
    description: 'Entry point of the program',
    category: 'input',
    icon: 'Play',
    color: '#10B981',
    codeTemplate: '# Program starts here\n',
    properties: [
      { name: 'comment', label: 'Comment', type: 'text', default: '' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'input',
    title: 'User Input',
    description: 'Get input from user via console',
    category: 'input',
    icon: 'Keyboard',
    color: '#F59E0B',
    codeTemplate: `{{variable}} = {{input_type}}(input("{{prompt}}"))`,
    properties: [
      { name: 'variable', label: 'Variable Name', type: 'text', default: 'user_input' },
      { name: 'input_type', label: 'Input Type', type: 'text', default: 'str' },
      { name: 'prompt', label: 'Prompt Message', type: 'text', default: 'Enter value: ' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'variable',
    title: 'Variable',
    description: 'Create a variable with a value',
    category: 'input',
    icon: 'Variable',
    color: '#3B82F6',
    codeTemplate: `{{variable}} = {{value}}`,
    properties: [
      { name: 'variable', label: 'Variable Name', type: 'text', default: 'x' },
      { name: 'value', label: 'Initial Value', type: 'text', default: '0' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'list',
    title: 'List',
    description: 'Create a list/array',
    category: 'input',
    icon: 'List',
    color: '#8B5CF6',
    codeTemplate: `{{variable}} = [{{values}}]`,
    properties: [
      { name: 'variable', label: 'List Name', type: 'text', default: 'my_list' },
      { name: 'values', label: 'Values (comma separated)', type: 'text', default: '1, 2, 3' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'dict',
    title: 'Dictionary',
    description: 'Create a dictionary/object',
    category: 'input',
    icon: 'CurlyBraces',
    color: '#EC4899',
    codeTemplate: `{{variable}} = {
{{content}}
}`,
    properties: [
      { name: 'variable', label: 'Dictionary Name', type: 'text', default: 'my_dict' },
      { name: 'content', label: 'Content (key: value per line)', type: 'code', default: '    "name": "John",\n    "age": 25' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },

  // Control Flow Blocks
  {
    type: 'if',
    title: 'If Statement',
    description: 'Conditional branching',
    category: 'control',
    icon: 'GitBranch',
    color: '#F59E0B',
    codeTemplate: `if {{condition}}:
    {{body}}`,
    properties: [
      { name: 'condition', label: 'Condition', type: 'text', default: 'x > 0' },
      { name: 'body', label: 'Body Code', type: 'code', default: 'pass' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [
      { name: 'true', label: 'True' },
      { name: 'false', label: 'False' }
    ]
  },
  {
    type: 'ifelse',
    title: 'If-Else Statement',
    description: 'Conditional branching with else',
    category: 'control',
    icon: 'GitBranch',
    color: '#F59E0B',
    codeTemplate: `if {{condition}}:
    {{true_body}}
else:
    {{false_body}}`,
    properties: [
      { name: 'condition', label: 'Condition', type: 'text', default: 'x > 0' },
      { name: 'true_body', label: 'True Body', type: 'code', default: 'pass' },
      { name: 'false_body', label: 'False Body', type: 'code', default: 'pass' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'loop_for',
    title: 'For Loop',
    description: 'Iterate a fixed number of times',
    category: 'control',
    icon: 'Repeat',
    color: '#14B8A6',
    codeTemplate: `for {{variable}} in range({{start}}, {{end}}, {{step}}):
    {{body}}`,
    properties: [
      { name: 'variable', label: 'Iterator Variable', type: 'text', default: 'i' },
      { name: 'start', label: 'Start', type: 'number', default: 0 },
      { name: 'end', label: 'End', type: 'number', default: 10 },
      { name: 'step', label: 'Step', type: 'number', default: 1 },
      { name: 'body', label: 'Loop Body', type: 'code', default: 'print(i)' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [
      { name: 'loop', label: 'Loop Body' },
      { name: 'done', label: 'After Loop' }
    ]
  },
  {
    type: 'loop_for_each',
    title: 'For Each Loop',
    description: 'Iterate over a collection',
    category: 'control',
    icon: 'Repeat',
    color: '#14B8A6',
    codeTemplate: `for {{variable}} in {{collection}}:
    {{body}}`,
    properties: [
      { name: 'variable', label: 'Item Variable', type: 'text', default: 'item' },
      { name: 'collection', label: 'Collection', type: 'text', default: 'my_list' },
      { name: 'body', label: 'Loop Body', type: 'code', default: 'print(item)' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [
      { name: 'loop', label: 'Loop Body' },
      { name: 'done', label: 'After Loop' }
    ]
  },
  {
    type: 'loop_while',
    title: 'While Loop',
    description: 'Loop while condition is true',
    category: 'control',
    icon: 'Repeat',
    color: '#14B8A6',
    codeTemplate: `while {{condition}}:
    {{body}}`,
    properties: [
      { name: 'condition', label: 'Condition', type: 'text', default: 'x < 10' },
      { name: 'body', label: 'Loop Body', type: 'code', default: 'x += 1' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [
      { name: 'loop', label: 'Loop Body' },
      { name: 'done', label: 'After Loop' }
    ]
  },

  // Process Blocks
  {
    type: 'assign',
    title: 'Assignment',
    description: 'Assign a value to a variable',
    category: 'process',
    icon: 'Equal',
    color: '#6366F1',
    codeTemplate: `{{variable}} = {{expression}}`,
    properties: [
      { name: 'variable', label: 'Variable Name', type: 'text', default: 'x' },
      { name: 'expression', label: 'Expression', type: 'text', default: 'x + 1' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'arithmetic',
    title: 'Arithmetic Operation',
    description: 'Perform a math operation',
    category: 'process',
    icon: 'Calculator',
    color: '#6366F1',
    codeTemplate: `{{result}} = {{operand1}} {{operator}} {{operand2}}`,
    properties: [
      { name: 'result', label: 'Result Variable', type: 'text', default: 'result' },
      { name: 'operand1', label: 'First Operand', type: 'text', default: 'x' },
      { name: 'operator', label: 'Operator (+, -, *, /, //, %, **)', type: 'text', default: '+' },
      { name: 'operand2', label: 'Second Operand', type: 'text', default: 'y' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'compare',
    title: 'Comparison',
    description: 'Compare two values',
    category: 'process',
    icon: 'Scale',
    color: '#6366F1',
    codeTemplate: `{{result}} = {{operand1}} {{operator}} {{operand2}}`,
    properties: [
      { name: 'result', label: 'Result Variable', type: 'text', default: 'is_equal' },
      { name: 'operand1', label: 'First Operand', type: 'text', default: 'x' },
      { name: 'operator', label: 'Operator (==, !=, <, >, <=, >=)', type: 'text', default: '==' },
      { name: 'operand2', label: 'Second Operand', type: 'text', default: 'y' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'string_op',
    title: 'String Operation',
    description: 'Manipulate strings',
    category: 'process',
    icon: 'Type',
    color: '#6366F1',
    codeTemplate: `{{result}} = {{operation}}`,
    properties: [
      { name: 'result', label: 'Result Variable', type: 'text', default: 'result' },
      { name: 'operation', label: 'String Operation', type: 'code', default: 'text.upper()' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'list_op',
    title: 'List Operation',
    description: 'Manipulate lists',
    category: 'process',
    icon: 'List',
    color: '#6366F1',
    codeTemplate: `{{result}} = {{operation}}`,
    properties: [
      { name: 'result', label: 'Result Variable', type: 'text', default: 'result' },
      { name: 'operation', label: 'List Operation', type: 'code', default: 'my_list.append(item)' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },

  // Function Blocks
  {
    type: 'function',
    title: 'Function Definition',
    description: 'Define a custom function',
    category: 'function',
    icon: 'SquareFunction',
    color: '#8B5CF6',
    codeTemplate: `def {{name}}({{params}}):
    {{body}}
    {{return_statement}}`,
    properties: [
      { name: 'name', label: 'Function Name', type: 'text', default: 'my_function' },
      { name: 'params', label: 'Parameters', type: 'text', default: '' },
      { name: 'body', label: 'Function Body', type: 'code', default: 'pass' },
      { name: 'return_statement', label: 'Return Statement', type: 'text', default: 'return None' }
    ],
    inputs: [],
    outputs: [
      { name: 'call', label: 'Call Point' },
      { name: 'done', label: 'After Definition' }
    ]
  },
  {
    type: 'function_call',
    title: 'Function Call',
    description: 'Call a function',
    category: 'function',
    icon: 'SquareFunction',
    color: '#8B5CF6',
    codeTemplate: `{{result}} = {{name}}({{args}})`,
    properties: [
      { name: 'result', label: 'Result Variable (or None)', type: 'text', default: 'result' },
      { name: 'name', label: 'Function Name', type: 'text', default: 'print' },
      { name: 'args', label: 'Arguments', type: 'text', default: '' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'lambda',
    title: 'Lambda Function',
    description: 'Create an anonymous function',
    category: 'function',
    icon: 'Zap',
    color: '#8B5CF6',
    codeTemplate: `{{variable}} = lambda {{params}}: {{expression}}`,
    properties: [
      { name: 'variable', label: 'Variable Name', type: 'text', default: 'func' },
      { name: 'params', label: 'Parameters', type: 'text', default: 'x' },
      { name: 'expression', label: 'Expression', type: 'text', default: 'x * 2' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },

  // Output Blocks
  {
    type: 'print',
    title: 'Print',
    description: 'Print output to console',
    category: 'output',
    icon: 'Monitor',
    color: '#EF4444',
    codeTemplate: `print({{content}})`,
    properties: [
      { name: 'content', label: 'Content', type: 'text', default: '"Hello, World!"' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'print_formatted',
    title: 'Formatted Print',
    description: 'Print with formatting',
    category: 'output',
    icon: 'Monitor',
    color: '#EF4444',
    codeTemplate: `print(f"{{format}}")`,
    properties: [
      { name: 'format', label: 'Format String', type: 'text', default: 'Value: {x}' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'write_file',
    title: 'Write to File',
    description: 'Write content to a file',
    category: 'output',
    icon: 'FileText',
    color: '#EF4444',
    codeTemplate: `with open("{{filename}}", "{{mode}}") as f:
    f.write({{content}})`,
    properties: [
      { name: 'filename', label: 'Filename', type: 'text', default: 'output.txt' },
      { name: 'mode', label: 'Mode (w, a)', type: 'text', default: 'w' },
      { name: 'content', label: 'Content', type: 'text', default: 'data' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'end',
    title: 'End',
    description: 'Exit point of the program',
    category: 'output',
    icon: 'Square',
    color: '#10B981',
    codeTemplate: '\n# Program ends here\n',
    properties: [
      { name: 'comment', label: 'Comment', type: 'text', default: '' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: []
  },

  // Special Blocks
  {
    type: 'comment',
    title: 'Comment',
    description: 'Add a comment to the code',
    category: 'process',
    icon: 'MessageSquare',
    color: '#6B7280',
    codeTemplate: `# {{text}}`,
    properties: [
      { name: 'text', label: 'Comment Text', type: 'text', default: 'This is a comment' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'import',
    title: 'Import',
    description: 'Import a module',
    category: 'input',
    icon: 'Package',
    color: '#F59E0B',
    codeTemplate: `import {{module}}{{alias}}`,
    properties: [
      { name: 'module', label: 'Module Name', type: 'text', default: 'math' },
      { name: 'alias', label: 'Alias (as ...)', type: 'text', default: '' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'import_from',
    title: 'Import From',
    description: 'Import specific items from a module',
    category: 'input',
    icon: 'Package',
    color: '#F59E0B',
    codeTemplate: `from {{module}} import {{items}}`,
    properties: [
      { name: 'module', label: 'Module Name', type: 'text', default: 'math' },
      { name: 'items', label: 'Items to Import', type: 'text', default: 'sqrt, pi' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'try_catch',
    title: 'Try-Except',
    description: 'Error handling block',
    category: 'control',
    icon: 'Shield',
    color: '#F59E0B',
    codeTemplate: `try:
    {{try_body}}
except {{exception_type}} as {{exception_var}}:
    {{except_body}}`,
    properties: [
      { name: 'try_body', label: 'Try Body', type: 'code', default: 'pass' },
      { name: 'exception_type', label: 'Exception Type', type: 'text', default: 'Exception' },
      { name: 'exception_var', label: 'Exception Variable', type: 'text', default: 'e' },
      { name: 'except_body', label: 'Except Body', type: 'code', default: 'print(f"Error: {e}")' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [
      { name: 'output', label: 'Output' },
      { name: 'error', label: 'On Error' }
    ]
  },

  // Advanced Blocks
  {
    type: 'class',
    title: 'Class Definition',
    description: 'Define a class',
    category: 'function',
    icon: 'Box',
    color: '#8B5CF6',
    codeTemplate: `class {{name}}:
{{body}}`,
    properties: [
      { name: 'name', label: 'Class Name', type: 'text', default: 'MyClass' },
      { name: 'body', label: 'Class Body', type: 'code', default: '    def __init__(self):\n        pass' }
    ],
    inputs: [],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'list_comprehension',
    title: 'List Comprehension',
    description: 'Create a list using comprehension',
    category: 'process',
    icon: 'List',
    color: '#6366F1',
    codeTemplate: `{{result}} = [{{expression}} for {{variable}} in {{iterable}}{{condition}}]`,
    properties: [
      { name: 'result', label: 'Result Variable', type: 'text', default: 'result' },
      { name: 'expression', label: 'Expression', type: 'text', default: 'x * 2' },
      { name: 'variable', label: 'Iterator Variable', type: 'text', default: 'x' },
      { name: 'iterable', label: 'Iterable', type: 'text', default: 'range(10)' },
      { name: 'condition', label: 'If Condition (optional)', type: 'text', default: '' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: [{ name: 'output', label: 'Output' }]
  },
  {
    type: 'break',
    title: 'Break',
    description: 'Exit from a loop',
    category: 'control',
    icon: 'Square',
    color: '#EF4444',
    codeTemplate: 'break',
    properties: [],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: []
  },
  {
    type: 'continue',
    title: 'Continue',
    description: 'Skip to next iteration',
    category: 'control',
    icon: 'SkipForward',
    color: '#F59E0B',
    codeTemplate: 'continue',
    properties: [],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: []
  },
  {
    type: 'return',
    title: 'Return',
    description: 'Return from a function',
    category: 'control',
    icon: 'CornerDownLeft',
    color: '#EF4444',
    codeTemplate: `return {{value}}`,
    properties: [
      { name: 'value', label: 'Return Value', type: 'text', default: 'None' }
    ],
    inputs: [{ name: 'input', label: 'Input' }],
    outputs: []
  }
];

export const getBlockDefinition = (type: string): BlockDefinition | undefined => {
  return blockDefinitions.find(block => block.type === type);
};

export const getBlocksByCategory = () => {
  const categories: Record<string, BlockDefinition[]> = {
    input: [],
    control: [],
    process: [],
    output: [],
    function: []
  };

  blockDefinitions.forEach(block => {
    categories[block.category].push(block);
  });

  return categories;
};
