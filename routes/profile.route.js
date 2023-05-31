const profileHandler = require('../app/handlers/profile.handler')
module.exports =[
    {
        method: 'POST',
        path: '/profile',
        handler: profileHandler.update,
        options: {
            auth:'jwt',
            payload: {
                maxBytes: 10485760,
                parse: true,
                output: 'stream',
                multipart: true
            },
        }
    },
    {
        method: 'GET',
        path: '/profile',
        handler: profileHandler.read,
        options: {
            auth:'jwt',
        }
    },
    
]