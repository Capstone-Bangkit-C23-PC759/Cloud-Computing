const Boom = require('@hapi/boom');
const predictionModel = require("../models/predictions.model")
module.exports ={
    twitter:function(request,h){
        const params = request.query
        const username = params.username
        const predictionResult = predictionModel.twitter(username)
        .then((result)=>{
            return h.response({statusCode:200,message:"Prediction success",data:{prediction:result.prediction,percentage:result.percentage,postCount:result.count}}).code(200)
        })
        .catch((err)=>{
            if(err === 'notFound')
                return Boom.badRequest(`Cant find any post from username ${username}`)
            else
            return Boom.internal("Something wrong")
        })
        return predictionResult
    }
}