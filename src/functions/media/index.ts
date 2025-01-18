import { handlerPath } from "@libs/handler-resolver";


export const getMedia = {
    handler: `${handlerPath(__dirname)}/handler.getMedia`,
    events: [
        {
            http: {
                method: 'get',
                path: '/media',
                authorizer: 'verifyAuth',
            }
        }
    ],

}