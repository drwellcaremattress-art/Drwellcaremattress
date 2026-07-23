import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'dr-well-care-api' });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Mount review routes onto products (e.g., /api/products/:id/reviews)
app.use('/api/products/:id/reviews', reviewRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  connectDB();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
