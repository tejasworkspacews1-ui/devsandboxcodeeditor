/*!
 * Developer: Tejas Kamble
 * Email: tejaskgm1@gmail.com
 * Website: https://tejas-personal-portfolio-dev.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejas-kamble-5342443b1
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
export interface Extension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  icon?: string;
  type: 'theme' | 'snippet' | 'command' | 'formatter' | 'language';
  enabled: boolean;
  config?: Record<string, any>;
}

export interface Snippet {
  id: string;
  name: string;
  body: string;
  prefix: string;
  description: string;
  language: string;
}

export interface Command {
  id: string;
  name: string;
  description: string;
  category: string;
  handler: () => void;
}

class ExtensionManager {
  private extensions: Map<string, Extension> = new Map();
  private snippets: Snippet[] = [];
  private commands: Command[] = [];
  
  register(extension: Extension): void {
    this.extensions.set(extension.id, { ...extension, enabled: true });
  }
  
  unregister(id: string): void {
    this.extensions.delete(id);
  }
  
  getExtensions(): Extension[] {
    return Array.from(this.extensions.values());
  }
  
  getEnabled(): Extension[] {
    return this.getExtensions().filter(e => e.enabled);
  }
  
  toggle(id: string): void {
    const ext = this.extensions.get(id);
    if (ext) {
      ext.enabled = !ext.enabled;
      this.extensions.set(id, ext);
    }
  }
  
  registerSnippet(snippet: Snippet): void {
    this.snippets.push(snippet);
  }
  
  getSnippets(language?: string): Snippet[] {
    if (language) {
      return this.snippets.filter(s => s.language === language);
    }
    return this.snippets;
  }
  
  registerCommand(command: Command): void {
    this.commands.push(command);
  }
  
  getCommands(): Command[] {
    return this.commands;
  }
  
  executeCommand(id: string): void {
    const cmd = this.commands.find(c => c.id === id);
    if (cmd) cmd.handler();
  }
}

export const extensionManager = new ExtensionManager();

// Built-in extensions
extensionManager.register({
  id: 'builtin-themes',
  name: 'Built-in Themes',
  version: '1.0.0',
  description: 'Dark, Light, High Contrast, Midnight, Monochrome, Solarized',
  author: 'DevSandbox',
  type: 'theme',
  enabled: true,
});

extensionManager.register({
  id: 'builtin-snippets',
  name: 'Common Snippets',
  version: '1.0.0',
  description: 'Common code snippets for JavaScript, TypeScript, HTML, CSS',
  author: 'DevSandbox',
  type: 'snippet',
  enabled: true,
});

extensionManager.register({
  id: 'builtin-formatters',
  name: 'Built-in Formatters',
  version: '1.0.0',
  description: 'Prettier-style formatting for JS, TS, CSS, HTML',
  author: 'DevSandbox',
  type: 'formatter',
  enabled: true,
});

// Register common snippets
const commonSnippets: Snippet[] = [
  {
    id: 'snip-console-log',
    name: 'Console Log',
    body: 'console.log("$1");',
    prefix: 'cl',
    description: 'Add a console.log statement',
    language: 'javascript',
  },
  {
    id: 'snip-react-component',
    name: 'React Component',
    body: 'function $1() {\n  return (\n    <div>\n      $2\n    </div>\n  );\n}\n\nexport default $1;',
    prefix: 'rcomp',
    description: 'Create a React functional component',
    language: 'javascript',
  },
  {
    id: 'snip-react-ts-component',
    name: 'React TS Component',
    body: 'interface $1Props {\n  $2: string;\n}\n\nfunction $1({ $2 }: $1Props) {\n  return (\n    <div>\n      $3\n    </div>\n  );\n}\n\nexport default $1;',
    prefix: 'rtscomp',
    description: 'Create a TypeScript React component',
    language: 'typescript',
  },
  {
    id: 'snip-html5',
    name: 'HTML5 Boilerplate',
    body: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>$1</title>\n</head>\n<body>\n  $2\n</body>\n</html>',
    prefix: 'html5',
    description: 'HTML5 boilerplate',
    language: 'html',
  },
  {
    id: 'snip-css-reset',
    name: 'CSS Reset',
    body: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}',
    prefix: 'reset',
    description: 'CSS reset',
    language: 'css',
  },
];

commonSnippets.forEach(s => extensionManager.registerSnippet(s));
