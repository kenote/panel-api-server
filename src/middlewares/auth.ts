import jwt from 'jsonwebtoken'
import { ExtractJwt, Strategy, type StrategyOptions, type VerifyCallbackWithRequest } from 'passport-jwt'
import { loadConfig } from '@kenote/config'
import type { ServerConfigure } from '@/types/config/server'
import { Request } from 'koa'
import { userRepository } from '~/servies/db/user'

const { SECRET_KEY } = loadConfig<ServerConfigure>('config/server', { mode: 'merge' })

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  passReqToCallback: true,
  secretOrKey: SECRET_KEY
}

const strategyVerify: VerifyCallbackWithRequest<Request> = async (req, payload, done) => {
  let jwtoken = req.headers.authorization?.replace(/^(Bearer)\s{1}/, '')
  try {
    let user = await userRepository.findOneBy({ pid: payload?.pid, jwtoken })
    if (user == null) {
      return done(null, false)
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}

export const strategyJwt = new Strategy(jwtOptions, strategyVerify)

export const setJwToken = (payload: any, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions) =>
  jwt.sign(payload, secretOrPrivateKey, options)

export const verifyJwToken = (token: string, secretOrPrivateKey: jwt.Secret, options?: jwt.VerifyOptions) =>
  token ? <jwt.JwtPayload>jwt.verify(token, secretOrPrivateKey, options) : null