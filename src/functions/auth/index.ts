import { handlerPath } from "@libs/handler-resolver"

const RegisterUserForm = {
    type: 'object',
    properties: {
        email: {type: 'string'},
        password: {type: 'string'},
        age: {type: 'number'}
    },
    required: ['email', 'password', 'age']
}

export const registerUser = {
    handler: `${handlerPath(__dirname)}/handler.registerUser`,
    events: [
        {
            http: {
                method: 'post',
                path: '/register',
                request: {
                    schemas: {
                        'application/json': RegisterUserForm
                    }
                }
            }
        }
    ]
}

const LoginSchema = {
    type: "object",
    properties: {
        email: { type: 'string' },
        password: { type: 'string' },
    },
    required: ['email', 'password']
}
export const login = {
    handler: `${handlerPath(__dirname)}/handler.login`,
    events: [
        {
            http: {
                method: 'post',
                path: '/login',
                request: {
                    schemas: {
                        'application/json': LoginSchema
                    }
                }
            }
        }
    ]
}

export const accessToken = {
    handler: `${handlerPath(__dirname)}/handler.accessToken`,
    events: [
        {
            http: {
                method: 'get',
                path: '/accessToken',
            }
        }
    ]
}

export const getSelf = {
    handler: `${handlerPath(__dirname)}/handler.getSelf`,
    events: [
        {
            http: {
                method: 'get',
                path: '/self',
            }
        }
    ]
}