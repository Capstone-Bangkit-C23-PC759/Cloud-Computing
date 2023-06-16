const predictionHandler = require("../app/handlers/prediction.handler")
module.exports=[
    {
        method: 'GET',
        path: '/predict/twitter',
        handler: predictionHandler.twitter,
    },
    {
        method:'GET',
        path:'/prediction/histories',
        handler:predictionHandler.readHistories,
    },
    {
        method:'GET',
        path:'/prediction/latest',
        handler:predictionHandler.readLatest,
    }
]