const express = require('express');
const router = express.Router();

router.post("/users", (req, res, next)=>{
    return res.status(200).send({data:{}, message:"post new campsite successful"})
})

module.exports = router;