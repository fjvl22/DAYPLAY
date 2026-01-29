export const requireApprovedUser = (req, res, next) => {
    const status = req.user.status;
  
    if (status === "PENDING") {
      return res.status(403).json({
        error: "Usuario pendiente: no puedes guardar progreso"
      });
    }
  
    next();
  };
  