const registerHandler = require("../app/handlers/register.handler");

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/login',
        handler: (request, h) => {
            return 'Hello Login!';
        }
    },
    {
        method:'POST',
        path:'/register',
        handler:registerHandler,
        options: {
            payload: {
                maxBytes: 10485760,
                parse: true,
                output: 'stream',
                multipart: true
            },
        }
    }
]