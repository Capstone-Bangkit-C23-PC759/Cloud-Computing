const Joi = require("joi")

module.exports = {
    schema : Joi.object({
        username : Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

        email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
        password: Joi.string()
        .min(8)
        .max(30)
        // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    }),
    signSchema:Joi.object({
        username : Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        password: Joi.string()
        .min(8)
        .max(30)
        // .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    }),
    create: async function(username,email,password){
        const sql = global.sqlPool.promise()

        const query = `INSERT INTO user (username,email,password)
        VALUES ('${username}','${email}','${password}') `
        try{
            const [rows,fields] = await sql.query(query)
            return {value:rows}
        }catch(err){
            if(err.code === "ER_DUP_ENTRY"){
                if(err.sqlMessage.includes("user.username"))
                    throw "usernameExist"
                else if (err.sqlMessage.includes("user.email")){
                    throw "emailExist"
                }
                else 
                    throw "unhandledDuplicate"
            }
            else{
                throw "connectionError"
            }
        }
    },
    readByUsername: async function(username){
        const sql = global.sqlPool.promise();
        const query = `SELECT  *  from user  where username ='${username}'`
        try{
            const [rows,fields] = await sql.query(query)
            if(rows.length === 1){
                const user = rows[0]
                return user
            }
            throw "notRegistered"
        }catch(err){
            if(err === "notRegistered") 
                throw err
            else
                throw "connectionError"
        }
    }
}