import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  CASH = 'cash',
  INVESTMENT = 'investment',
  LOAN = 'loan',
  OTHER = 'other'
}

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: AccountType,
    default: AccountType.CHECKING
  })
  type!: AccountType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0
  })
  balance!: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: true
  })
  creditLimit!: number | null;

  @Column({ length: 3, default: 'USD' })
  currency!: string;

  @Column({ length: 7, nullable: true })
  color!: string | null;

  @Column({ length: 50, nullable: true })
  icon!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  includeInTotal!: boolean;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions!: Transaction[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

