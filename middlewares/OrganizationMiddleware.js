export const ensureOrganizationRole = (req, res, next) => {
  const { user } = req;
  if (user.role !== "1") {
    return res.status(403).json({
      message:
        "You can't access this feature because you are not a organization...!",
    });
  }
  // If user role is captain, call next() to pass control to the next middleware or route handler
  next();
};
