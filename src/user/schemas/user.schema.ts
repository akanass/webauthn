import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      // delete obsolete data
      delete ret._id;

      // change all date in timestamp
      if (!!ret.last_access_time) {
        ret.last_access_time = new Date(ret.last_access_time).getTime();
      }
      if (!!ret.created_at) {
        ret.created_at = new Date(ret.created_at).getTime();
      }
      if (!!ret.updated_at) {
        ret.updated_at = new Date(ret.updated_at).getTime();
      }
    },
  },
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
  skip_authenticator_registration?: boolean;

  @Prop({
    type: Date,
  })
  last_access_time?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
