exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next()
    } else {
        res.status(403).send('Login required')
    }
}

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/')
    }
}