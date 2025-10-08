import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';

export enum NotificationType {
  BUDGET_ALERT = 'budget_alert',
  BUDGET_EXCEEDED = 'budget_exceeded',
  GOAL_MILESTONE = 'goal_milestone',
  GOAL_COMPLETED = 'goal_completed',
  RECURRING_UPCOMING = 'recurring_upcoming',
  LOW_BALANCE = 'low_balance',
  UNUSUAL_SPENDING = 'unusual_spending',
  MONTHLY_SUMMARY = 'monthly_summary',
  SYSTEM = 'system'
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: NotificationType
  })
  type!: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM
  })
  priority!: NotificationPriority;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'jsonb', nullable: true })
  data!: any;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt!: Date | null;

  @Column({ default: false })
  isActionable!: boolean;

  @Column({ length: 255, nullable: true })
  actionUrl!: string | null;

  @Column({ length: 100, nullable: true })
  actionLabel!: string | null;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}

