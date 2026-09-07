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
export interface Diagnostic {
  fileId: string;
  filePath: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  source?: string;
  code?: string;
}

const ERROR_PATTERNS = [
  {
    pattern: /^(.+?):(\d+):(\d+)\s*-\s*error\s+(TS\d+):\s*(.+)$/i,
    severity: 'error' as const,
  },
  {
    pattern: /^(.+?):(\d+):(\d+)\s*-\s*warning\s+(TS\d+):\s*(.+)$/i,
    severity: 'warning' as const,
  },
  {
    pattern: /^(.+?):(\d+):(\d+)\s*-\s*(error|warning)\s+(TS\d+)?:?\s*(.+)$/i,
    severity: 'error' as const,
  },
  {
    pattern: /^Error:\s+(.+?):(\d+):(\d+)\s+(.+)$/i,
    severity: 'error' as const,
  },
  {
    pattern: /^Warning:\s+(.+?):(\d+):(\d+)\s+(.+)$/i,
    severity: 'warning' as const,
  },
  {
    pattern: /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(.+?):\s+(.+)$/i,
    severity: 'error' as const,
  },
];

export function parseDiagnostics(text: string, filesMap: Map<string, string>): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    for (const { pattern, severity } of ERROR_PATTERNS) {
      const match = trimmed.match(pattern);
      if (match) {
        const filePath = match[1];
        const lineNum = parseInt(match[2], 10);
        const columnNum = parseInt(match[3], 10);
        const message = match[match.length - 1];
        const code = match[4];
        
        diagnostics.push({
          fileId: filePath,
          filePath,
          line: lineNum,
          column: columnNum,
          message,
          severity: severity,
          source: 'typescript',
          code,
        });
        break;
      }
    }
  }
  
  return diagnostics;
}

export function parseEsLintOutput(text: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const lines = text.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(.+?):\s*line\s+(\d+),\s*col(?:umn)?\s+(\d+),\s*(error|warning)\s*-\s*(.+)$/i);
    if (match) {
      diagnostics.push({
        fileId: match[1],
        filePath: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10),
        message: match[5],
        severity: match[4].toLowerCase() as 'error' | 'warning',
        source: 'eslint',
      });
    }
  }
  
  return diagnostics;
}

export function convertToMonacoMarkers(diagnostics: Diagnostic[]): any[] {
  return diagnostics.map(d => ({
    severity: d.severity === 'error' ? 8 : d.severity === 'warning' ? 4 : 3,
    message: d.message,
    startLineNumber: d.line,
    startColumn: d.column,
    endLineNumber: d.endLine || d.line,
    endColumn: d.endColumn || d.column + 10,
    source: d.source,
    code: d.code,
  }));
}

