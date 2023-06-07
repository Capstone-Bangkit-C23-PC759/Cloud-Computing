const profile = require("../models/profiles.model")
const Boom = require('@hapi/boom');

module.exports={
    update:function(request,h){
        // validate  user data before signup
        const payload = request.payload;
        const validate = profile.schema.validate(payload)
        if(validate.error) 
            return Boom.badRequest(validate.error)
        const id = request.auth.credentials.id
        const d = validate.value

        const updateResult = profile.update(id,
            d.firstname || '',
            d.lastname || '' ,
            d.facebook || '',
            d.twitter || '',
            d.instagram || '',
            d.reddit || '')
        .then(result=>{
           return h.response({statusCode:201,message:"Profile Updated",data:{}}).code(201)
        })
        .catch(err=>{
            return Boom.internal("Cant connect to database")
        })
        return updateResult
    },
    read:function(request,h){
        const id = request.auth.credentials.id
        const readResult = profile.read(id)
        .then((result)=>{
            return h.response({statusCode:200,message:"",data:{profile:result.value}})
        }).catch((err)=>{
            if(err == "notSet")
                return h.response({statusCode:200,message:"Profile not set yet",data:{profile:[]}}).code(200)
            else
                return Boom.internal("Cant connect to database")
        })
        return readResult
    }
}