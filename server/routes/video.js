const express = require('express');
const router = express.Router();
//const { User } = require("../models/User");
const multer = require("multer");
const { auth } = require("../middleware/auth");
var ffmpeg = require("fluent-ffmpeg");
const {Video} = require("../models/Video");
const {Subscriber} = require("../models/Subscriber");

//=================================
//             Video
//=================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype == 'video/mp4') {
        cb(null, true);
    } else {
        cb({ msg: 'mp4 파일만 업로드 가능합니다.' }, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter }).single("file");

router.post('/uploads', (req, res) => {
    //비디오를 서버에 저장한다.
    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename });
    })
})

router.post('/uploadVideo', (req, res) => {
    //비디오를 서버에 저장한다.
    const video = new Video(req.body)

    video.save((err, doc) => {
        if(err) return res.json({success: false, err})
        res.status(200).json({success: true})
    })
})

router.post('/thumbnail', (req, res) => {
    //썸네일을 생성하고 비디오 러닝타임도 가져오기

    let filepath = '';
    let fileDuration = '';
    //비디오정보 가져오기
    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration
    })

    //썸네일 생성
    ffmpeg(req.body.filePath)
    .on('filenames', function(filenames){
        console.log('Will generate '+ filenames.join(', '))
        console.log(filenames);

        filepath = "uploads/thumbnails/"+ filenames[0];
    })
    .on('end', function(){
        console.log('Screenshots taken');
        return res.json({success: true, filePath: filepath, fileDuration: fileDuration});
    })
    .on('error', function(err){
        console.error(err);
        return res.json({success: false, err});
    })
    .screenshots({
        count: 3,
        folder: 'uploads/thumbnails',
        size:'320x240',
        filename:'thumbnail-%b.png'
    })
})

router.get('/getVideos', (req, res) => {
    //비디오를 DB에서 가져와서 클라이언트에 보낸다.
    Video.find().populate('writer').exec((err, videos) => {
        if(err) return res.status(400).send(err);
        res.status(200).json({success: true, videos});
    })
})

router.post('/getVideoDetail', (req, res) => {
    Video.findOne({"_id" : req.body.videoId}).populate('writer').exec((err, videoDetail)=>{
        if(err){
            return res.status(400).send(err)
        }
         return res.status(200).json({success: true, videoDetail});
    })
})

router.post('/getSubscriptionVideos', (req, res) => {
    Subscriber.find({userFrom: req.body.userFrom}).exec((err, subscriberInfo) => {
        if(err) return res.status(400).send(err);
        
        let subsUser = [];
        subscriberInfo.map((subscriber, i) => {
            subsUser.push(subscriber.userTo);
        })

        Video.find({writer: {$in: subsUser}}).populate('writer').exec((err, videoDetail)=>{
            if(err) res.status(400).send(err);
            return res.status(200).json({success: true, videoDetail});
        })
    })
})

module.exports = router;
