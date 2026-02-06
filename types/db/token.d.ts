import { Token } from '~/entities'

export declare type QueryToken = Omit<Token, 'createAt'>

export declare type NewToken = Omit<QueryToken, 'id'>