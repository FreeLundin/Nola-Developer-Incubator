import express from 'express';
import { attachRoutes } from './routes';

// Create Express app and attach routes once (cached across lambda invocations where possible)
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
attachRoutes(app);

// Export a default handler to keep compatibility with serverless adapters
export default function handler(req: any, res: any) {
  app(req, res);
}
