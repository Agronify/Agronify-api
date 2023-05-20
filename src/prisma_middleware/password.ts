import {Prisma, User} from '@prisma/client';
import bcrypt from 'bcryptjs';
export const Encrypt: Prisma.Middleware =  async (params: Prisma.MiddlewareParams, next) => {
    if (['create','update'].includes(params.action)  && params.model == 'User') {
        let user = params.args.data
        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
    }
    if(['findMany','findFirst'].includes(params.action) && params.model == 'User'){
        let user = await next(params)
        if(user.length > 0){
            user.map((item:User) => {
                item.password = null
            })
        }else{
            user.password = null
        }
        return user
    }
    return await next(params)
}