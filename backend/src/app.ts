import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const REQUEST_BODY_SIZE_LIMIT: string = "10kb";
const STATIC_FILE_DIR: string = "public";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: REQUEST_BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ limit: REQUEST_BODY_SIZE_LIMIT }));
app.use(express.static(STATIC_FILE_DIR));
app.use(cookieParser());

// routes declaration
import userRouter from "./routes/user.routes";
import menuRoute from "./routes/menu.routes";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/menu", menuRoute);

export { app };
