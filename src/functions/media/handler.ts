import { formatJSONResponse } from "@libs/api-gateway";
import { connectDB } from "@libs/utils/MongoDBHandler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { MediaModel } from "src/models/mediaModel";


export const getMedia = async (event: APIGatewayProxyEvent) => {
    try {
        await connectDB();

        const age = event.requestContext.authorizer.age;
        const { page = "1", limit = "15", query, type } = event.queryStringParameters || {};

        let filter: any = {};

        // Search by title or cast
        if (query) {
            filter.$or = [
                { title: new RegExp(query.toLowerCase(), "i") },
                { cast: { $in: [new RegExp(query.toLowerCase(), "i")] } }
            ];
        }

        // Filter by type
        if (type) {
            filter.type = type;
        }

        // Restrict R-rated content for underage users
        if (age < 18) {
            filter.rating = { $ne: "R" };
        }

        const media = await MediaModel.find(filter)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        return formatJSONResponse(200, {
            code: 200,
            success: true,
            data: media
        });
    } catch (error) {
        return formatJSONResponse(400, {
            code: 400,
            success: false,
            data: error
        })
    }
}