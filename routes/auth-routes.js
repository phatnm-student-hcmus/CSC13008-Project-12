const router = require('express').Router();
const passport = require('passport')

router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: "select_account"
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth/google/failure'}), (req, res) => {
    res.redirect(`/board/${req.user.userId}`)
});
module.exports = router