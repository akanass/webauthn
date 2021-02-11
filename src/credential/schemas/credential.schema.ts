import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CredentialMetadata } from '../interfaces/credential-metadata.interface';

export type CredentialDocument = Credential & Document;

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
export class Credential {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  user_id: string;

  @Prop({
    type: 'Buffer',
    required: true,
  })
  credential_id: Buffer;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  type: 'unknown' | string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  aaguid: string;

  @Prop({
    type: 'Buffer',
    required: true,
  })
  user_handle: Buffer;

  @Prop({
    type: 'Buffer',
    required: true,
  })
  public_key: Buffer;

  @Prop({
    type: Number,
    required: true,
  })
  signature_count: number;

  @Prop({
    type: String,
    required: true,
    enum: [ 'packed', 'tpm', 'android-key', 'android-safetynet', 'fido-u2f', 'none', 'apple' ],
  })
  attestation_format: string;

  @Prop({
    type: 'Buffer',
    required: true,
  })
  attestation: Buffer;

  @Prop(raw({
    authenticator_attachment: {
      type: String,
      required: true,
      enum: [ 'cross-platform', 'platform' ],
    },
    os: {
      type: String,
      trim: true,
    },
    device: {
      type: String,
      trim: true,
    },
  }))
  metadata: CredentialMetadata;

  @Prop({
    type: Date,
    required: true,
  })
  last_access_time: number;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
