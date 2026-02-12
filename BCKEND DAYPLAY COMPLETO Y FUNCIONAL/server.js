import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// DB
import { connectDB } from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import cardRoutes from "./src/routes/cardRoutes.js";
import stripeWebhookRoutes from "./src/routes/stripe_webhook.js";
import { registerRoutes } from "./src/routes/generic_routes.js";
import deleteAccountRoutes from "./src/routes/delete_account.js";
import getRankingForPlanRoutes from './src/routes/get_ranking_for_plan.js';
import userRegistrationsRoutes from './src/routes/user_registration.js';
import storyRoutes from './src/routes/story_routes.js';

// Middlewares
import { authRequired } from "./src/middlewares/auth.middleware.js";
import { requireNotPending } from "./src/middlewares/status.middleware.js";
import { requireRole } from "./src/middlewares/role.middleware.js";
import { checkActivePlan } from "./src/middlewares/plan.middleware.js";
import { upload } from "./src/middlewares/upload.middleware.js";

// Models
import {
  Person,
  AppUser,
  Admin,
  UserPending,
  BankEntity,
  BankCard,
  Game,
  GameWord,
  MathOperation,
  MathOption,
  GameMatch,
  DailyGameReward,
  Streak,
  Leaderboard,
  Payment,
  PaymentTrace,
  Notification,
  Story,
  Chapter,
  StoryAccess,
  SystemEvent,
  UserGame
} from "./src/models/index.js";

dotenv.config();

const app = express();

/* =====================================
   MIDDLEWARES BASE
===================================== */
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

/* =====================================
   RUTA RAÍZ
===================================== */
app.get("/", (req, res) => {
  res.send("🚀 DayPlay Backend funcionando");
});

/* =====================================
   AUTH Y ADMIN
===================================== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

/* =====================================
   RUTAS DE TARJETAS Y WEBHOOK
===================================== */
app.use("/api/cards", cardRoutes);
app.use("/api/stripe", stripeWebhookRoutes);

/* =====================================
   RUTAS GENÉRICAS CRUD
===================================== */
const apiRoutes = [
  registerRoutes("persons", Person),
  registerRoutes("users", AppUser),
  registerRoutes("admins", Admin),
  registerRoutes("user-pending", UserPending),
  registerRoutes("bank-entities", BankEntity),
  registerRoutes("bank-cards", BankCard),
  registerRoutes("games", Game),
  registerRoutes("game-words", GameWord),
  registerRoutes("math-operations", MathOperation),
  registerRoutes("math-options", MathOption),
  registerRoutes("game-matches", GameMatch),
  registerRoutes("daily-rewards", DailyGameReward),
  registerRoutes("streaks", Streak),
  registerRoutes("leaderboards", Leaderboard),
  registerRoutes("payments", Payment),
  registerRoutes("payment-traces", PaymentTrace),
  registerRoutes("notifications", Notification),
  registerRoutes("stories", Story),
  registerRoutes("chapters", Chapter),
  registerRoutes("story-access", StoryAccess),
  registerRoutes("system-events", SystemEvent),
  registerRoutes("user-games", UserGame)
];

/* =====================================
   PROTECCIÓN DE RUTAS DE GUARDADO
   Usuarios PENDING no pueden guardar
===================================== */
const protectedSaveRoutes = [
  "/api/game-matches",
  "/api/daily-rewards",
  "/api/streaks",
  "/api/leaderboards",
  "/api/user-games"
];

protectedSaveRoutes.forEach(route => {
  app.use(route, authRequired, requireNotPending);
});

/* =====================================
   🔒 NUEVO: RUTAS QUE REQUIEREN PLAN
   Si no tiene plan → no ve nada
===================================== */
const planProtectedRoutes = [
  "/api/games",
  "/api/game-words",
  "/api/math-operations",
  "/api/math-options",
  "/api/stories",
  "/api/chapters",
  "/api/story-access",
  "/api/user-games"
];

planProtectedRoutes.forEach(route => {
  app.use(
    route,
    authRequired,
    requireNotPending,
    checkActivePlan
  );
});

/* =====================================
   MONTAJE FINAL DE RUTAS CRUD
===================================== */
apiRoutes.forEach(r => app.use(r.path, r.router));

/* =====================================
   ELIMINAR CUENTA
===================================== */
app.use("/api/deleteAccount", deleteAccountRoutes);

/* =====================================
   OBTENER RANKING
===================================== */
app.use("/api/getRankingForPlan", getRankingForPlanRoutes);

/* =====================================
   REGISTRO DE USUARIOS
===================================== */
app.use("/api/userRegistration", userRegistrationsRoutes);

/* =====================================
   HISTORIAS Y CAPÍTULOS
===================================== */
app.use("/api/story", storyRoutes);

/* =====================================
   ARRANQUE SERVIDOR
===================================== */
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en puerto ${PORT}`);
  });
};

startServer();
