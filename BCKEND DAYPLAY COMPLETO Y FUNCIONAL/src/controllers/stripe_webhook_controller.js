import Stripe from 'stripe';
import Payment from '../models/payment.js';
import AppUser from '../models/app_user.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try{
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    }catch(error){
        console.error("Webhook error: ", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    if(event.type==="checkout.session.completed"){
        const session = event.data.object;
        const userId = session.metadata.userId;
        const planType = session.metadata.planType;
        const amount = session.amount_total / 100;
        await Payment.create({
            userId,
            amount,
            paymentMethod: "STRIPE",
            transactionId: session.payment_intent
        });
        await AppUser.update(
            {
                planType,
                subscriptionDate: new Date()
            },
            { where: { id: userId } }
        );
    }
    res.json({ received: true });
};