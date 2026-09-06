
import { Request, Response, NextFunction } from 'express'
import { isProduction } from '../config'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  console.error(`[ERROR] ${req.method} ${req.path} - ${message}`, {
    stack: err.stack,
    statusCode,
  })

  res.status(statusCode).json({
    success: false,
    message: isProduction && statusCode === 500 ? 'Internal Server Error' : message,
    ...(isProduction ? {} : { stack: err.stack }),
  })
}

export const createError = (message: string, statusCode: number = 500): AppError => {
  const err: AppError = new Error(message)
  err.statusCode = statusCode
  err.isOperational = true
  return err
}
