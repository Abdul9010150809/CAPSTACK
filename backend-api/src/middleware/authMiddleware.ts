import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request & { userId?: string }, res: Response, next: NextFunction) => {
  try {
    // ⚠️ Allow preflight requests to pass (very important)
    if (req.method === "OPTIONS") {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (decoded as any).id;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
