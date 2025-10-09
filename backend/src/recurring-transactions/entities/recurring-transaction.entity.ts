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
import { TransactionType } from '../../transactions/entities/transaction.entity';

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum RecurringStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity('recurring_transactions')
export class RecurringTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

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

  @Column({
    type: 'enum',
    enum: RecurringFrequency
  })
  frequency!: RecurringFrequency;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @Column({ type: 'date' })
  nextOccurrence!: Date;

  @Column({ type: 'date', nullable: true })
  lastProcessed!: Date | null;

  @Column({
    type: 'enum',
    enum: RecurringStatus,
    default: RecurringStatus.ACTIVE
  })
  status!: RecurringStatus;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ length: 255, nullable: true })
  payee!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  tags!: string[] | null;

  @Column({ default: 0 })
  occurrenceCount!: number;

  @Column({ nullable: true })
  maxOccurrences!: number | null;

  @Column({ default: true })
  autoCreate!: boolean;

  @Column({ default: false })
  notifyBeforeCreation!: boolean;

  @Column({ default: 1 })
  notifyDaysBefore!: number;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column('uuid')
  accountId!: string;

  @ManyToOne(() => Account, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account!: Account;

  @Column('uuid', { nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category!: Category | null;

  @Column('uuid', { nullable: true })
  toAccountId!: string | null;

  @ManyToOne(() => Account, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'toAccountId' })
  toAccount!: Account | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

