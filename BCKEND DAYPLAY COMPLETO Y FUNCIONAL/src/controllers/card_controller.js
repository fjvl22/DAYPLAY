import Stripe from 'stripe';
import BankCard from '../models/bank_card.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const addCard = async (req, res) => {
    try{
        const { userId, paymentMethodId } = req.body;
        const paymentMethod = await Stripe.paymentMethods.retrieve(paymentMethodId);
        if(paymentMethod.type!=="card") return res.status(400).json({ error: 'Invalid method' });
        const card = paymentMethod.card;
        const bank_card = await BankCard.create({
            token: paymentMethod.id,
            last4: card.last4,
            brand: card.brand,
            expiryMonth: card.exp_month,
            expiryYear: card.exp_year,
            userId
        });
        res.json({ success: true, card: bank_card });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};