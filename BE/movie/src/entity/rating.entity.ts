import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { BaseTimeEntity } from "./base-time.entity.js";
import { Member } from "./member.entity.js";

@Entity("rating")
@Unique("uk_rating_member_movie", ["member", "movieId"])
export class Rating extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ name: "rating_id", type: "bigint" })
  ratingId!: string;

  @ManyToOne(() => Member, { nullable: false })
  @JoinColumn({ name: "member_id" })
  member!: Member;

  // External TMDB identifier; deliberately not a foreign key.
  @Column({ name: "movie_id", type: "bigint" })
  movieId!: string;

  @Column({ type: "tinyint" })
  score!: number;

  @Column({ type: "text", nullable: true })
  comment!: string | null;
}
