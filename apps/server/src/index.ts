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
import express from 'express';
import cors from 'cors';
import { initDatabase, saveDatabase } from './database';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import collaborationRoutes from './routes/collaboration';
import aiRoutes from './routes/ai';
import { startWebSocketServer } from './websocket';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/collab', collaborationRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`DevSandbox API server running on http://localhost:${PORT}`);
    startWebSocketServer();
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
