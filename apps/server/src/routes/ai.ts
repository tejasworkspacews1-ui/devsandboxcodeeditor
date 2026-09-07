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
import { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

async function callOpenAI(messages: any[], systemPrompt: string): Promise<string> {
  const response: any = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 2000,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}

async function callAnthropic(messages: any[], systemPrompt: string): Promise<string> {
  const response: any = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-5-sonnet-20241022',
      messages,
      system: systemPrompt,
      max_tokens: 2000,
    },
    {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.content[0].text;
}

function mockResponse(userQuery: string, fileContext: any) {
  const queryLower = userQuery.toLowerCase();

  if (fileContext) {
    let response = `I see you're working with **${fileContext.name}**.\n\n`;

    if (queryLower.includes('explain')) {
      response += `Here's an explanation of the code:\n\n`;
      response += 'The code defines functions and modules that handle application logic. ';
      response += 'Key patterns include component-based architecture, state management, ';
      response += 'and declarative UI rendering.\n\n';
      response += 'Key points:\n';
      response += '- Uses modern JavaScript/TypeScript syntax\n';
      response += '- Follows component-based architecture\n';
      response += '- Handles user interactions and state changes\n';
    } else if (queryLower.includes('fix')) {
      response += `Here are potential fixes for issues in the code:\n\n`;
      response += '1. Check for null/undefined references\n';
      response += '2. Verify type annotations are correct\n';
      response += '3. Ensure proper error handling\n';
      response += '4. Validate input data before processing\n';
    } else if (queryLower.includes('test')) {
      response += `Here are test suggestions:\n\n`;
      response += '```javascript\n';
      response += 'describe("Component", () => {\n';
      response += '  it("should render correctly", () => {\n';
      response += '    // Test case\n';
      response += '  });\n';
      response += '});\n';
      response += '```';
    } else if (queryLower.includes('refactor')) {
      response += `Refactoring suggestions:\n\n`;
      response += '1. Extract reusable logic into custom hooks\n';
      response += '2. Use descriptive variable names\n';
      response += '3. Break large components into smaller ones\n';
      response += '4. Apply SOLID principles\n';
    } else if (queryLower.includes('generate')) {
      response += `Here's a generated implementation:\n\n`;
      response += '```javascript\n';
      response += 'function handleEvent(event) {\n';
      response += '  console.log("Event:", event);\n';
      response += '  // Add your logic here\n';
      response += '}\n';
      response += '```';
    } else {
      response += `I can help you with:\n\n`;
      response += '- **Explain** - Understand what code does\n';
      response += '- **Fix** - Identify and fix errors\n';
      response += '- **Test** - Generate test cases\n';
      response += '- **Refactor** - Improve code structure\n';
      response += '- **Generate** - Create new code\n';
    }
    return response;
  }

  return `Hello! I'm your AI coding assistant. I can help you with:\n\n`;
}

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { messages, fileContext, provider = 'openai' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const lastMessage = messages[messages.length - 1];
    const userQuery = lastMessage?.content || '';

    const systemPrompt = `You are an expert AI coding assistant. Help the user with software development tasks. Provide clear, accurate, and actionable responses. When showing code, use proper markdown code blocks with language tags.`;

    let response: string;
    let safeFileContext = fileContext;

    if (safeFileContext) {
      const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.ico', '.webp'];
      const binaryExts = ['.pdf', '.zip', '.tar', '.gz', '.exe', '.bin'];
      const allBadExts = [...imageExts, ...binaryExts];
      
      if (allBadExts.some(ext => safeFileContext.name?.toLowerCase().endsWith(ext))) {
        safeFileContext = {
          name: safeFileContext.name,
          content: `[${safeFileContext.name} is a binary/image file and cannot be read by the AI]`,
          unsupported: true,
        };
      } else if (typeof safeFileContext.content === 'string' && safeFileContext.content.length > 50000) {
        safeFileContext = {
          ...safeFileContext,
          content: safeFileContext.content.substring(0, 50000) + '\n...[truncated]',
        };
      }
    }

    if (provider === 'anthropic' && ANTHROPIC_API_KEY) {
      response = await callAnthropic(messages, systemPrompt);
    } else if (OPENAI_API_KEY) {
      response = await callOpenAI(messages, systemPrompt);
    } else {
      response = mockResponse(userQuery, safeFileContext);
    }

    res.json({ response, provider, mock: !OPENAI_API_KEY && !(provider === 'anthropic' && ANTHROPIC_API_KEY) });
  } catch (err: any) {
    console.error('AI chat error:', err);
    const errorMessage = err.message || 'AI request failed';
    res.status(500).json({ 
      error: 'AI request failed', 
      details: errorMessage,
      userMessage: `Sorry, I couldn't process that request. ${errorMessage.includes('image') ? 'Image files are not supported by this model.' : 'Please try again.'}`
    });
  }
});

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, language } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are an expert code generator. Generate clean, production-ready code based on the user's request. Return only the code with brief explanations.`;

    let code: string;

    if (OPENAI_API_KEY) {
      code = await callOpenAI(
        [{ role: 'user', content: `Generate ${language || 'JavaScript'} code for: ${prompt}` }],
        systemPrompt
      );
    } else {
      code = language === 'python'
        ? `def ${prompt.replace(/\s+/g, '_').toLowerCase()}():\n    # TODO: Implement ${prompt}\n    pass\n`
        : `function ${prompt.replace(/\s+/g, '')}() {\n  // TODO: Implement ${prompt}\n}\n`;
    }

    res.json({ response: code, provider: 'openai', mock: !OPENAI_API_KEY });
  } catch (err: any) {
    res.status(500).json({ error: 'Generation failed', details: err.message });
  }
});

export default router;
