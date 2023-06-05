const Boom = require('@hapi/boom');
const user = require('../models/users.model')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const createJwtToken = require("../utils/createJwtToken")

module.exports = {
    signup:function(request,h){
        // validate  user data before signup
        const payload = request.payload;
        const validate = user.schema.validate(payload)
        if(validate.error) 
        return Boom.badRequest(validate.error)

        // encrypt password
        const encPassword = bcrypt.hashSync(validate.value.password, salt);

        //  signup user to db
        const signupResult= user.create(
            validate.value.username,
            validate.value.email,
            encPassword)
            .then(result=>{
                return h.response({statusCode:201,message:"Registration success",data:{username:validate.username}}).code(201)
            })
            .catch(err=>{
                if(err === "usernameExist")
                    return Boom.badRequest("Username already use")
                else if(err === "emailExist")
                    return Boom.badRequest("Email already registered")
                else 
                    return Boom.internal("Connection to database failed")
            })
        return signupResult;

    },
    signin:function(request,h){
        const payload = request.payload
        const validate = user.signSchema.validate(payload)
        // sign result
       const signResult = user.readByUsername(validate.value.username).then(result=>{
            const user = result;
            const hashPass = user.password
            const passFromPayload = request.payload.password
            const isValid =  bcrypt.compareSync(passFromPayload,hashPass)

            if(isValid){
                const userInfo ={
                    id:user.id,
                    username:user.username,
                    email:user.email,
                    emailVerify:user.email_verify}
                const token = createJwtToken(userInfo)
                return h.response({statusCode:200,message:"Login success",data:{token,userInfo}}).code(200)
            }
            else
                throw "wrongPassword"
        }).catch(err=>{
            if(err === "notRegistered")
                return Boom.notFound("Username not found")
            else if(err === "wrongPassword")
                return Boom.badRequest("Password didnt match")
            else
                return Boom.internal("Connection to database failed")
        })
        return signResult
    }
}
