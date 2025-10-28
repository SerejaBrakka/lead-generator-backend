import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leads')
export class LeadEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  phone: string;

  @Column({ type: 'text', nullable: false })
  region: string;

  @Column({ type: 'text', nullable: false, name: 'amount_debt' })
  amountDebt: string;

  @Column({ type: 'text', nullable: false })
  debtTypes: string[];

  @Column({ type: 'boolean', nullable: false })
  things: boolean;

  @Column({ type: 'boolean', nullable: false })
  deals: boolean;
}
