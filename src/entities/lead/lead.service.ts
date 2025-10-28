import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadEntity } from './entities/lead.entity';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(LeadEntity)
    private readonly leadRepository: Repository<LeadEntity>,
  ) {}

  create(createLeadDto: CreateLeadDto) {
    const lead = this.leadRepository.save(createLeadDto);
    console.log('lead', lead);
    return lead;
  }

  findAll() {
    return this.leadRepository.find();
  }

  findOne(id: number) {
    return this.leadRepository.findOne({
      where: { id },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
