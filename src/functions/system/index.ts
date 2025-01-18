import { handlerPath } from "@libs/handler-resolver";

export const healthCheck = {
    handler: `${handlerPath(__dirname)}/handler.healthCheck`,
    events: [
        {
            http: {
                method: 'get',
                path: '/',
            }
        }
    ]
}