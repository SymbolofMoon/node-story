const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')


module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
        clientID:     process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        
      },
      async(accessToken, refreshToken, profile, done) => {
        const newUser={
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value 
        }

        try {
            let user= await User.findOne({googleId: profile.id })

            if(user){
                done(null,user)
                console.log("Old User")
            }else{
                user=await User.create(newUser)
                done(null, user)
                console.log("New User is added")
            }
        } catch (err) {
            console.error(object)
        }
      }  
      )
      )

    passport.serializeUser((user,done) =>{
        done(null, user.id)
    })    

    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) =>{
            done(err,user)
        })
    })
    
}