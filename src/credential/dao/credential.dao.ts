import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credential, CredentialDocument } from '../schemas/credential.schema';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatchCredentialDto } from '../dto/patch-credential.dto';

@Injectable()
export class CredentialDao {
  /**
   * Class constructor
   *
   * @param {Model<CredentialDocument>} _credentialModel instance of the model representing a Credential
   */
  constructor(@InjectModel(Credential.name) private readonly _credentialModel: Model<CredentialDocument>) {
  }

  /**
   * Create a new credential
   *
   * @param {Credential} credential to create
   *
   * @return {Observable<Credential>} new credential created
   */
  save(credential: Credential): Observable<Credential> {
    return from(new this._credentialModel(credential).save())
      .pipe(
        map((doc: CredentialDocument) => doc.toJSON()),
      );
  }

  /**
   * Patch the credential for the given credential id with the given patch values
   *
   * @param {string} id of the Credential
   * @param {string} userId unique identifier of the owner of the credential to update
   * @param {PatchCredentialDto} patch the values to patch the credential
   *
   * @return {Observable<Credential | void>} patched credential or undefined if not found
   */
  updateCredentialName(id: string, userId: string, patch: PatchCredentialDto): Observable<Credential | void> {
    return from(this._credentialModel.findOneAndUpdate({ id, user_id: userId }, patch, {
      new: true,
      runValidators: true,
    }))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Function to update data when user login with a credential
   *
   * @param {Buffer} credentialId unique identifier provided by the browser
   * @param {number} signatureCount the new counter value of this credential
   *
   * @return {Observable<Credential | void>} patched credential or undefined if not found
   */
  updateLoginData(credentialId: Buffer, signatureCount: number): Observable<Credential | void> {
    return from(this._credentialModel.findOneAndUpdate({ credential_id: credentialId }, {
      last_access_time: new Date().getTime(),
      signature_count: signatureCount,
    }, {
      new: true,
      runValidators: true,
    }))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Find all credentials for the given user id
   *
   * @param {string} userId unique identifier of the owner of all credentials
   *
   * @return {Observable<Credential[] | void>} list of credentials or undefined if not found
   */
  findAllByUserId(userId: string): Observable<Credential[] | void> {
    return from(this._credentialModel.find({ user_id: userId }))
      .pipe(
        map((docs: CredentialDocument[]) => (!!docs && docs.length > 0) ? docs.map(_ => _.toJSON()) : undefined),
      );
  }

  /**
   * Find a credential by its credential_id
   *
   * @param {Buffer} credentialId unique identifier provided by the browser
   *
   * @return {Observable<Credential | void>} credential or undefined if not found
   */
  findByCredentialId(credentialId: Buffer): Observable<Credential | void> {
    return from(this._credentialModel.findOne({ credential_id: credentialId }))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Find a credential by its user_handle
   *
   * @param {Buffer} userHandle unique identifier which links a credential to an user in the browser
   *
   * @return {Observable<Credential | void>} credential or undefined if not found
   */
  findByUserHandle(userHandle: Buffer): Observable<Credential | void> {
    return from(this._credentialModel.findOne({ user_handle: userHandle }))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Find a credential by its aaguid
   *
   * @param {string} aaguid unique identifier which links a credential to the metadataservice provided by FIDO
   *
   * @return {Observable<Credential | void>} credential or undefined if not found
   */
  findByAaguid(aaguid: string): Observable<Credential | void> {
    return from(this._credentialModel.findOne({ aaguid }))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Returns one credential of the list matching id in parameter
   *
   * @param {string} id of the credential in the db
   *
   * @return {Observable<Credential | void>} credential or undefined if not found
   */
  findById(id: string): Observable<Credential | void> {
    return from(this._credentialModel.findById(id))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }

  /**
   * Delete a credential in database
   *
   * @param {string} id of the credential in the db
   * @param {string} userId unique identifier of the owner of the credential to remove
   *
   * @return {Observable<Credential | void>} credential deleted object or undefined if not found
   */
  findByIdAndUserIdThenRemove(id: string, userId: string): Observable<Credential | void> {
    return from(this._credentialModel.findOneAndRemove({ id, user_id: userId }))
      .pipe(
        map((doc: CredentialDocument) => !!doc ? doc.toJSON() : undefined),
      );
  }
}
