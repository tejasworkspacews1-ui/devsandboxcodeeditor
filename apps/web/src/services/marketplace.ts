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
export interface MarketplaceExtension {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  downloads: number;
  rating: number;
  type: 'theme' | 'snippet' | 'command' | 'formatter' | 'language';
  icon?: string;
  installUrl: string;
  readme?: string;
}

const MARKETPLACE_EXTENSIONS: MarketplaceExtension[] = [
  {
    id: 'mp-dark-matte',
    name: 'Dark Matte',
    version: '1.0.0',
    description: 'Premium dark matte theme with subtle borders and soft contrast',
    author: 'DevSandbox',
    downloads: 1250,
    rating: 4.8,
    type: 'theme',
    installUrl: '/extensions/dark-matte.json',
  },
  {
    id: 'mp-solarized',
    name: 'Solarized',
    version: '1.0.0',
    description: 'Solarized color scheme for comfortable coding',
    author: 'DevSandbox',
    downloads: 890,
    rating: 4.6,
    type: 'theme',
    installUrl: '/extensions/solarized.json',
  },
  {
    id: 'mp-react-snippets',
    name: 'React Snippets',
    version: '2.0.0',
    description: 'Common React snippets for faster development',
    author: 'DevSandbox',
    downloads: 2340,
    rating: 4.9,
    type: 'snippet',
    installUrl: '/extensions/react-snippets.json',
  },
  {
    id: 'mp-tailwind-snippets',
    name: 'Tailwind Snippets',
    version: '1.0.0',
    description: 'Tailwind CSS class snippets',
    author: 'DevSandbox',
    downloads: 1560,
    rating: 4.7,
    type: 'snippet',
    installUrl: '/extensions/tailwind-snippets.json',
  },
  {
    id: 'mp-prettier',
    name: 'Prettier Formatter',
    version: '1.0.0',
    description: 'Code formatting with Prettier',
    author: 'DevSandbox',
    downloads: 3200,
    rating: 4.8,
    type: 'formatter',
    installUrl: '/extensions/prettier.json',
  },
  {
    id: 'mp-eslint',
    name: 'ESLint Integration',
    version: '1.0.0',
    description: 'Real-time ESLint diagnostics',
    author: 'DevSandbox',
    downloads: 2870,
    rating: 4.7,
    type: 'formatter',
    installUrl: '/extensions/eslint.json',
  },
  {
    id: 'mp-python-ext',
    name: 'Python Support',
    version: '1.0.0',
    description: 'Python language support with IntelliSense',
    author: 'DevSandbox',
    downloads: 980,
    rating: 4.5,
    type: 'language',
    installUrl: '/extensions/python.json',
  },
  {
    id: 'mp-docker-ext',
    name: 'Docker Support',
    version: '1.0.0',
    description: 'Dockerfile syntax highlighting and snippets',
    author: 'DevSandbox',
    downloads: 760,
    rating: 4.4,
    type: 'language',
    installUrl: '/extensions/docker.json',
  },
];

export function getMarketplaceExtensions(): MarketplaceExtension[] {
  return MARKETPLACE_EXTENSIONS;
}

export function getMarketplaceExtension(id: string): MarketplaceExtension | undefined {
  return MARKETPLACE_EXTENSIONS.find(ext => ext.id === id);
}

export function searchMarketplace(query: string): MarketplaceExtension[] {
  if (!query.trim()) return MARKETPLACE_EXTENSIONS;
  
  const q = query.toLowerCase();
  return MARKETPLACE_EXTENSIONS.filter(ext =>
    ext.name.toLowerCase().includes(q) ||
    ext.description.toLowerCase().includes(q) ||
    ext.author.toLowerCase().includes(q)
  );
}

export function installExtension(id: string): boolean {
  const ext = getMarketplaceExtension(id);
  if (!ext) return false;
  
  // Simulate installation
  console.log(`Installing ${ext.name}...`);
  return true;
}

export function uninstallExtension(id: string): boolean {
  console.log(`Uninstalling ${id}...`);
  return true;
}
