import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService";

type OrderIdParams = {
  id: string;
};

type UserIdParams = {
  userId: string;
};

// CREATE ORDER
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Split body into order-data and items (frontend send all in one object)
    const { items, ...orderData } = req.body;

    const newOrder = await orderService.createOrder(orderData, items);
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
}

// GET ALL ORDERS (for admin)
export async function getAllOrders(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

// GET SINGLE ORDER
export async function getOrderById(
  req: Request<OrderIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

// GET ORDERS FOR A SPECIFIC USER
export async function getOrdersByUser(
  req: Request<UserIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await orderService.getOrdersByUser(req.params.userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

// UPDATE ORDER STATUS (for admin/seller)
export async function updateOrderStatus(
  req: Request<OrderIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { status, paymentStatus } = req.body;

    const updatedOrder = await orderService.updateOrderStatus(
      req.params.id,
      status,
      paymentStatus,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

export async function createOrderFromCart(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await orderService.createOrderFromCart(req.user?.id!);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}
