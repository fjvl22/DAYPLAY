import Stripe from "stripe";
import AppUser from "../models/app_user.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICES = {
    BASIC: 1000,
    PREMIUM: 1500
};

export const createCheckoutSession = async (req, res) => {
    const userId = req.user.id;
    const { planType } = req.body;
    if(!PLAN_PRICES[planType]) return res.status(400).json({ error: "Invalid plan" });
    const user = await AppUser.findByPk(userId);
    if(!user) return res.status(404).json({ error: "User not found" });
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "eur",
                product_data: {
                    name: `Plan ${planType}`
                },
                unit_amount: PLAN_PRICES[planType]
            },
            quantity: 1
        }],
        success_url: `${process.env.FRONT_URL}/payment-success`,
        cancel_url: `${process.env.FRONT_URL}/payment-cancel`,
        metadata: {
            userId: user.id,
            planType
        }
    });
    res.json({ url: session.url });
};