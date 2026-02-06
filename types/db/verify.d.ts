import { Verify } from '~/entities'

export declare type QueryVerify = Omit<Verify, 'createAt'>

export declare type NewVerify = Omit<QueryVerify, 'id' | 'verified'>