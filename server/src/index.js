import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import eventsRoutes from './routes/events.routes.js';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'EventFlow API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

await connectDB();

app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
