import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { z } from 'zod';

// Simple validation schema for fetching products
const querySchema = z.object({
  category: z.string().optional(),
  firmness: z.string().optional(),
  sort: z.string().optional(),
});

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = querySchema.parse(req.query);
    
    let filter: any = { status: 'active' };
    if (query.category) filter.category = query.category;
    if (query.firmness) filter.firmness = query.firmness;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, status: 'active' });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
