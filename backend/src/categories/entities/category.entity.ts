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
import { Budget } from '../../budgets/entities/budget.entity';

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.EXPENSE
  })
  type!: CategoryType;

  @Column({ length: 7, nullable: true })
  color!: string | null;

  @Column({ length: 50, nullable: true })
  icon!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: false })
  isSystem!: boolean;

  @Column('uuid', { nullable: true })
  userId!: string | null;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'userId' })
  user!: User | null;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions!: Transaction[];

  @OneToMany(() => Budget, budget => budget.category)
  budgets!: Budget[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

