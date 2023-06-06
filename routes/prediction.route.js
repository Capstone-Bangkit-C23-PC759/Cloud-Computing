const predictionHandler = require("../app/handlers/prediction.handler")
module.exports=[
    {
        method: 'GET',
        path: '/predict/twitter',
        handler: predictionHandler.twitter,
    },
]