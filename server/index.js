const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const {User} = require("./models/User");
const cookieParser = require('cookie-parser');
const {auth} = require("./middleware/auth");

const config = require('./config/key')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/jason
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!!! You can do it')
})

 app.get('/api/hello', (req, res) => {


   res.send("안녕하세요~")
 })

app.post('/api/users/register', (req, res) =>{
  //회원 가입 정보 client에서 가져오면 DB에 넣는다

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.post('/api/users/loginn', (req, res) =>{
  //요청된 이메일을 DB에 있는지
  console.log(`login page`)
  User.findOne({email : req.body.email},(err, user)=>{
    console.log('user',user)
    if(!user){
      console.log(`email false`)
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  
    //있다면 비밀번호가 맞는지아닌지
    //비밀번호도 맞다면 토큰 생성
    console.log(`외않됨`)
    user.comparePassword(req.body.password, (err, isMatch)=>{
      console.log(`password compare`)
      if(!isMatch)
        return res.json({loginSuccess : false, message: "비밀번호가 틀렸습니다."})

      user.generateToken((err,user)=>{
        if(err) return res.status(400).send(err);

        //토큰을 저장한다. 쿠키, 로컬스토리지 등등 다양하게 할 수 있음
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id} )

      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res)=>{
  //여기까지 미들웨어를 통과해 왔다는 얘기는, Authentication이 true라는 이야기
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image:req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res)=>{
  User.findOneAndUpdate({_id: req.user._id}, {token: ""}, (err, user) =>{
      if(err) return res.json({success : false, err});
      return res.status(200).send({
        success: true
      })
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})