const Joi = require("joi")
const {JWT} = require('google-auth-library');
const axios = require("axios")
const padSequence = require("../utils/padSequence")
const { Tokenizer } = require("tf_node_tokenizer");
const { toInteger } = require("lodash");
const tokenizer = new Tokenizer({ num_words: 15000, oov_token: "<OOV>" });
const clientjwt = new JWT({
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY,
    scopes:['https://www.googleapis.com/auth/cloud-platform']
});
module.exports = {
    twitter:async function(username){
        try{
            const userPost = await axios.get(`https://sns-scraper-dot-menhela.as.r.appspot.com/twitter/tweets?username=${username}&count=100`)
            if(userPost.data.length > 0){
                tokenizer.fitOnTexts(userPost.data);
                sequenceText = tokenizer.textsToSequences(userPost.data);
                padText = padSequence(sequenceText,150)

                const userPrediction =await  clientjwt.request({
                    method:'POST',
                    url:process.env.PREDICTION_URL,
                    data:{"instances":padText },
                })
                const predArr = userPrediction.data.predictions.flat()
                const predTotal = predArr.reduce((total,curval)=>{
                    return total+curval
                })
                const predAvg = predTotal /  predArr.length
                const percentage = toInteger(predAvg*100)
                return {prediction:predAvg,percentage:percentage,count:predArr.length}
                // const userPrediction =  await axios.post(process.env.PREDICTION_URL
                // ,{"instances":padText }
                // ,{headers:{'Authorization': process.env.PREDICTION_TOKEN}})
                // const predArr= userPrediction.data.predictions.flat()
                // const predTotal = predArr.reduce((total,curval)=>{
                //     return total+curval
                // })
                // const predAvg = predTotal /  predArr.length
                // const percentage = toInteger(predAvg*100)
            }
            else throw 'notFound'
        }
        catch(err){
            throw err
        }
    }
}