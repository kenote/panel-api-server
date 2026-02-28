import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 150 })
  username: string

  @Column({ type: 'varchar', length: 150 })
  email: string

  @Column({ type: 'varchar', length: 150, nullable: true })
  encrypt: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  salt: string

  @CreateDateColumn()
  createAt: Date

  @UpdateDateColumn()
  updateAt: Date

  @Column({ type: 'varchar', length: 50 })
  pid: string

  @Column({ type: 'varchar', nullable: true })
  jwtoken: string

  @Column({ type: 'varchar', length: 150 })
  token: string
}