import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService";
import { getCartOwner } from "../utils/getCartOwner";

import type {
  OrderIdParam,
  UserIdParam,
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "../schemas/orderSchemas";


// CREATE ORDER
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.validatedBody as CreateOrderInput;

    const { items, ...orderData } = body;

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
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as OrderIdParam;

    const order = await orderService.getOrderById(params.id);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
}

// GET ORDERS FOR A SPECIFIC USER
export async function getOrdersByUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as UserIdParam;

    const orders = await orderService.getOrdersByUser(params.userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}

// UPDATE ORDER STATUS (for admin/seller)
export async function updateOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as OrderIdParam;
    const body = req.validatedBody as UpdateOrderStatusInput;

    const updatedOrder = await orderService.updateOrderStatus(
      params.id,
      body.status,
      body.paymentStatus,
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

export async function createOrderFromCart(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const order = await orderService.createOrderFromCart(getCartOwner(res));
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrdersWithItemsByUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as UserIdParam;

    const orders = await orderService.getOrdersWithItemsByUser(params.userId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}
