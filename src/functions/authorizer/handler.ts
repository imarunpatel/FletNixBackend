import { APIGatewayTokenAuthorizerEvent, Callback } from "aws-lambda";
import { verify } from "jsonwebtoken";


export const verifyAuth = (event: APIGatewayTokenAuthorizerEvent, context, callback: Callback) => {
    const token = event.authorizationToken.split(' ')[1];
    const methodArn = event.methodArn;

    if(!token && !methodArn) {
        return callback("Unauthorized")
    }

    try {
        const decoded: any = verify(token, process.env.ACCESS_TOKEN_SECRET)
        if(decoded && decoded.email) {
            return callback(
                null,
                generateAuthResponse(decoded.userId, decoded.age, "Allow", methodArn)
            )
        } else {
            return callback(
                null,
                generateAuthResponse(decoded.userId, decoded.age, "Deny", methodArn)
            );
        }
    } catch (e) {
        return callback("Unauthorized");
    }
}

function generateAuthResponse(userId, age, effect, methodArn) {
    const policyDocument = generatePolicyDocument(effect, methodArn);

    return {
        principalId: userId,
        policyDocument,
        context: {
            userId,
            age
        }
    };
}

function generatePolicyDocument(effect, methodArn) {
    if (!effect || !methodArn) return null;

    var policyDocument = {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: effect,
                Resource: methodArn,
            },
        ],
    };
    return policyDocument;
}