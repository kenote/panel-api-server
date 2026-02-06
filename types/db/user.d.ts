import { User } from '~/entities'

export declare type SafeUser = Omit<User, 'encrypt' | 'salt' | 'jwtoken'>

export declare type QueryUser = Omit<SafeUser, 'createAt' | 'updateAt'>

export declare type NewUser = Omit<QueryUser, 'id' | 'pid'> & {
  password    : string
  target     ?: string
}

export declare type VerifyUser = {
  username    : string
  password    : string
  target     ?: string
}