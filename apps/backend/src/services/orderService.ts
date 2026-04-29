import Order, { IOrder } from "../models/Order";
import OrderItem, { IOrderItem } from "../models/OrderItem";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";
import { createHttpError } from "../middleware/HttpError";

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

// FIXED: createOrderFromCart – now fully functional
export async function createOrderFromCart(userId: string) {
  // 1. Fetch the user's cart
  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items",
    populate: { path: "productId" }, // adjust if your CartItem uses productVariant instead
  });

  if (!cart || !cart.items || cart.items.length === 0) {
    throw createHttpError("Cart is empty", 400);
  }

  // 2. Calculate total price
  const totalPrice = cart.items.reduce((sum: number, item: any) => {
    return sum + (item.unitPrice || item.productId?.price || 0) * item.quantity;
  }, 0);

  // 3. Create the Order
  const order = await Order.create({
    user: userId,
    totalPrice,
    status: "pending",
    paymentStatus: "pending",
  });

  // 4. Create OrderItems from CartItems
  const orderItemsData = cart.items.map((item: any) => ({
    order: order._id,
    productVariant: item.productId?._id || item.productId, // adjust according to your model
    quantity: item.quantity,
    priceAtPurchase: item.unitPrice || item.productId?.price,
  }));

  await OrderItem.insertMany(orderItemsData);

  // 5. Clear the cart (hard delete as in MVP)
  await CartItem.deleteMany({ cart: cart._id });
  await cart.deleteOne();

  // 6. Return the complete order (same format as getOrderById)
  return getOrderById(order._id.toString());
}
