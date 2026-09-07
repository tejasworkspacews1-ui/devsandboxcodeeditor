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
import { initDatabase, hashPassword, comparePassword, generateToken, authMiddleware } from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }
    
    const db = await initDatabase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get([email]) as any;
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await hashPassword(password);
    const userId = uuidv4();
    
    db.run('INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)', [userId, email, hashedPassword, name]);
    
    const token = generateToken(userId);
    
    res.status(201).json({
      user: { id: userId, email, name },
      token,
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const db = await initDatabase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get([email]) as any;
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = generateToken(user.id);
    
    res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.post('/signout', authMiddleware, (req: Request, res: Response) => {
  res.json({ message: 'Signed out successfully' });
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const db = await initDatabase();
    const user = db.prepare('SELECT id, email, name, avatar_url, created_at FROM users WHERE id = ?').get([(req as any).userId]) as any;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;

