import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./config/env";
import { apiLimiter } from "./middlewares/rateLimit";
import { notFoundHandler, errorHandler } from "./middlewares/error";

import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import employeeRoutes from "./routes/employee.routes";
import categoryRoutes from "./routes/category.routes";
import serviceRoutes from "./routes/service.routes";
import clientRoutes from "./routes/client.routes";
import appointmentRoutes from "./routes/appointment.routes";
import ticketRoutes from "./routes/ticket.routes";
import publicRoutes from "./routes/public.routes";
import cashRegisterRoutes from "./routes/cashRegister.routes";
import waitlistRoutes from "./routes/waitlist.routes";
import expenseRoutes from "./routes/expense.routes";

const app = express();

/* Middlewares */

app.use(helmet());

const corsOptions: cors.CorsOptions = {
  origin:
    env.ALLOWED_ORIGINS.length > 0
      ? (origin, callback) => {
          // Requêtes sans Origin (curl, apps mobiles, health checks) autorisées.
          if (!origin || env.ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
          }

          return callback(new Error("Origin non autorisée par CORS"));
        }
      : true,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", apiLimiter);

/* Routes */

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/cash-register", cashRegisterRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/expenses", expenseRoutes);

/* Test Route */

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "ANFEL K API Running",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
