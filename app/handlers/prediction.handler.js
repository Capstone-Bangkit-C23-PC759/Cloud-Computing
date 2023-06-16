const Boom = require('@hapi/boom');
const predictionModel = require("../models/predictions.model")
module.exports ={
    twitter:function(request,h){
        const id = request.auth.credentials.id
        const params = request.query
        const username = params.username
        const predictionResult = predictionModel.twitter(username)
        .then((result)=>{
            const predictionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
            predictionModel.saveHistory(id,"Twitter",username,result.percentage,result.count,result.predLevel,predictionDate)
            return h.response({statusCode:200,message:"Prediction success",
            data:{prediction:result.prediction,percentage:result.percentage,level:result.predLevel,postCount:result.count}})
            .code(200)
        })
        .catch((err)=>{
            if(err === 'notFound')
                return Boom.badRequest(`Cant find any post from username ${username}`)
            else
            return Boom.internal("Something wrong")
        })
        return predictionResult
    },
    readHistories:function(request,h){
        const userId = request.auth.credentials.id
        const historiesResult = predictionModel.getHistories(userId).then((result)=>{
            return h.response({statusCode:200,message:"success",
            data:result
        })
            .code(200)
        }).catch((err)=>{
            return Boom.internal("Something wrong")
        })

        return historiesResult
    },
    readLatest:function(request,h){
        const userId = request.auth.credentials.id
        const historiesResult = predictionModel.getLatest(userId).then((result)=>{
            return h.response({statusCode:200,message:"success",
            data:result[0]
        })
            .code(200)
        }).catch((err)=>{
            return Boom.internal("Something wrong")
        })

        return historiesResult
    }

}