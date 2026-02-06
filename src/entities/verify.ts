import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity('verify')
export class Verify {

  @PrimaryGeneratedColumn()
  id: number
  
  @Column({ type: 'varchar', length: 150 })
  code: string

  @CreateDateColumn()
  createAt: Date

  @Column({ type: 'varchar', length: 150, nullable: true })
  uid: string

  @Column({ type: 'boolean', default: false })
  verified: boolean

  @Column({ type: 'varchar', length: 150 })
  address: string

  @Column({ type: 'varchar', length: 150 })
  target: string

}