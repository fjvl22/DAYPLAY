import UserPending from '../models/user_pending.js';
import AppUser from '../models/app_user.js';
import Person from '../models/person.js';
import BankCard from '../models/bank_card.js';
import Payment from '../models/payment.js';
import Plan from '../models/plan.js';
import Story from '../models/story.js';
import StoryAccess from '../models/story_access.js';
import sendEmail from '../services/email.service.js';
import Stripe from 'stripe';
import Tesseract from 'tesseract.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' });

const PLAN_PRICES = {
  FREE: 0,
  BASIC: 1000,
  PREMIUM: 1500
};

// 1️⃣ Lista usuarios pendientes
export const listPendingUsers = async (req, res) => {
  try {
    const pending = await UserPending.findAll();
    res.json(pending);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2️⃣ Aprobar usuario
export const approveUser = async (req, res) => {
  const { id } = req.params;
  const { planType } = req.body;
  try {
    const pending = await UserPending.findByPk(id);
    if (!pending) return res.status(404).json({ error: 'Pending user not found' });

    // Crear registro para la tabla de plan con plan traído de la petición
    const plan = Plan.create({
      planType: planType
    });

    // Crear usuario con el id del plan creado
    const user = await AppUser.create({
      personId: pending.personId,
      subscriptionDate: new Date(),
      planId: plan.id
    });

    await pending.destroy();

    const person = await Person.findByPk(user.personId);

    await sendEmail(
      person.email,
      '✅ Usuario aprobado',
      '',
      `<h2>¡Hola ${person.nickname}!</h2>
       <p>Tu cuenta ha sido aprobada 🎉<br>
       Ya puedes jugar, aunque algunas funciones estarán limitadas hasta que completes el pago.</p>
       <p>Cuando quieras, puedes añadir tu tarjeta y activar tu plan.</p>
       <a href="${process.env.FRONT_URL}/add-card" 
          style="padding:10px 15px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
       Añadir tarjeta</a>`
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3️⃣ Subir fotos de tarjeta
export const uploadCardPhotos = async (req, res) => {
  const { userId } = req.params;
  const files = req.files;

  if (!files || !files.cardFront || !files.cardBack) {
    return res.status(400).json({ error: 'Se requieren ambas fotos de la tarjeta' });
  }

  try {
    // OCR con Tesseract
    const frontText = await Tesseract.recognize(files.cardFront[0].buffer, 'eng');
    const backText = await Tesseract.recognize(files.cardBack[0].buffer, 'eng');

    // Extraemos datos simples: solo ejemplo, se puede mejorar con regex
    const cardNumberMatch = frontText.data.text.match(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/);
    const expiryMatch = frontText.data.text.match(/\b(\d{2})\/(\d{2,4})\b/);

    if (!cardNumberMatch || !expiryMatch) {
      return res.status(400).json({ error: 'No se pudieron extraer los datos de la tarjeta' });
    }

    const last4 = cardNumberMatch[0].slice(-4);
    const [month, year] = expiryMatch.slice(1, 3);

    const bankCard = await BankCard.create({
      token: `card_${Date.now()}`, // token temporal, para Stripe lo reemplazaremos
      last4,
      expiryMonth: parseInt(month),
      expiryYear: parseInt(year),
      userId: parseInt(userId)
    });

    res.json({ success: true, bankCard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Crear pago con Stripe
export const createStripePayment = async (req, res) => {
  const { userId } = req.params;
  const { planType } = req.body;

  if (!PLAN_PRICES[planType]) return res.status(400).json({ error: 'Plan inválido' });

  try {
    const user = await AppUser.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Crear sesión de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Alta usuario ${planType}` },
            unit_amount: PLAN_PRICES[planType]
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.FRONT_URL}/success`,
      cancel_url: `${process.env.FRONT_URL}/cancel`,
      metadata: { userId, planType }
    });

    // Guardar pago preliminar
    await Payment.create({
      userId: user.id,
      amount: PLAN_PRICES[planType] / 100, // euros
      paymentMethod: 'stripe',
      transactionId: session.id
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getPendingRequests(req, res){
  const story = await Story.findOne({ where: { active: 1 } });
  const requests = await StoryAccess.findAll({ where: { storyId: story.id, accessGranted: null } });
  res.json(requests);
}

export async function approveChapter(req, res){
  const { adminId, userId, storyId } = req.body;
  await StoryAccess.create({
    userId,
    storyId,
    grantedBy: adminId,
    accessGranted: 1
  });
  const person = await Person.findByPk(userId);
  await sendEmail(
    person.email,
    'Capítulo aprobado',
    'Ya puedes acceder al capítulo de hoy',
    `<a href="${process.env.FRONT_URL}/user/login">Ir al login</a>`
  );
  res.json({ message: 'Approved chapter' });
}

export async function rejectChapter(req, res){
  const { adminId, userId, storyId, notes } = req.body;
  await StoryAccess.create({
    userId,
    storyId,
    grantedBy: adminId,
    accessGranted: 0,
    notes
  });
  const person = await Person.findByPk(userId);
  await sendEmail(
    person.email,
    'Capítulo rechazado',
    'No puedes acceder al capítulo de hoy',
    `<a href="${process.env.FRONT_URL}/user/login">Ir al login</a>`
  );
  res.json({ message: 'Rejected chapter' });
}