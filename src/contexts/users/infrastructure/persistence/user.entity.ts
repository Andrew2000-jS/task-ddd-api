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

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column({ type: 'date' })
  birthday: Date;

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
