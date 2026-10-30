/*!
 * Developer: Tejas Kamble
 * Email: tejasksocials@gmail.com
 * Website: https://tejaskambleportfolio.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejaskambleportfolio/
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
import type { FileNode } from '../types';

export function getStarterTemplates(): {
  react: FileNode[];
  web: FileNode[];
  python: FileNode[];
} {
  const now = Date.now();

  const reactFiles: FileNode[] = [
    {
      id: `file_app_tsx_${now}`,
      name: 'App.tsx',
      path: '/App.tsx',
      type: 'file',
      content: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Developer');

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#090d16',
      color: '#f8fafc',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: '#131b2e',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '480px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', color: '#60a5fa' }}>
          DevSandbox React App
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Real-time in-browser compilation & instant hot preview.
        </p>

        <div style={{ margin: '1.5rem 0' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            style={{
              background: '#090d16',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              color: '#f8fafc',
              fontSize: '0.9rem',
              width: '80%',
              outline: 'none',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          />
          <div style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 500 }}>
            Hello, {name || 'World'}! 👋
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
          <button
            onClick={() => setCount(c => c - 1)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#f8fafc',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            -
          </button>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, width: '4rem', fontFamily: 'monospace' }}>
            {count}
          </span>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: '#3b82f6',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
`,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `file_index_html_${now}`,
      name: 'index.html',
      path: '/index.html',
      type: 'file',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Sandbox</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `file_style_css_${now}`,
      name: 'style.css',
      path: '/style.css',
      type: 'file',
      content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #090d16;
  color: #f8fafc;
}
`,
      createdAt: now,
      updatedAt: now,
    }
  ];

  const webFiles: FileNode[] = [
    {
      id: `file_index_html_${now}`,
      name: 'index.html',
      path: '/index.html',
      type: 'file',
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevSandbox Web App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="card">
    <div class="badge">Live Sandbox Active</div>
    <h1>Modern Web Starter</h1>
    <p>HTML5, Modern CSS, and Vanilla JavaScript with instant live preview execution.</p>
    
    <div class="counter-box">
      <button id="decBtn" class="btn secondary">- Decrement</button>
      <span id="counter" class="number">0</span>
      <button id="incBtn" class="btn primary">+ Increment</button>
    </div>

    <div class="interactive-area">
      <input type="text" id="userInput" placeholder="Type something live..." />
      <p id="outputEcho" class="echo">Echo: </p>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
`,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `file_style_css_${now}`,
      name: 'style.css',
      path: '/style.css',
      type: 'file',
      content: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #090d16;
  color: #f8fafc;
  padding: 2rem;
}

.card {
  background: #131b2e;
  border: 1px solid #1e293b;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
  margin-bottom: 1rem;
}

h1 {
  font-size: 1.75rem;
  color: #60a5fa;
  margin-bottom: 0.5rem;
}

p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.counter-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn.primary:hover {
  background: #2563eb;
}

.btn.secondary {
  background: #1e293b;
  color: #f8fafc;
  border: 1px solid #334155;
}

.btn.secondary:hover {
  background: #334155;
}

.number {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: monospace;
  color: #38bdf8;
  min-width: 3rem;
}

.interactive-area {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #1e293b;
}

input {
  width: 100%;
  padding: 0.6rem 1rem;
  background: #090d16;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
  text-align: center;
}

input:focus {
  border-color: #3b82f6;
}

.echo {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #a78bfa;
}
`,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `file_script_js_${now}`,
      name: 'script.js',
      path: '/script.js',
      type: 'file',
      content: `// Interactive DevSandbox Client Script
let count = 0;
const counterEl = document.getElementById('counter');
const incBtn = document.getElementById('incBtn');
const decBtn = document.getElementById('decBtn');
const userInput = document.getElementById('userInput');
const outputEcho = document.getElementById('outputEcho');

if (incBtn && decBtn && counterEl) {
  incBtn.addEventListener('click', () => {
    count++;
    counterEl.textContent = count;
  });

  decBtn.addEventListener('click', () => {
    count--;
    counterEl.textContent = count;
  });
}

if (userInput && outputEcho) {
  userInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    outputEcho.textContent = val ? \`Echo: \${val} ✨\` : 'Echo: ';
  });
}

console.log('DevSandbox Web Starter initialized successfully!');
`,
      createdAt: now,
      updatedAt: now,
    }
  ];

  const pythonFiles: FileNode[] = [
    {
      id: `file_main_py_${now}`,
      name: 'main.py',
      path: '/main.py',
      type: 'file',
      content: `"""
DevSandbox Virtual Python Script
Developer: Tejas Kamble
"""

def fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

def main():
    print("Welcome to DevSandbox Python Virtual Interpreter!")
    print("Computing Fibonacci sequence...")
    result = fibonacci(10)
    print(f"Fibonacci (first 10 numbers): {result}")
    
    total = sum(result)
    print(f"Sum of sequence: {total}")
    print("Execution complete!")

if __name__ == '__main__':
    main()
`,
      createdAt: now,
      updatedAt: now,
    }
  ];

  return { react: reactFiles, web: webFiles, python: pythonFiles };
}
