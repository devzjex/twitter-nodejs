import { ObjectId } from 'mongodb'

type RefreshTokenType = {
    _id?: ObjectId
    token: string
    user_id: ObjectId
    created_at?: Date
}

export default class RefreshTokenSchema {
    _id?: ObjectId
    token: string
    user_id: ObjectId
    created_at: Date

    constructor({ _id, token, user_id, created_at }: RefreshTokenType) {
        this._id = _id
        this.token = token
        this.user_id = user_id
        this.created_at = created_at || new Date()
    }
}
