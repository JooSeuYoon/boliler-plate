const express = require('express');
const router = express.Router();
//const { User } = require("../models/User");
const {Subscriber} = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

router.post("/subscribeNumber", (req, res) => {
    Subscriber.find({'userTo': req.body.userTo}).exec((err, subscribe)=>{
        if(err) return res.status(400).send(err);
        return res.status(200).json({success: true, subscribeNumber: subscribe.length});
    })
})

router.post("/subscribed", (req,res)=>{
    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribed)=>{
        if(err) return res.status(400).send(err);
        let result = false;
        if(subscribed.length != 0){
            result = true;
        }
        res.status(200).json({success: true, subscribed: result});
    })
})

router.post("/subscribing", (req, res) => {
    let subscribed = !(req.body.subscribed);
    if(req.body.subscribed){
        //구독 중인 상태 -> 구독 해제
        Subscriber.findOneAndDelete({userTo: req.body.userTo, userFrom: req.body.userFrom}, function(err, obj){
            if(err) return res.status(400).send(err);
            res.status(200).json({success: true, obj});
        })  
    }else{
        //구독 중이지 않은 상태 -> 구독 추가
        const subs = new Subscriber({userTo: req.body.userTo, userFrom: req.body.userFrom});
        subs.save((err, obj) =>{
            if(err) return res.json({success: false}, err);
            res.status(200).json({success: true, obj});
        })
    }
})


module.exports = router;
