import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  intra_id: number;

  @Column()
  full_name: string;

  @Column()
  email: string;

  @Column()
  avatar: string;
}
