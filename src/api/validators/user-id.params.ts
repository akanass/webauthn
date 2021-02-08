import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UserIdParams {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}
