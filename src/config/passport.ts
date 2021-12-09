import passport from 'passport'; //Biblioteca que permite criar varios tipos de auth
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'; //Biblioteca que ajuda a criar estrategia para jwt
import { User } from '../models/User';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; //Biblioteca que nos ajuda a gerar o token

dotenv.config();

const notAuthorizedJson = { data: { status: 401, message: 'Nao autorizado!' } };

const options = {
   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
   secretOrKey: (process.env.JWT_SECRET as string) ?? 'random',
}; //No jwtFromRequest vc coloca onde e que vc vai procurar o token, nesse nosso caso e no Bearer do Header

//Configurando a estrategia
passport.use(
   new JWTStrategy(options, async (payload, done) => {
      const user = await User.findByPk(payload.id); //Isso e o que, pq?
      if (user) {
         return done(null, user); //Caso der certo
      } else {
         done(notAuthorizedJson, false);
      }
   })
);

export const generateToken = (data: object) => {
   return jwt.sign(data, process.env.JWT_SECRET as string, { expiresIn: '2h' }); //Metodo que gera o token, {expiresIn:300}, esse parametro nao e obrigatorio, 300 sao 5 min
};

export const privateRoute = (req: Request, res: Response, next: NextFunction) => {
   passport.authenticate('jwt', (err, user) => {
      req.user = user;
      return user ? next() : next(notAuthorizedJson);
   })(req, res, next);
};

export default passport;
