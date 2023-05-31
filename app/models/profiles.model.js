const Joi = require("joi")
const { max } = require("lodash")

module.exports={
    schema : Joi.object({
        firstname:Joi.string().
        alphanum().
        min(1).
        max(30),

        lastname:Joi.string().
        alphanum().
        min(1).
        max(30),

        facebook:Joi.string().
        min(5).
        max(30),

        twitter:Joi.string().
        min(5).
        max(30),

        instagram:Joi.string().
        min(5).
        max(30),

        reddit :Joi.string().
        min(5).
        max(30),
    }),
    update:async function(id,firstname,lastname,facebook,twitter,instagram,reddit){
        const sql = global.sqlPool.promise();
        const checkQuery = `SELECT  *  from profile  where id='${id}'`
        const createQuery =`INSERT INTO profile (id,firstname,lastname,facebook,twitter,reddit,instagram)
        VALUES (${id},'${firstname}','${lastname}','${facebook}','${twitter}','${reddit}','${instagram}');`
        const updateQuery=`UPDATE profile
        SET firstname='${firstname}' ,lastname='${lastname}',facebook='${facebook}',twitter='${twitter}',
                instagram='${instagram}',reddit='${reddit}' 
        WHERE id=${id}`
        try {
            const [rows,fields] = await sql.query(checkQuery)
            if(rows.length === 1){
                const [rows,fields] = await sql.query(updateQuery)
                return {value:{rows}}
            }
            else{
                const [rows,fields] = await sql.query(createQuery)
                return {value:{rows}}
            }
        } catch (error) {
            console.log(error)
            throw "connectionError"
        }
    }
}