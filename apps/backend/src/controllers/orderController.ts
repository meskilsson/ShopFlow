import { Request, Response, NextFunction } from "express";
import * as orderService from "../services/orderService";
import { getCartOwner } from "../utils/getCartOwner";
import type {
  OrderIdParam,
  UserIdParam,
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "../schemas/orderSchemas";

type OrderIdParams = { id: string };

// CREATE ORDER
export async function createOrder(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validatedData = req.validatedBody as CreateOrderInput;
    const { items, ...orderData } = validatedData;

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
  req: Request<OrderIdParam>,
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

// GET ORDERS FOR USER
export async function getOrdersByUser(
  req: Request<UserIdParam>,
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

// UPDATE ORDER STATUS
export async function updateOrderStatus(
  req: Request<OrderIdParam>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = req.validatedParams as OrderIdParam;
    const body = req.validatedBody as UpdateOrderStatusInput;

    const updatedOrder = await orderService.updateOrderStatus(
      params.id,
      body.status as any,
      body.paymentStatus as any,
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

// CREATE ORDER FROM CART
export async function createOrderFromCart(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // (uses getCartOwner + auth/guest middleware)
    const order = await orderService.createOrderFromCart(getCartOwner(res));
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrdersWithItemsByUser(
  req: Request<UserIdParam>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const orders = await orderService.getOrdersWithItemsByUser(
      req.params.userId,
    );
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}
