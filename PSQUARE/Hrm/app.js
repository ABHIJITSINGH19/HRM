import express from "express";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./Controllers/errorController.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import candidateRoutes from "./Routes/candidateRoutes.js";
import employeeRoutes from "./Routes/employeeRoutes.js";
import attendanceRoutes from "./Routes/attendanceRoutes.js";
import leaveRoutes from "./Routes/leaveRoutes.js";

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>Mechanical-App Project BE</title></head>
      <body>
        <h1>Welcome to Mechanical-App Project</h1>
      </body>
    </html>
  `);
});

app.all("/*splat", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
