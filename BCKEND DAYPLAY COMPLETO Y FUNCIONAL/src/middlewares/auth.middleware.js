import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ error: "Authorization header missing" });
    if(!authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Invalid authorization format" });
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id,
            planType: decoded.planType
        };
        next();
    }catch(error){
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};