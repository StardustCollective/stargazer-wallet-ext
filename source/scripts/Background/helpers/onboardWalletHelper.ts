import { Bip39Helper } from '@stardust-collective/dag4-keyring';

export class OnboardWalletHelper {
  private phrase: string;

  reset() {
    this.phrase = null;
  }

  getSeedPhrase() {
    return this.phrase || this.generateSeedPhrase();
  }

  setSeedPhrase(phrase: string) {
    this.phrase = phrase;
  }

  generateSeedPhrase() {
    this.phrase = Bip39Helper.generateMnemonic();
    return this.phrase;
  }

  importAndValidateSeedPhrase(phrase: string) {
    if (Bip39Helper.validateMnemonic(phrase)) {
      this.phrase = phrase;
      return true;
    }
    return false;
  }

  validateSeedPhrase(phrase: string) {
    return Bip39Helper.validateMnemonic(phrase);
  }
}
