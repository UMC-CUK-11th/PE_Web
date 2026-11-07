import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";

@Entity("member")
export class Member extends BaseTimeEntity {
  // mysql2 returns BIGINT as strings to preserve precision.
  @PrimaryGeneratedColumn({ name: "member_id", type: "bigint" })
  memberId!: string;

  @Column({ length: 254, unique: true })
  email!: string;

  @Column({ length: 60, select: false })
  password!: string;

  @Column({ length: 50, unique: true })
  nickname!: string;
}
