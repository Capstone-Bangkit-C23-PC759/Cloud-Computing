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
    },
    // twitterv2:function(request,h){

    //     const endpointId = "YOUR_ENDPOINT_ID";
    //     const project = 'YOUR_PROJECT_ID';
    //     const location = 'YOUR_PROJECT_LOCATION';
    //     const {PredictionServiceClient} = require('@google-cloud/aiplatform');
    //     const clientOptions = {
    //         apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    //       };
    //       const predictionServiceClient = new PredictionServiceClient(clientOptions);

    //       const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
                
    // }
}