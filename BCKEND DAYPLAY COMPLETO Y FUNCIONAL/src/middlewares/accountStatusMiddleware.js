export const requireApprovedUser = (req, res, next) => {
    if (req.user.status !== "USER_APPROVED" && req.user.status !== "ADMIN") {
      return res.status(403).json({
        error: "Cuenta pendiente: funcionalidad no disponible"
      });
    }
    next();
};  