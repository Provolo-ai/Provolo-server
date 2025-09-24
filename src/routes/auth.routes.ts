import { Router } from "express";
import type { Router as ExpressRouter } from "express";

const authRouter: ExpressRouter = Router();

// Dummy login route
authRouter.post("/login", (req, res) => {
  res.json({ message: "Login successful (dummy)" });
});

// Dummy signup route
authRouter.post("/signup", (req, res) => {
  res.json({ message: "Signup successful (dummy)" });
});

// Dummy signout route
authRouter.post("/signout", (req, res) => {
  res.json({ message: "Signout successful (dummy)" });
});

export default authRouter;
