import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import usersService from '~/services/users.services'
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
      notEmpty: {
        errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USER_MESSAGES.NAME_IS_BE_A_STRING
      },
      isLength: {
        options: { min: 1, max: 100 },
        errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
      },
      trim: true,
      escape: true
    },
    email: {
      in: ['body'],
      notEmpty: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      escape: true,
      custom: {
        options: async (value) => {
          const isExistsEmail = await usersService.checkEmailExist(value)
          if (isExistsEmail) {
            throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
          }
          return true
        }
      }
    },
    password: {
      in: ['body'],
      notEmpty: {
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USER_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      trim: true,
      escape: true,
      isString: { errorMessage: USER_MESSAGES.PASSWORD_IS_BE_A_STRING },
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
      }
    },
    confirm_password: {
      in: ['body'],
      notEmpty: { errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
      isLength: {
        options: { min: 6, max: 50 },
        errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
      },
      trim: true,
      escape: true,
      isString: { errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_BE_A_STRING },
      isStrongPassword: {
        options: { minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 },
        errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
          }
          return true
        }
      }
    },
    date_of_birth: {
      in: ['body'],
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
      }
    }
  })
)
