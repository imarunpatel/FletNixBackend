import mongoose, { Document, Schema } from "mongoose";
import { hash, genSalt } from 'bcryptjs';

export interface UserModel extends Document {
    email: string
    password: string
    age: number
    createdOn: Date
    getPublicFacingDetails(): {_id: string,  email: string, age: number, createdOn: string}
}

const UserSchema = new Schema<UserModel>({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now(),
    }
})


UserSchema.pre('save', async function (next) {
    this.password = await hash(this.password, 10);

    if(this.isModified('password') || this.isNew) {
        genSalt(10, function(saltError, salt) {
            if(saltError) {
                throw saltError
            } else {
                hash(this.password, salt, function (hashError, hash) {
                    if(hashError) {
                        return next(hashError);
                    }
                    this.password = hash
                    next()
                })
            }
        })
    } else {
        next()
    }
})

UserSchema.methods.getPublicFacingDetails = function () {
    return { _id: this._id.toString(), name: this.name, email: this.email, phone: this.phone, avatar: this.avatar, createdOn: this.createdOn }
}

export const UserModel = mongoose.model('users', UserSchema)