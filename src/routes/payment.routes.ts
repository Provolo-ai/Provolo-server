import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import {
  getPaymentTiers,
  getPaymentTierBySlug,
  paymentWebhook,
} from "../controllers/payment.controller.ts";

const paymentRouter: ExpressRouter = Router();

paymentRouter.get("/tiers", getPaymentTiers);
paymentRouter.get("/tiers/:slug", getPaymentTierBySlug);
paymentRouter.post("/webhook", paymentWebhook);

export default paymentRouter;
