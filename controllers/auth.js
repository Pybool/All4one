const auth = require("../services/auth");

const createAccount = (async (req, res, next)=>{
    const result = await auth.createAccount(req);
    // return result;
    if(result){
        return res.status(201).json(result);
    }
    return res.status(400).json(result);
})

const signIn = (async (req, res, next)=>{
    const result = await auth.signIn(req);
    return result;
    // if(result?.token){
    //     return res.status(200).json(result);
    // }
    // return res.status(400).json(result);
})

module.exports = { createAccount, signIn }