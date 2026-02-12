export const rankingAccess = (req, res, next) => {
    const { id, planType } = req.user;
    if(!planType) return res.status(403).json({ message: "User without a plan" });
    if(planType==="BASIC"){
        req.rankingFilter = { userId: id };
        return next();
    }
    if(planType==="PREMIUM"){
        req.rankingFilter = {};
        return next();
    }
    return res.status(403).json({ message: "Plan not recognised" });
};