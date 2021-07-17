const router = require('express').Router();

const authCheck = (req, res, next) => {
    if(!req.user){
        res.redirect('/');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    console.log(req.user.name);
    res.render('home')
});

router.get('/:name', authCheck, (req, res) => { 
    console.log(req.user.name);
    res.render('home')
})
module.exports = router