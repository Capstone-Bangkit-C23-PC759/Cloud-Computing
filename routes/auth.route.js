const authHandler = require("../app/handlers/auth.handler");

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello Login!';
        }
    },
    {
        method: 'GET',
        path: '/test-sign',
        handler: (request, h) => {
            return 'Hello yur allowed';
        },
        options:{
            auth:'jwt'
        }
    },
    {
        method:'POST',
        path:'/signup',
        handler:authHandler.signup,
        options: {
            auth:false,
            payload: {
                maxBytes: 10485760,
                parse: true,
                output: 'stream',
                multipart: true
            },
        }
    },
    {
        method: 'POST',
        path: '/sign',
        handler: authHandler.signin,
        options:{
            auth:false,
            payload: {
                maxBytes: 10485760,
                parse: true,
                output: 'stream',
                multipart: true
            },
        }
    },
]