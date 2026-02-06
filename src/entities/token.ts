import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('token')
export class Token {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150 })
  name: string

  @Column({ type: 'varchar', length: 150 })
  token: string

  @CreateDateColumn()
  createAt: Date

  @Column({ type: 'varchar', length: 150 })
  uid: string

  // 时间戳；秒
  @Column({ type: 'integer', default: 0 })
  expireTime: number

}