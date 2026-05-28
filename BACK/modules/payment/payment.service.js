const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { Payment, PaymentTrace } = require('../../models');
const { createEvent } = require('../../services/systemEvent.service');

async function chargeUser(userId, adminId, amount) {

    const payment = await Payment.create({
        userId,
        amount,
        paymentMethod: 'stripe',
        status: 'PENDING'
    });

    await createEvent({
        actorType: 'ADMIN',
        actorId: adminId,
        targetType: 'USER',
        targetId: userId,
        eventType: 'PAYMENT_CREATED',
        category: 'PAYMENT',
        description: `Pago de ${amount}€ creado`
    });

    await PaymentTrace.create({
        paymentId: payment.id,
        action: 'PAYMENT_CREATED',
        notes: 'PaymentIntent creation started',
        updatedBy: adminId
    });

    payment.status = 'PROCESSING';
    await payment.save();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        metadata: { paymentId: payment.id, userId }
    });

    payment.stripePaymentIntentId = paymentIntent.id;

    await payment.save();

    return { clientSecret: paymentIntent.client_secret, paymentId: payment.id };
}

module.exports = { chargeUser };