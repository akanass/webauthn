import { supportsWebauthn } from '@simplewebauthn/browser';

export class WebAuthn {
  // private static property to store singleton instance
  private static _instance: WebAuthn;
  // private property flag to know if the browser supports WebAuthn protocol
  private readonly _supported: boolean;

  /**
   * Create new instance and set flag to know if the browser supports WebAuthn protocol
   * @private
   */
  private constructor() {
    this._supported = supportsWebauthn();
  }

  /**
   * Method returns new singleton instance
   */
  static instance(): WebAuthn {
    if (!(WebAuthn._instance instanceof WebAuthn)) {
      WebAuthn._instance = new WebAuthn();
    }

    return WebAuthn._instance;
  }

  /**
   * Returns flag to know if the browser supports WebAuthn protocol
   */
  get supported(): boolean {
    return this._supported;
  }
}

// create singleton instance
const webAuthn: WebAuthn = WebAuthn.instance();

// export it
export { webAuthn };
