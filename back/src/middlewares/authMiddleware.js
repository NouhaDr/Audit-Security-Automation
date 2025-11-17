const { User } = require("../models")
const { Jwt_utility, ApiError } = require("../utils")


module.exports = async (req, res, next)=>{
    try {
        let token = req.headers.authorization;
        if(!token || !token.startsWith("Bearer")){
            throw new ApiError("You have to login to perform this action", 403)
        } 
        token = token.split(" ")[1];
        
        //validate token
        if(!Jwt_utility.validate_token(token)){
            throw new ApiError("Invalid/Expired token", 403)
        }
        
        // Verify token
        const decoded = Jwt_utility.decodeToken(token);
        const user = await User.find({ email : decoded.email });
        
        if(!user){
            throw new ApiError("You have to login to perform this action", 403)
        }

        res.locals.user = user;
        next()
    } catch (error) {
        next(new ApiError(error.message, 403)); 
    }
}