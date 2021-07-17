const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const keys = require('./keys')
const myURL = require('./myURL').myURL
const User = require('../models/users')

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        console.log('des',user.userId);
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //option for gg strategy
        callbackURL: `${myURL}/auth/google/callback`,
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret

    }, (accesToken, refreshToken, profile, done) => {
        //passport callback func
        User.findOne({ userId: profile.id, accountType: 'google' }).then((currentUser) => {

            //check if user already exist in  DB
            if (currentUser) {
                //user exist
                console.log(profile.id + ' aldready exist')
                done(null, currentUser)
            }
            else {
                // if not, create a new user
                new User({
                    accountType: 'google',
                    userId: profile.id,
                    name: profile.displayName,
                    avtURL: profile.photos[0].value,
                    recentBoard: []
                }).save().then((newUser) => {
                    console.log('new user created')
                    done(null, newUser)
                })
            }
        })
    })
)