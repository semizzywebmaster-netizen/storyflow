
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { createError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.token

  if (!token) {
    return next(createError('Authentication required', 401))
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any
    req.user = decoded
    next()
  } catch (err) {
    return next(createError('Invalid or expired token', 401))
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(createError('Insufficient permissions', 403))
    }
    next()
  }
}
