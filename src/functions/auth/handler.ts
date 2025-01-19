import { formatJSONResponse } from "@libs/api-gateway"
import { APIGatewayProxyEvent, Context } from "aws-lambda"
import { compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { connectDB } from "@libs/utils/MongoDBHandler";
import { UserModel } from "src/models/userModel";

interface RegisterUserRequest {
    email: string
    age: string
    password: string
}

export const registerUser = async (event: APIGatewayProxyEvent) => {
    let user: RegisterUserRequest = JSON.parse(event.body);

    await connectDB()

    let existingUser = await UserModel.findOne({ email: user.email })

    if (existingUser) {
        return formatJSONResponse(400, {
            code: 400,
            success: false,
            error: 'User already exists',
        })
    }

    let newUser = new UserModel(user);
    await newUser.save();

    return formatJSONResponse(200, {
        code: 200,
        success: true,
        data: newUser.getPublicFacingDetails()
    })
}

export const login = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    let credentials: { email: string; password: string } = JSON.parse(event.body);

    if (!(credentials.email && credentials.password)) {
        return formatJSONResponse(400, {
            code: 400,
            success: false,
            error: 'All input is required'
        })
    }

    await connectDB();

    const user = await UserModel.findOne({ email: credentials.email });

    if (user && (await compare(credentials.password, user.password))) {
        let date = new Date();
        const accessToken = jwt.sign(
            { user_id: user._id, email: credentials.email, age: user.age },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '7h'
            }
        );
        return formatJSONResponse(200, {
            code: 200,
            success: true,
            data: {
                accessToken,
                expiresAt: date.setHours(date.getHours() + 7),
                user: user.getPublicFacingDetails()
            }
        })
    } else {
        return formatJSONResponse(400, {
            code: 400,
            success: false,
            error: 'Bad credentials'
        })
    }
}


export const getSelf = async (event: APIGatewayProxyEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false

    if (!event.headers['Authorization']) {
        return UnAuthorizedResponse()
    }

    let token = event.headers['Authorization'].replace("Bearer ", "")
    if (!token) return UnAuthorizedResponse()


    try {
        await connectDB()
        const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        let user = await UserModel.findById(decoded.user_id);

        return formatJSONResponse(200, {
            code: 200,
            success: true,
            data: user.getPublicFacingDetails()
        })


    } catch (e) {
        return formatJSONResponse(401, {
            code: 401,
            success: false,
            error: 'Unauthorized to access.'
        })
    }
}


export const UnAuthorizedResponse = () => {
    return formatJSONResponse(401, {
        code: 401,
        success: false,
        error: 'Unauthorized to access.'
    })
}