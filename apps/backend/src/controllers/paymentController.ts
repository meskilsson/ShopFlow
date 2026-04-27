import { Request, Response, NextFunction } from "express";
import * as paymentService from "../services/paymentService";

type PaymentIdParams = {
  id: string;
};

type OrderIdParams = {
  orderId: string;
};

// CREATE
export async function createPayment(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
}

// GET BY ID
export async function getPaymentById(
  req: Request<PaymentIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
}

// GET PAYMENTS FOR ORDER
export async function getPaymentsByOrder(
  req: Request<OrderIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payments = await paymentService.getPaymentsByOrder(
      req.params.orderId,
    );
    res.status(200).json(payments);
  } catch (error) {
    next(error);
  }
}

// UPDATE STATUS
export async function updatePaymentStatus(
  req: Request<PaymentIdParams>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { status, transactionId } = req.body;
    const updatedPayment = await paymentService.updatePaymentStatus(
      req.params.id,
      status,
      transactionId,
    );
    res.status(200).json(updatedPayment);
  } catch (error) {
    next(error);
  }
}
