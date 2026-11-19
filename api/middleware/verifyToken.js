const logger = console;
const jwt = require('jsonwebtoken');
const verifyToken = async(req,res,next) => {
	logger.error(`>>> Entering verifyToken(req=${req},res=${res},next=${next})`, { "event.action": "verifyToken" });
    const {token} = req.cookies;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,{},(err, user)=>{
            if(err) throw err;
            res.json(user);
        })
        
    }
    else{
        res.json(null);
    }
    next();
	logger.error(`<<< Exiting verifyToken(req=${req},res=${res},next=${next})`, { "event.action": "verifyToken" });
}
module.exports = verifyToken;