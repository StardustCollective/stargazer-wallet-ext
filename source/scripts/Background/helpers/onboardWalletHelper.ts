// @ts-ignore
import { HdKeyring } from '@stardust-collective/dag4-keyring/esm/rings';

export class OnboardWalletHelper {
  private phrase: string;

  reset () {
    this.phrase = null;
  }

  getSeedPhrase () {
    return this.phrase || this.generateSeedPhrase();
  }

  generateSeedPhrase () {
    this.phrase = HdKeyring.generateMnemonic();
    return this.phrase;
  }

  importAndValidateSeedPhrase (phrase: string) {
    if(HdKeyring.validateMnemonic(phrase)) {
      this.phrase = phrase;
      return true;
    }
    return false;
  }
}

export const onboardWalletHelper = new OnboardWalletHelper();
