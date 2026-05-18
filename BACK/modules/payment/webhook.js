const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Payment = require('../../models/payment');
const AppUser = require('../../models/appUser');
const Person = require('../../models/person');
const PaymentTrace = require('../../models/paymentTrace');
const SystemEvent = require('../../models/systemEvent');

async function stripeWebhook(req, res) {

    const event = req.body;

    try {

        if (event.type === 'payment_intent.succeeded') {

            const intent = event.data.object;

            const paymentId = intent.metadata.paymentId;

            const payment = await Payment.findByPk(paymentId);

            if (payment) {
                payment.status = 'CONFIRMED';
                payment.transactionId = intent.id;
                await payment.save();

                const user = await AppUser.findByPk(payment.userId);

                if (user) {
                    const person = await Person.findByPk(user.personId);
                    person.active = true;
                    await person.save();
                }

                await PaymentTrace.create({
                    paymentId,
                    action: 'PAYMENT_CONFIRMED',
                    notes: 'Webhook confirmed payment',
                    updatedBy: null
                });

                await SystemEvent.create({
                    userId: payment.userId,
                    eventType: 'PAYMENT_SUCCESS',
                    description: `Pago ${payment.id} confirmado correctamente`,
                    category: 'PAYMENT'
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
                payment.status = 'FAILED';
                await payment.save();

                await PaymentTrace.create({
                    paymentId,
                    action: 'PAYMENT_FAILED',
                    notes: intent.last_payment_error?.message || 'Payment failed',
                    updatedBy: null
                });

                await SystemEvent.create({
                    userId: payment.userId,
                    eventType: 'PAYMENT_FAILED',
                    description: `Pago ${payment.id} fallido`,
                    category: 'PAYMENT'
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