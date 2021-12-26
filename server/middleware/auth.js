const {User} = require('../models/User');
let auth = (req, res, next) =>{
    //인증 처리를 하는 곳
    
    // client 쿠키에서 token을 가져온다.
    // token을 복호화 한 후 유저를 찾는다
    // 유저가 있으면 인증 성공, 없으면 실패
    let token = req.cookies.x_auth;
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth : false, error: true})

        req.token = token;
        req.user = user;
        next();
    })
}


module.exports = {auth};