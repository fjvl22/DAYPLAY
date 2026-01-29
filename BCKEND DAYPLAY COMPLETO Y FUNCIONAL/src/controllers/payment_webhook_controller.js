import Stripe from "stripe";
import { UserPending, AppUser, Payment } from "../models/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send("Webhook error");
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const personId = session.metadata.personId;
    const planType = session.metadata.planType;

    await Payment.create({
      userId: personId,
      amount: planType === "BASIC" ? 10.00 : 15.00,
      paymentMethod: "STRIPE",
      transactionId: session.payment_intent
    });

    await UserPending.destroy({ where: { personId } });

    await AppUser.create({ personId, planType });
  }

  res.json({ received: true });
};
