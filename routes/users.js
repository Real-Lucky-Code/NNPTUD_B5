var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET ALL USERS
router.get('/', async function(req,res){
    let data = await userModel.find({
        isDeleted:false
    }).populate("role","name");

    res.send(data);
})

// CREATE USER
router.post('/', async function(req,res){
    let newUser = new userModel({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        fullName:req.body.fullName,
        avatarUrl:req.body.avatarUrl,
        role:req.body.role
    })

    await newUser.save()
    res.send(newUser)
})

// ENABLE USER
router.post('/enable', async function(req,res){

    let user = await userModel.findOne({
        email:req.body.email,
        username:req.body.username
    })

    if(user){
        user.status = true
        await user.save()
        res.send(user)
    }else{
        res.status(404).send({
            message:"USER NOT FOUND"
        })
    }
})

// DISABLE USER
router.post('/disable', async function(req,res){

    let user = await userModel.findOne({
        email:req.body.email,
        username:req.body.username
    })

    if(user){
        user.status = false
        await user.save()
        res.send(user)
    }else{
        res.status(404).send({
            message:"USER NOT FOUND"
        })
    }
})

// GET USER BY ID
router.get('/:id', async function(req,res){
    try{
        let result = await userModel.find({
            _id:req.params.id,
            isDeleted:false
        }).populate("role","name");

        if(result.length){
            res.send(result[0])
        }else{
            res.status(404).send({message:"ID NOT FOUND"})
        }
    }catch(err){
        res.status(404).send({message:err.message})
    }
})

// UPDATE USER
router.put('/:id', async function(req,res){
    try{
        let result = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )
        res.send(result)
    }catch(err){
        res.status(404).send({message:err.message})
    }
})

// SOFT DELETE USER
router.delete('/:id', async function(req,res){
    try{
        let result = await userModel.findOne({
            _id:req.params.id,
            isDeleted:false
        })

        if(result){
            result.isDeleted=true
            await result.save()
            res.send(result)
        }else{
            res.status(404).send({message:"ID NOT FOUND"})
        }

    }catch(err){
        res.status(404).send({message:err.message})
    }
})

module.exports = router;