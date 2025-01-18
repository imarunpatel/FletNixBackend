import { formatJSONResponse } from "@libs/api-gateway"

export const healthCheck = async () => {
    return formatJSONResponse(200, {
        code: 200,
        success: true,
        data: {
            health: 'Ok',
            version: '1.0.0'
        }
    })
}