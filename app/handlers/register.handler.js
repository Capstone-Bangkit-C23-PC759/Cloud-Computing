const Boom = require('@hapi/boom');
const user = require('../models/users.model')

module.exports = function(request,h){
    const payload = request.payload;

    const validate = user.schema.validate(payload)
    if(validate.error) 
    return Boom.badRequest(validate.error)

    const createUser= user.create(
        validate.value.username,
        validate.value.email,
        validate.value.password)
        .then(result=>{
            return h.response({statusCode:201,message:"Registration success"}).code(201)
        })
        .catch(err=>{
            console.log(err)
            if(err === "usernameExist")
                return Boom.badRequest("Username already use")
            else if(err === "emailExist")
                return Boom.badRequest("Email already registered")
            else 
                return Boom.internal("Connection to database failed")
        })

    return createUser;
}