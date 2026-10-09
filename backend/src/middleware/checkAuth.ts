import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";
import config from "../config/config";
import { jwtUtils } from "../utils/jwt";

export interface requestUser {
  email: string;
  name: string;
  userId: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: requestUser;
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) =>
  catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError(401, "You are not logged in. Please log in to access this resource.");
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
    if (!verifiedToken.success) {
      throw new AppError(401, verifiedToken.error);
    }

    const { email, name, userId, role } = verifiedToken.data as JwtPayload;
    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(403, "Forbidden access");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(401, "User not found. Please log in again.");
    }
    if (user.userStatus === "BLOCKED") {
      throw new AppError(403, "Your account has been blocked. Please contact support.");
    }
    if (user.userStatus === "DELETED") {
      throw new AppError(403, "Your account has been deleted. Please contact support.");
    }

    req.user = { email, name, userId, role };
    next();
  });
