import { Entity, PrimaryKey, Property, Filter } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity({ tableName: "urls" })
@Filter({ name: "softDelete", cond: { deletedAt: null }, default: true })
export class Url {
  @PrimaryKey({ type: "uuid" })
  id: string = v4();

  @Property()
  shortCode!: string;

  @Property()
  originalUrl!: string;

  @Property()
  clickCount: number = 0;

  @Property({ nullable: true })
  userId?: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;
}
