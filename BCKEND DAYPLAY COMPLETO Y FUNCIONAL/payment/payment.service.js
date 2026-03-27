// payment.service.js
module.exports = function(stripeKey) {
    const Stripe = require('stripe');
    const stripe = new Stripe(stripeKey);

    const Payment = require('../models/payment');
    const BankCard = require('../models/bankCard');
    const PaymentTrace = require('../models/paymentTrace');

    async function chargeUser(userId, adminId, amount) {
        const card = await BankCard.findOne({
            where: { userId, isActive: true }
        });
        if (!card) throw new Error('User has no active bank card');
        if (card.approxBalance !== null && card.approxBalance < amount)
            throw new Error('Insufficient funds');

        const payment = await Payment.create({
            userId,
            amount,
            paymentMethod: card.brand || 'stripe',
            status: 'PENDING'
        });

        await PaymentTrace.create({
            paymentId: payment.id,
            action: 'PAYMENT_CREATED',
            notes: 'Payment created in pending state',
            updatedBy: adminId
        });

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100,
                currency: 'eur',
                payment_method: card.token,
                confirm: true
            });

            payment.status = 'CONFIRMED';
            payment.transactionId = paymentIntent.id;
            await payment.save();

            if (card.approxBalance !== null) {
                card.approxBalance -= amount;
                await card.save();
            }

            await PaymentTrace.create({
                paymentId: payment.id,
                action: 'PAYMENT_CONFIRMED',
                notes: 'Stripe confirmed payment',
                updatedBy: adminId
            });

            return paymentIntent;
        } catch (error) {
            payment.status = 'FAILED';
            await payment.save();
            await PaymentTrace.create({
                paymentId: payment.id,
                action: 'PAYMENT_FAILED',
                notes: error.message,
                updatedBy: adminId
            });
            throw error;
        }
    }

    return { chargeUser };
};