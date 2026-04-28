import Order, { IOrder } from "../models/Order";
import OrderItem, { IOrderItem } from "../models/OrderItem";
import { createHttpError } from "../middleware/HttpError";

export async function createOrder(
  orderData: Omit<IOrder, "createdAt" | "updatedAt">,
  itemsData: Omit<IOrderItem, "order" | "createdAt" | "updatedAt">[],
) {
  // Create the order
  const newOrder = await Order.create(orderData);

  // Create all order-items and connect them to new order
  const orderItems = await OrderItem.insertMany(
    itemsData.map((item) => ({
      ...item,
      order: newOrder._id,
    })),
  );
  // Return a complete order containing all items
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
  // Get order using user info
  const order = await Order.findById(id).populate("user", "name email role");

  if (!order) {
    const error = new Error("Order not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  // Get all order items that belongs to this order plus product info
  const items = await OrderItem.find({ order: id }).populate("productVariant");

  // Return a complete order containing items
  return {
    ...order.toObject(),
    items,
  };
}

// Making sure the user only can view their own orders
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
  // Updates order status (and possibly paymentStatus)
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status,
      ...(paymentStatus && { paymentStatus }),
    },
    { new: true }, // returns updated version
  ).populate("user", "name email role");

  if (!updatedOrder) {
    const error = new Error("Order not found") as Error & {
      statusCode?: number;
    };
    error.statusCode = 404;
    throw error;
  }

  // Get items, returns complete order
  const items = await OrderItem.find({ order: id }).populate("productVariant");

  return {
    ...updatedOrder.toObject(),
    items,
  };
}

export async function createOrderFromCart(userId: string) {
  // 1. Fetch the cart
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items",
    populate: { path: "productId" },
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw createHttpError("Cart is empty", 400);
  }

  // 2. Calculate total price
  const totalPrice = cart.items.reduce((sum: number, item: any) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  // 3. Create Order
  const order = await Order.create({
    user: userId,
    totalPrice,
    status: "pending",
    paymentStatus: "pending",
  });

  // 4. Create OrderItems from cart-items
  const orderItemsData = cart.items.map((item: any) => ({
    order: order._id,
    productVariant: item.productId._id, // or productId depending on your models
    quantity: item.quantity,
    priceAtPurchase: item.unitPrice,
  }));

  await OrderItem.insertMany(orderItemsData);

  // 5. Empty the cart
  await CartItem.deleteMany({ cart: cart._id });
  await cart.deleteOne();

  // 6. Return complete order
  return formatCartResponse(String(order._id)); // we reuse the format function or create our own
}
