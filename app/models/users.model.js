const Joi = require("joi")
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

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
    create: async function(username,email,password){
        const sql = global.sqlPool.promise()
        // encrypt pass
       password = bcrypt.hashSync(password, salt);

        const query = `INSERT INTO user (username,email,password)
        VALUES ('${username}','${email}','${password}') `
        try{
            const [rows,fields] = await sql.query(query)
            return {value:rows}
        }catch(err){
            console.log(err)
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
    }
}