import { UserIdParams } from './user-id.params';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CredentialIdParams extends UserIdParams {
  @IsMongoId()
  @IsNotEmpty()
  credId: string;
}
