import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

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

    // Debug: log token snippet (do not log full token in production)
    try {
      // eslint-disable-next-line no-console
      console.debug(`authMiddleware: token snippet=${token?.slice(0,12)}...`);
    } catch (e) {}

    const decoded = jwt.verify(token, config.jwtSecret);
    // Debug: log decoded payload (short)
    try {
      // eslint-disable-next-line no-console
      console.debug('authMiddleware: decoded payload keys=', Object.keys(decoded as any));
    } catch (e) {}

    req.userId = (decoded as any).userId;

    next();

  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
