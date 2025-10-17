import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './entities/regions.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const existingRegion = await this.regionRepository.findOne({
      where: { title: createRegionDto.title },
    });

    if (existingRegion) {
      throw new ConflictException('Регион с таким названием уже существует');
    }

    const region = this.regionRepository.create({
      id: uuidv4(),
      ...createRegionDto,
    });

    return await this.regionRepository.save(region);
  }

  async findAll(): Promise<Region[]> {
    return await this.regionRepository.find();
  }

  async findOne(id: string): Promise<Region> {
    const region = await this.regionRepository.findOne({ where: { id } });
    if (!region) {
      throw new ConflictException('Регион не найден');
    }
    return region;
  }

  async update(id: string, updateRegionDto: UpdateRegionDto): Promise<Region> {
    const region = await this.findOne(id);

    if (updateRegionDto.title && updateRegionDto.title !== region.title) {
      const existingRegion = await this.regionRepository.findOne({
        where: { title: updateRegionDto.title },
      });

      if (existingRegion) {
        throw new ConflictException('Регион с таким названием уже существует');
      }
    }

    await this.regionRepository.update(id, updateRegionDto);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const region = await this.findOne(id);
    await this.regionRepository.remove(region);
  }
}
