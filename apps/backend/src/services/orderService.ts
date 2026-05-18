import Order, { IOrder } from "../models/Order";
import OrderItem from "../models/OrderItem";
import CartItem from "../models/CartItem";
import { createHttpError } from "../middleware/HttpError";
import type { CartOwner } from "../types/cart.types";
import type { CreateOrderInput } from "../schemas/orderSchemas";
import { findCartByOwner, getCartPayload } from "./cartService";

type CreateOrderData = Omit<CreateOrderInput, "items">;
type CreateOrderItemInput = CreateOrderInput["items"][number];


export async function createOrder(
  orderData: CreateOrderData,
  items: CreateOrderItemInput[],
) {
  const orderPayload = {
    totalPrice: orderData.totalPrice,
    status: orderData.status ?? "pending",
    paymentStatus: orderData.paymentStatus ?? "pending",
    ...(orderData.user ? { user: orderData.user } : {}),
    ...(orderData.sessionId ? { sessionId: orderData.sessionId } : {}),
  };

  const order = await Order.create(orderPayload);

  const orderItems = await OrderItem.insertMany(
    items.map((item) => ({
      ...item,
      order: order._id,
    })),
  );

  return {
    ...order.toObject(),
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

//Finds all orders, adds user info to each order, finds all order items for each order, adds product variant info to each item, returns orders with items included.

export async function getOrdersWithItemsByUser(userId: string) {
  const orders = await Order.find({ user: userId })
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const items = await OrderItem.find({ order: order._id }).populate({
        path: "productVariant",
        populate: {
          path: "product",
        },
      }
      );

      return {
        ...order.toObject(),
        items,
      };
    })
  );

  return ordersWithItems;
}

export async function updateOrderStatus(
  id: string,
  status?: IOrder["status"],
  paymentStatus?: IOrder["paymentStatus"],
) {
  const updateData: Partial<Pick<IOrder, "status" | "paymentStatus">> = {};

  if (status !== undefined) {
    updateData.status = status;
  }

  if (paymentStatus !== undefined) {
    updateData.paymentStatus = paymentStatus;
  }

  const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
  }).populate("user", "name email role");

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
