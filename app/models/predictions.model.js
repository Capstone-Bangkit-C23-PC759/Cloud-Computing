const Joi = require("joi")
const axios = require("axios")
const padSequence = require("../utils/padSequence")
  const { Tokenizer } = require("tf_node_tokenizer");
const { toInteger } = require("lodash");
  const tokenizer = new Tokenizer({ num_words: 15000, oov_token: "<OOV>" });
module.exports = {
    twitter:async function(username){
        try{
            const userPost = await axios.get(`${process.env.SCRAPER_URL}/twitter/tweets?username=${username}&count=100`)
            if(userPost.data.length > 0){
                tokenizer.fitOnTexts(userPost.data);
                sequenceText = tokenizer.textsToSequences(userPost.data);
                padText = padSequence(sequenceText,150)
                const userPrediction =  await axios.post(process.env.PREDICTION_URL
                ,{"instances":padText }
                ,{headers:{'Authorization': process.env.PREDICTION_TOKEN}})
                const predArr= userPrediction.data.predictions.flat()
                const predTotal = predArr.reduce((total,curval)=>{
                    return total+curval
                })
                const predAvg = predTotal /  predArr.length
                const percentage = toInteger(predAvg*100)
                if(percentage)
                return {prediction:predAvg,percentage,count:predArr.length}
            }
            else throw 'notFound'
        }
        catch(err){
            console.log(err.response.error)
            throw err
        }
    }
}