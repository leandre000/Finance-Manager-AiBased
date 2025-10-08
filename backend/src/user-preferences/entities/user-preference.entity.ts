import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 3, default: 'USD' })
  defaultCurrency!: string;

  @Column({ length: 10, default: 'en-US' })
  locale!: string;

  @Column({ length: 50, default: 'UTC' })
  timezone!: string;

  @Column({ length: 20, default: 'YYYY-MM-DD' })
  dateFormat!: string;

  @Column({ default: true })
  enableNotifications!: boolean;

  @Column({ default: true })
  emailNotifications!: boolean;

  @Column({ default: false })
  pushNotifications!: boolean;

  @Column({ default: true })
  budgetAlerts!: boolean;

  @Column({ default: true })
  goalMilestones!: boolean;

  @Column({ default: true })
  lowBalanceAlerts!: boolean;

  @Column({ default: 100 })
  lowBalanceThreshold!: number;

  @Column({ default: true })
  recurringReminders!: boolean;

  @Column({ default: 3 })
  recurringReminderDays!: number;

  @Column({ default: false })
  monthlyReports!: boolean;

  @Column({ default: false })
  weeklyDigest!: boolean;

  @Column({ length: 10, default: 'light' })
  theme!: string;

  @Column({ type: 'jsonb', nullable: true })
  dashboardWidgets!: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  hiddenCategories!: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  customSettings!: Record<string, any> | null;

  @Column('uuid', { unique: true })
  userId!: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

