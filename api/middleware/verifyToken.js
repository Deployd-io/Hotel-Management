const logger = console;
const jwt = require('jsonwebtoken');
const verifyToken = async(req,res,next) => {
	logger.debug(`>>> Entering verifyToken(req=${req},res=${res},next=${next})`);
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
	logger.debug(`<<< Exiting verifyToken(req=${req},res=${res},next=${next})`);
}
module.exports = verifyToken;
