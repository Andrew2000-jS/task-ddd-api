import { TaskEntity } from 'src/contexts/tasks/infrastructure/persistence/task.entity';
import { AuthEntity } from 'src/contexts/auth/infrastructure/persistence/auth.entity';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  firstname: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastname: string | null;

  @Column({ type: 'varchar', nullable: true })
  @Index({ unique: true })
  username: string | null;

  @Column({ type: 'date', nullable: true })
  birthday: Date | null;

  @OneToOne(() => AuthEntity, (auth) => auth.user, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
