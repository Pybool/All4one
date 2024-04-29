const AccomodationService = require("../services/accomodation.service");

const createAccomodation = (async (req, res, next)=>{
    const result = await AccomodationService.createAccomodation(req);
    if(result?.status){
        return res.status(200).json(result);
    }
    return res.status(400).json(result);
})

const getAccomodations = (async (req, res, next)=>{
    const result = await AccomodationService.getAccomodations();
    if(result?.status){
        return res.status(result?.code).json(result);
    }
    return res.status(result?.code).json(result);
})

module.exports = { createAccomodation, getAccomodations }