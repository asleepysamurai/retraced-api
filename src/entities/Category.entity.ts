import {
  Entity,
  Column,
  JoinColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId!: number;

  @ManyToOne(
    () => {
      return Category;
    },
    (category) => {
      return category.children;
    },
  )
  @JoinColumn({ name: 'parent_id' })
  parent?: Category;

  @OneToMany(
    () => {
      return Category;
    },
    (category) => {
      return category.parent;
    },
  )
  children?: Category[];
}
