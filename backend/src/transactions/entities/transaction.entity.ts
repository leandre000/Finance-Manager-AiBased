import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Category } from '../../categories/entities/category.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type!: TransactionType;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2
  })
  amount!: number;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ length: 255, nullable: true })
  payee!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  tags!: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  attachments!: string[] | null;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('uuid')
  accountId!: string;

  @ManyToOne(() => Account, account => account.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account!: Account;

  @Column('uuid', { nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => Category, category => category.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category | null;

  @Column('uuid', { nullable: true })
  toAccountId!: string | null;

  @ManyToOne(() => Account, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'toAccountId' })
  toAccount!: Account | null;

  @Column({ default: false })
  isRecurring!: boolean;

  @Column({ length: 50, nullable: true })
  recurringFrequency!: string | null;

  @Column('uuid', { nullable: true })
  parentTransactionId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

