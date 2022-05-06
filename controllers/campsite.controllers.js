const Camp = require("../models/campsite")

const campController = {};
campController.getCampList = async (req, res) => {
    try {
        const camplist = await Camp.find();
        return res.status(200).send({camplist:camplist, messages:"success"})        
    } catch (error) {
       return res.status(400).send(error)
    }
}

campController.postCamp = async (req, res) => {
    let {title, address, description, images} = req.body;
    try {
        let camp = await Camp.create({
            title,
            description,
            images,
            address,
            rating: "0"
        })
      return  res.status(201).send({data:{camp}, messages:"success"})
    } catch(e) {
       return res.status(400).send(e)
    }
}

campController.getCampById = async (req, res) => {
    const {id}= req.params;
    try {
        let camp = await Camp.findById(id)
        return res.status(200).send({camp:camp , messages: "success"})
    } catch (error) {
        return res.status(400).send(error)
    } 
}

module.exports = campController;
