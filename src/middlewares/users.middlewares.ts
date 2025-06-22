import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validation } from '~/utils/validation'

export const loginValidator = validation(
    checkSchema(
        {
            email: {
                in: ['body'],
                isEmail: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
                },
                trim: true,
                escape: true,
                custom: {
                    options: async (value, { req }) => {
                        const user = await databaseService.users.findOne({
                            email: value,
                            password: hashPassword(req.body.password)
                        })
                        if (user === null) {
                            throw new Error(USER_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
                        }

                        req.user = user
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
                isString: { errorMessage: USER_MESSAGES.PASSWORD_IS_BE_A_STRING }
            }
        },
        ['body']
    )
)

export const registerValidator = validation(
    checkSchema(
        {
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
        },
        ['body']
    )
)

export const accessTokenValidator = validation(
    checkSchema(
        {
            Authorization: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (value: string, { req }) => {
                        const accessToken = value.split(' ')[1]
                        if (!accessToken) {
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.ACCESS_TOKEN_IS_INVALID,
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        }
                        try {
                            const decoded_authorization = await verifyToken({ token: accessToken })
                            req.decoded_authorization = decoded_authorization
                        } catch (error) {
                            throw new ErrorWithStatus({
                                message: capitalize((error as JsonWebTokenError).message),
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        }
                        return true
                    }
                }
            }
        },
        ['headers']
    )
)

export const refreshTokenValidator = validation(
    checkSchema(
        {
            refresh_token: {
                in: ['body'],
                notEmpty: {
                    errorMessage: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (value: string, { req }) => {
                        try {
                            const [decoded_refresh_token, refresh_token] = await Promise.all([
                                verifyToken({ token: value }),
                                databaseService.refreshToken.findOne({ token: value })
                            ])

                            if (refresh_token === null) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.USER_REFRESH_TOKEN_OR_NOT_EXISTS,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }

                            req.decoded_refresh_token = decoded_refresh_token
                        } catch (error) {
                            if (error instanceof JsonWebTokenError) {
                                throw new ErrorWithStatus({
                                    message: capitalize(error.message),
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }
                            throw error
                        }

                        return true
                    }
                }
            }
        },
        ['body']
    )
)
