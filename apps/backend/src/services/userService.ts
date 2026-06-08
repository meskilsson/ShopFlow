import User from "../models/User";
import Product from "../models/Products";
import bcrypt from "bcrypt";
import {
  ValidationError,
  ConflictError,
  NotFoundError,
} from "../errors/AppError";
import type { UpdateUserInput, CreateUserInput } from "../schemas/userSchemas";
import Address from "../models/Address";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Payment from "../models/Payment";
import Cart from "../models/Cart";
import CartItem from "../models/CartItem";


export async function createUser(userData: CreateUserInput) {
  if (
    !userData?.name ||
    !userData?.email ||
    !userData?.username ||
    !userData?.password
  ) {
    throw new ValidationError(
      "Name, email, username and password are required",
    );
  }

  const name = userData.name.trim();
  const email = userData.email.trim().toLowerCase();
  const username = userData.username.trim().toLowerCase();

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ConflictError("Email or username already in use");
  }

  const passwordHash = await bcrypt.hash(userData.password, 10);

  const createdUser = await User.create({
    name,
    email,
    username,
    passwordHash,
    ...(userData.role && { role: userData.role }),
  });

  const safeUser = await User.findOne({ email });

  return safeUser;
}

export async function getAllUsers() {
  const users = await User.find().sort({ createdAt: -1 });
  return users;
}

export async function getUserById(id: string) {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
}

export async function deleteUser(id: string) {
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return { message: "User deleted successfully" };
}

export async function updateUser(id: string, userData: UpdateUserInput) {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updateData: {
    name?: string;
    email?: string;
    username?: string;
    storeName?: string;
  } = {};

  if (userData.name !== undefined) {
    updateData.name = userData.name;
  }

  if (userData.email !== undefined) {
    updateData.email = userData.email;
  }

  if (userData.username !== undefined) {
    updateData.username = userData.username;
  }

  if (userData.storeName !== undefined) {
    updateData.storeName = userData.storeName;
  }

  const conflictConditions = [];

  if (updateData.email) {
    conflictConditions.push({ email: updateData.email });
  }

  if (updateData.username) {
    conflictConditions.push({ username: updateData.username });
  }

  if (conflictConditions.length > 0) {
    const existingUser = await User.findOne({
      _id: { $ne: id },
      $or: conflictConditions,
    });

    if (existingUser) {
      throw new ConflictError("Email or username already in use");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
}

export async function changePasswordService(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await User.findById(userId).select("+passwordHash");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isPasswordCorrect) {
    throw new ValidationError("Current password is incorrect");
  }

  if (!newPassword) {
    throw new ValidationError("New password cannot be empty");
  }

  if (newPassword.length < 6) {
    throw new ValidationError("New password must be at least 6 characters");
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);

  await user.save();

  return {
    message: "Password updated successfully",
  };
}

export async function getWishlist(userId: string) {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    select: "name price category ProductImage",
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user.wishlist;
}

export async function toggleWishlist(userId: string, productId: string) {
  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  const productExists = await Product.exists({ _id: productId });
  if (!productExists) throw new NotFoundError("Product not found");

  const isInWishlist = user.wishlist.some((id) => id.toString() === productId);

  if (isInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId as any);
  }

  await user.save();
  return { inWishlist: !isInWishlist };
}

export async function getMyGdprData(userId: string) {
  const user = await User.findById(userId).select(
    "name email username role createdAt updatedAt",
  );

  const addresses = await Address.find({ user: userId });

  const orders = await Order.find({ user: userId });

  const orderIds = orders.map((order) => order.id);

  const orderItems = await OrderItem.find({
    order: { $in: orderIds },
  }).populate("productVariant");

  const payments = await Payment.find({
    order: { $in: orderIds },
  });

  const cart = await Cart.findOne({ user: userId });

  const cartItems = cart
    ? await CartItem.find({ cart: cart._id }).populate("productVariant")
    : [];

  const sellerProducts = await Product.find({ seller: userId });

  return {
    exportedAt: new Date(),
    account: user,
    addresses,
    orders,
    orderItems,
    payments,
    cart,
    cartItems,
    sellerProducts,
  };
}

export async function deleteMyAccount(userId: string) {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  await Address.deleteMany({ user: userId });

  const cart = await Cart.findOne({ user: userId });

  if (cart) {
    await CartItem.deleteMany({ cart: cart._id });
    await cart.deleteOne();
  }

  await User.findByIdAndUpdate(userId, {
    name: "Deleted user",
    email: `deleted-${userId}$deleted.local`,
    username: `deleted-${userId}`,
    passwordHash: "deleted",
    deletedAt: new Date(),
    deleteReason: "User requested account deletion",
  });

  return {
    message: "Account deleted successfully",
  };
}