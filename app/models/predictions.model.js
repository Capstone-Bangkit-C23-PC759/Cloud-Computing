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
    schema : Joi.object({
        userId:Joi.number().integer().required(),
        snsUsername:Joi.string().min(1).max(30).required(),
        snsName:Joi.string().min(3).max(30).required(),
        resultPercentage:Joi.number().integer().min(0).max(100).required(),
        resultActivitiesCount:Joi.number().integer().min(1).max(1000),
        predictionDate:Joi.date().required(),
    }),
    twitter:async function(snsUsername){
        try{
            const userPost = await axios.get(process.env.SCRAPER_URL+`/twitter/tweets?username=${snsUsername}&count=100`)
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
                const predLevel = percentage > 66 ? "High" : percentage > 33 ? "Medium" : "Low"  
                return {prediction:predAvg,percentage:percentage,predLevel,count:predArr.length}
            }
            else throw 'notFound'
        }
        catch(err){
            console.log(err)
            throw err
        }
    },
    saveHistory:async function(userId,snsName,snsUsername,resultPercentage,resultActivitiesCount,resultLevel,predictionDate){
        const sql = global.sqlPool.promise();
        const query = `INSERT INTO menhela.prediction (user_id,sns_name,sns_username,result_percentage,result_activities_count,result_level,prediction_date)
        VALUES (${userId},'${snsName}','${snsUsername}','${resultPercentage}','${resultActivitiesCount}','${resultLevel}','${predictionDate}');`
        try {
            const [rows,fields] = await sql.query(query)
            return rows
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    getHistories:async function(userId){
        const sql = global.sqlPool.promise();
        const query = `SELECT * from prediction where user_id='${userId}'`
        try {
            const [rows,fields] = await sql.query(query)
            return rows
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    getLatest:async function(userId){
        const sql = global.sqlPool.promise();
        const query = `SELECT * FROM prediction WHERE  user_id='${userId}' ORDER BY id DESC LIMIT 1`
        try {
            const [rows,fields] = await sql.query(query)
            return rows
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}