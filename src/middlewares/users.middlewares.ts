import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validation } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' })
    return
  }
  next()
}

export const registerValidator = validation(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 3, max: 100 },
        errorMessage: 'Name must be at least 3 characters long'
      },
      trim: true,
      escape: true
    },
    email: {
      in: ['body'],
      notEmpty: true,
      isEmail: true,
      errorMessage: 'Invalid email format',
      trim: true,
      escape: true
    },
    password: {
      in: ['body'],
      notEmpty: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: 'Password must be at least 6 characters long'
      },
      trim: true,
      escape: true,
      isString: true,
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: 'Password must be strong'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.confirm_password) {
            throw new Error('Password confirm does not match password')
          }
          return true
        }
      }
    },
    confirm_password: {
      in: ['body'],
      notEmpty: true,
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: 'Password must be at least 6 characters long'
      },
      trim: true,
      escape: true,
      isString: true,
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: 'Password must be strong'
      }
    },
    date_of_birth: {
      in: ['body'],
      isISO8601: {
        options: { strict: true, strictSeparator: true }
      }
    }
  })
)
