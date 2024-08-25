const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
     new GoogleStrategy(
          {
               clientID: process.env.clientID,
               clientSecret: process.env.clientSecret,
               callbackURL: '/auth/redirect',
               session : false
          },
          async(accessToken, refreshToken, profile, done)=>{
               try{
                    const user = {
                         name : profile.displayName,
                         email: profile.emails[0].value
                    }

                    done(null, user);
               }catch(error){
                    console.log(error.message);
                    done(error, null);
               }
          }
     )
)