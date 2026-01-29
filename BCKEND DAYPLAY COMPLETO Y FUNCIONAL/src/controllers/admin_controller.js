import Stripe from "stripe";
import { UserPending } from "../models/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICES = {
  BASIC: 1000,
  PREMIUM: 1500
};

export const listPendingUsers = async (req, res) => {
  const pending = await UserPending.findAll();
  res.json(pending);
};

export const approveUserCreatePayment = async (req, res) => {
  const { personId } = req.params;
  const { planType } = req.body;

  if (!PLAN_PRICES[planType])
    return res.status(400).json({ error: "Plan inválido" });

  const pending = await UserPending.findOne({ where: { personId } });
  if (!pending)
    return res.status(404).json({ error: "No es usuario pendiente" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "eur",
        product_data: { name: `Alta usuario ${planType}` },
        unit_amount: PLAN_PRICES[planType]
      },
      quantity: 1
    }],
    success_url: `${process.env.FRONT_URL}/admin/success`,
    cancel_url: `${process.env.FRONT_URL}/admin/cancel`,
    metadata: { personId, planType }
  });

  res.json({ checkoutUrl: session.url });
};
