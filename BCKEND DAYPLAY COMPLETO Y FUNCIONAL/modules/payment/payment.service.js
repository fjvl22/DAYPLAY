// payment.service.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Payment = require('../../models/payment');
const PaymentTrace = require('../../models/paymentTrace');

async function chargeUser(userId, adminId, amount) {

    const payment = await Payment.create({
        userId,
        amount,
        paymentMethod: 'stripe',
        status: 'PENDING'
    });

    await PaymentTrace.create({
        paymentId: payment.id,
        action: 'PAYMENT_CREATED',
        notes: 'PaymentIntent creation started',
        updatedBy: adminId
    });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        metadata: { paymentId: payment.id, userId }
    });

    return { clientSecret: paymentIntent.client_secret, paymentId: payment.id };
}

module.exports = { chargeUser };