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
import { initDatabase, authMiddleware, saveDatabase } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Create a share link for a project
router.post('/:id/share', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { permission } = req.body;
    const db = await initDatabase();
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get([req.params.id, (req as any).userId]) as any;
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const shareId = uuidv4();
    db.run('INSERT INTO shares (id, project_id, user_id, permission) VALUES (?, ?, ?, ?)', [
      shareId,
      req.params.id,
      (req as any).userId,
      permission || 'view'
    ]);
    saveDatabase();
    
    res.json({ shareId, url: `/share/${shareId}` });
  } catch (err) {
    console.error('Share project error:', err);
    res.status(500).json({ error: 'Failed to share project' });
  }
});

// Get shared project
router.get('/share/:shareId', async (req: Request, res: Response) => {
  try {
    const db = await initDatabase();
    const share = db.prepare('SELECT * FROM shares WHERE id = ?').get([req.params.shareId]) as any;
    if (!share) {
      return res.status(404).json({ error: 'Share not found' });
    }
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get([share.project_id]) as any;
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ ...project, files: JSON.parse(project.files), permission: share.permission });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load shared project' });
  }
});

// Get collaborators for a project
router.get('/:id/collaborators', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await initDatabase();
    const shares = db.prepare('SELECT * FROM shares WHERE project_id = ?').all([req.params.id]) as any[];
    
    const collaborators = shares.map(s => ({
      shareId: s.id,
      permission: s.permission,
    }));
    
    res.json({ collaborators });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get collaborators' });
  }
});

export default router;
