import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import { registerRoutes } from "./routes/generic_routes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { authRequired } from "./middlewares/authMiddleware.js";
import { requireApprovedUser } from "./middlewares/require_approved_user.js";

// Modelos
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
} from "./models/index.js";

dotenv.config();

const app = express();

/* =====================================
   MIDDLEWARES BASE
===================================== */

app.use(express.json());

/* =====================================
   RUTAS PRINCIPALES
===================================== */

app.get("/", (req, res) => {
  res.send("🚀 DayPlay Backend funcionando");
});

/* ---------- AUTH Y ADMIN ---------- */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

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
   PROTECCIÓN:
   Usuarios PENDING no pueden GUARDAR progreso
===================================== */

const protectedSaveRoutes = [
  "/api/game-matches",
  "/api/daily-rewards",
  "/api/streaks",
  "/api/leaderboards",
  "/api/user-games"
];

// Primero comprobamos JWT
protectedSaveRoutes.forEach(route => {
  app.use(route, authRequired, requireApprovedUser);
});

/* =====================================
   MONTAJE FINAL DE RUTAS CRUD
===================================== */

apiRoutes.forEach(r => app.use(r.path, r.router));

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
