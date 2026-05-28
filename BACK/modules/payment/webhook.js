/*
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Payment = require('../../models/payment');
const AppUser = require('../../models/appUser');
const Person = require('../../models/person');
const PaymentTrace = require('../../models/paymentTrace');
const SystemEvent = require('../../models/systemEvent');

async function stripeWebhook(req, res) {

    const sig = req.headers['stripe-signature'];

    let event;

    try {

        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);

    } catch (err) {

        console.error(err.message);

        return res.status(400).send(`Webhook Error: ${err.message}`);

    }

    try {

        if (event.type === 'payment_intent.succeeded') {

            const intent = event.data.object;

            const paymentId = intent.metadata.paymentId;

            const payment = await Payment.findByPk(paymentId);

            if (payment) {
                if (payment.status !== 'CONFIRMED') {
                    payment.status = 'CONFIRMED';
                    payment.confirmedAt = new Date();
                    await payment.save();
                }

                const user = await AppUser.findByPk(payment.userId);

                if (user) {
                    user.subscriptionStatus = 'ACTIVE';
                    await user.save();
                }

                await PaymentTrace.create({
                    paymentId,
                    action: 'PAYMENT_CONFIRMED',
                    notes: 'Webhook confirmed payment',
                    updatedBy: null
                });

                await SystemEvent.create({
                    actorType: 'SYSTEM',
                    actorId: null,
                    targetType: 'PAYMENT',
                    targetId: payment.id,
                    eventType: 'PAYMENT_SUCCESS',
                    category: 'PAYMENT',
                    description: `Pago ${payment.id} confirmado correctamente`
                });
            } else {
                return res.json({ received: true });
            }
        }

        if (event.type === 'payment_intent.payment_failed') {

            const intent = event.data.object;

            const paymentId = intent.metadata.paymentId;

            const payment = await Payment.findByPk(paymentId);

            if (payment) {
                if (payment.status !== 'FAILED') {
                    payment.status = 'FAILED';
                }

                payment.failureReason = intent.last_payment_error?.message || 'Payment failed';

                await payment.save();

                await PaymentTrace.create({
                    paymentId,
                    action: 'PAYMENT_FAILED',
                    notes: intent.last_payment_error?.message || 'Payment failed',
                    updatedBy: null
                });

                await SystemEvent.create({
                    actorType: 'SYSTEM',
                    actorId: null,

                    targetType: 'PAYMENT',
                    targetId: payment.id,

                    eventType: 'PAYMENT_FAILED',

                    category: 'PAYMENT',

                    description: `Pago ${payment.id} erróneo`
                });
            }
        }

        res.json({ received: true });

    } catch (error) {
        console.error(error);
        res.status(500).send('Webhook error');
    }
}

module.exports = stripeWebhook;
*/