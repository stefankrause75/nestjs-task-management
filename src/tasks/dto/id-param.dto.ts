import { IsNumber, IsNumberString } from 'class-validator';

export class IdParamDto {
  @IsNumber()
  id: number;
}
