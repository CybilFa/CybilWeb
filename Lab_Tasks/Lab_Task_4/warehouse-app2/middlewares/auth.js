function isAuthenticated(req, res, next) {
//  if (!req.session.user) {
//       return res.redirect("/login");
//     }
//     next(); 
// }

  console.log("Auth check. User:", req.session.user);
  if (!req.session.user) {
    console.log("Auth check. User:", req.session.user);
    return res.redirect("/login");
  }
  next();

}

module.exports = isAuthenticated;
