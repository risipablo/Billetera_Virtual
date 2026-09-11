const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const crypto = require('crypto');
const userModel = require('../models/User');


passport.use('google', new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => { 
        console.log('Perfil de Google recibido:', profile.emails[0]?.value);
        
        try {
            const email = profile.emails[0].value;
            const name = profile.displayName;
            const avatarUrl = profile.photos[0]?.value;

            
            let user = await userModel.findOne({ email });

            if (!user) {
            
                user = new userModel({
                    email,
                    name,
                    avatarUrl,
                    password: crypto.randomBytes(20).toString('hex'), // Contraseña aleatoria
                    isGoogleUser: true,
                    password:undefined
                });
                await user.save();
                
            } else {
                
                // Actualizar avatar si no tiene
                if (!user.avatarUrl && avatarUrl) {
                    user.avatarUrl = avatarUrl;
                    await user.save();
                }
            }

            
            return done(null, user);
            
        } catch (error) {
            console.error('Error en estrategia de Google:', error);
            return done(error, null);
        }
    }
));
// estrategia local para email y contraseña
passport.use('local', new LocalStrategy(
    {
        usernameField:'email',
        passwordField: 'password'
    },
    async (email,password,done) => {
        try{
            const user = await User.findOne({email})

            if(!user){
                return done(null, false, {message: 'Credenciales inválidas'})
            }

            const isMatch = await user.comparePassword(password)
            if(!isMatch){
                return done(null,false, {message: 'Contraseña incorrecta'})
            }

            return done(null,user)
        } catch (error){
            return done (error)
        }
    }
))


// Proteger las rutas de la API
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET 
}

passport.use('jwt', new JwtStrategy(jwtOptions, async(payload, done) => {
    try{
        const user = await User.findById(payload.id).select('-password')

        if(user){
            return done(null,user)
        } else {
            return done(null,false)
        }
    } catch(error){
        return done(error, false)
    }
}))

// Auteticacion unificado
const authGuard = (req,res,next) => {
    passport.authenticate('jwt',{session:false},(err,user,info) => {
        if(err){
            return next(err)
        }
        if(!user){
            return res.status(401).json({error: 'No autorizado. Token inválido o expirado'})
        }
        req.user = user
        next()
    })(req,res,next)
}

module.exports = {
    passport,
    authGuard,
}