import jwt from "jsonwebtoken"


const authMiddleware = async (req,res,next) => {
    const {token} = req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authoriged Login again"})
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            req.body = {};
        }//this if statement is with ai
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

export default authMiddleware;