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

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await initDatabase();
    const projects = db.prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC').all([(req as any).userId]) as any[];
    res.json({ projects: projects.map(p => ({ ...p, files: JSON.parse(p.files) })) });
  } catch (err) {
    console.error('Get projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, template, files } = req.body;
    const db = await initDatabase();
    const projectId = uuidv4();
    
    db.run('INSERT INTO projects (id, user_id, name, description, template, files) VALUES (?, ?, ?, ?, ?, ?)', [
      projectId,
      (req as any).userId,
      name || 'Untitled Project',
      description || '',
      template || 'blank',
      JSON.stringify(files || [])
    ]);
    saveDatabase();
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get([projectId]) as any;
    res.status(201).json({ ...project, files: JSON.parse(project.files) });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { name, description, files } = req.body;
    const db = await initDatabase();
    
    const existing = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get([req.params.id, (req as any).userId]) as any;
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    db.run('UPDATE projects SET name = ?, description = ?, files = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      name || existing.name,
      description !== undefined ? description : existing.description,
      JSON.stringify(files || JSON.parse(existing.files)),
      req.params.id
    ]);
    saveDatabase();
    
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get([req.params.id]) as any;
    res.json({ ...project, files: JSON.parse(project.files) });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await initDatabase();
    const result = db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run([req.params.id, (req as any).userId]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    saveDatabase();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

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

export default router;

