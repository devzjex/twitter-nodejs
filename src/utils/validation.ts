import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

export const validation = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req)
    const errors = validationResult(req)

    //Nếu mà không có lỗi thì next
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errors.mapped() })
  }
}
