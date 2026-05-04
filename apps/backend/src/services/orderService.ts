import Order, { IOrder } from "../models/Order";
import OrderItem, { IOrderItem } from "../models/OrderItem";
import CartItem from "../models/CartItem";
import { createHttpError } from "../middleware/HttpError";
import type { CartOwner } from "../types/cart.types";
import {
  findCartByOwner,
  getCartPayload,
} from "./cartService";

export async function createOrder(
  orderData: Omit<IOrder, "createdAt" | "updatedAt">,
  itemsData: Omit<IOrderItem, "order" | "createdAt" | "updatedAt">[],
) {
  const newOrder = await Order.create(orderData);

  const orderItems = await OrderItem.insertMany(
    itemsData.map((item) => ({
      ...item,
      order: newOrder._id,
    })),
  );

  return {
    ...newOrder.toObject(),
    items: orderItems,
  };
}

export async function getAllOrders() {
  return await Order.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
}

export async function getOrderById(id: string) {
  const order = await Order.findById(id).populate("user", "name email role");

  if (!order) {
    throw createHttpError("Order not found", 404);
  }

  const items = await OrderItem.find({ order: id }).populate("productVariant");

  return {
    ...order.toObject(),
    items,
  };
}

export async function getOrdersByUser(userId: string) {
  return await Order.find({ user: userId })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
}

export async function updateOrderStatus(
  id: string,
  status: IOrder["status"],
  paymentStatus?: IOrder["paymentStatus"],
) {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status,
      ...(paymentStatus && { paymentStatus }),
    },
    { new: true },
  ).populate("user", "name email role");

  if (!updatedOrder) {
    throw createHttpError("Order not found", 404);
  }

  const items = await OrderItem.find({ order: id }).populate("productVariant");

  return {
    ...updatedOrder.toObject(),
    items,
  };
}

export async function createOrderFromCart(owner: CartOwner) {
  const cart = await findCartByOwner(owner);

  if (!cart) {
    throw createHttpError("Cart not found", 404);
  }

  const cartItems = await CartItem.find({ cart: cart._id });

  if (cartItems.length === 0) {
    throw createHttpError("Cart is empty", 400);
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  const order = await Order.create({
    ...getCartPayload(owner),
    totalPrice,
    status: "pending",
    paymentStatus: "pending",
  });

  await OrderItem.insertMany(
    cartItems.map((item) => ({
      order: order._id,
      productVariant: item.productVariant,
      quantity: item.quantity,
      priceAtPurchase: item.unitPrice,
    })),
  );

  await CartItem.deleteMany({ cart: cart._id });

  return getOrderById(order._id.toString());
}
