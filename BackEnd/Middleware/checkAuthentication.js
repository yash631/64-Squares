function isAuthenticated(req, res, next) {
  // Check if the session has user ID (meaning user is logged in)
  if (req.session.userId) {
    // User is authenticated, proceed to the next function (the route handler)
    return next();
  } else {
    // User is not authenticated, redirect to login
    console.log("Unauthenticated user");
    res.redirect("/login");
  }
}
module.exports = { isAuthenticated };
