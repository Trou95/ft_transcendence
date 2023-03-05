import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'text' })
  username: string;

  @Column({ unique: true, nullable: true, type: 'text' })
  email: string;

  @Column('text')
  full_name: string;

  @Column('text')
  avatar: string;
}
