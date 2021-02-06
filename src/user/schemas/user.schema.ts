import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: { virtuals: true },
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    lowercase: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  display_name: string;

  @Prop({
    type: 'Buffer',
    required: true,
  })
  password_hash: Buffer;

  @Prop({
    type: Boolean,
    default: false,
  })
  skip_authenticator_registration: boolean;

  @Prop({
    type: Date,
  })
  last_access_time: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
