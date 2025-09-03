const jwt=require('jsonwebtoken')

const verifyAccessToken=(req,res,next)=>{
    try{
        const accessToken=req.cookies?.accessToken;
        if(!accessToken) { return res.status(401).json({ message:"Unauthorized" }) }
        
        jwt.verify(accessToken,process.env.ACCESS_TOKEN_PRIVATE_KEY,{},(err,decoded)=>{
            if(err) {
            return res.status(401).json({
                message:"Invalid credentials"
            })}
            req.user=decoded;
            next();
        })

    }catch(err){
        res.status(401).json({
            message:"Unauthorized"
        })
    }
}

module.exports = { verifyAccessToken }