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
    }
]