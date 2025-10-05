import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Region } from './interfaces/region';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegionsService {
  private regions: Region[] = [];

  create(createRegionDto: CreateRegionDto) {
    const existingRegion = this.regions.find(
      (region) => region.title === createRegionDto.title,
    );

    if (existingRegion) {
      throw new ConflictException('Регион с таким названием уже существует');
    }

    const region = { id: uuidv4(), ...createRegionDto };
    this.regions.push(region);
    return region;
  }

  findAll() {
    return this.regions;
  }

  findOne(id: string) {
    return this.regions.find((region: Region) => region.id === id);
  }

  update(id: string, updateRegionDto: UpdateRegionDto) {
    const region = this.regions.find((region: Region) => region.id === id);
    if (region) {
      Object.assign(region, updateRegionDto);
      return region;
    }
    return null;
  }

  remove(id: string) {
    const foundRegion = this.regions.find((region: Region) => region.id === id);
    this.regions = this.regions.filter(
      (region: Region) => region.id !== foundRegion?.id,
    );
    return foundRegion;
  }
}
