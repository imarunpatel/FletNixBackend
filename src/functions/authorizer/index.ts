import { handlerPath } from "@libs/handler-resolver";

export const verifyAuth = {
    handler: `${handlerPath(__dirname)}/handler.verifyAuth`,
}