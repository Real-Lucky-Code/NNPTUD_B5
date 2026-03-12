var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

// GET ALL ROLES
router.get('/', async function(req,res){
    let data = await roleModel.find();
    res.send(data);
})

// GET USERS BY ROLE
router.get('/:id/users', async function(req,res){

    let users = await userModel.find({
        role:req.params.id,
        isDeleted:false
    }).populate("role","name")

    res.send(users)
})

// GET ROLE BY ID
router.get('/:id', async function(req,res){
    try{
        let result = await roleModel.findById(req.params.id);
        if(result){
            res.send(result)
        }else{
            res.status(404).send({message:"ID NOT FOUND"})
        }
    }catch(err){
        res.status(404).send({message:err.message})
    }
})

// CREATE ROLE
router.post('/', async function(req,res){
    let newRole = new roleModel({
        name:req.body.name,
        description:req.body.description
    })

    await newRole.save()
    res.send(newRole)
})

// UPDATE ROLE
router.put('/:id', async function(req,res){
    try{
        let result = await roleModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.send(result)
    }catch(err){
        res.status(404).send({message:err.message})
    }
})

// DELETE ROLE
router.delete('/:id', async function(req,res){
    try{
        let result = await roleModel.findByIdAndDelete(req.params.id)
        res.send(result)
    }catch(err){
        res.status(404).send({message:err.message})
    }
})

module.exports = router;