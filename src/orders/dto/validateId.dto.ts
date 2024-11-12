import { IsUUID } from 'class-validator';

export class ValidateIdDto {
  @IsUUID()
  id: string;
}
