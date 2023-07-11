import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GoogleAuthenticator extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ascii: string;

  @Column()
  otpauth_url: string;

  @Column()
  hex: string;

  @Column()
  base32: string;
}
