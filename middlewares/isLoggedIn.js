function isLoggedIn(req, res, next) {
    //if user is authenticated in session
    if (req.isAuthenticated())
        return next();

    //otherwise return to login
    res.redirect('/');
}