import { Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req: AuthRequest, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    const order = new Order({
      orderNumber: `ORD-${Date.now()}`,
      userId: req.user?._id,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentGateway: paymentMethod,
      subtotal: itemsPrice,
      tax: taxPrice,
      shipping: shippingPrice,
      total: totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user?._id });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
