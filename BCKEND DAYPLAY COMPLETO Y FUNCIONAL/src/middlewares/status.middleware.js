export const requireNotPending = (req, res, next) => {
    if(req.user.status==="PENDING") return res.status(403).json({ error: "Pending user: functionality not available" });
    next();
};

export const canGetRewards = (req, res, next) => {
    if(req.user.status === "PENDING") return res.status(403).json({ error: "Pending users cannot get rewards" });
    next();
};

export const canViewRankings = (req, res, next) => {
    if(req.user.status === "PENDING") return res.status(403).json({ error: "Pending users cannot view rankings" });
    next();
};