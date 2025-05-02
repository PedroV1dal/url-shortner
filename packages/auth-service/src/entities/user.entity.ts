import { Entity, PrimaryKey, Property, Unique, Filter } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({ tableName: "users" })
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
export class User {
  @PrimaryKey({ type: "uuid" })
  id: string = v4();

  @Property()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;
}
