const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthMiddleware {
    verifyToken(req, res, next) {
        // need to send token from the frontend
        const authHeader = req.headers.authorization;
        // console.log(authHeader)

        if(!authHeader) return res.status(401).json({success: false, message: "You are not logged in!"});

        const token = authHeader.split(" ")[1];

        try {
            const decode = jwt.verify(
                token,
                process.env.JWT_SECRET
            );
            req.user = decode;
            next();
        } catch (error) {
            res.status(403).json({success: false, message: "Token is invalid!"});
        }
    }
    // role based auth
    restrictTo(...roles){
        return (req, res, next)=>{
            if(!roles.includes(req.user.role)){
                return res.status(403).json({success: false, message: "You don't have permission to perform this action!"});
            }
            next();
        }
    }
    
}

module.exports = new AuthMiddleware();