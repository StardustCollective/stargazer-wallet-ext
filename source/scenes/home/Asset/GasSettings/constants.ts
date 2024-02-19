export enum GAS_SETTINGS_STATE_ENUM {
  NONE = 1,
  OPTIONS,
  SETTINGS,
  CANCEL,
  UPDATED,
  ERROR,
}

export default {
  // Strings
  GWEI_STRING: 'GWEI',
  CANCEL_BUTTON_STRING: 'Cancel',
  SPEED_UP_BUTTON_STRING: 'Speed Up',
  FEE_STRING: 'Fee ~= ',
  SPEED_STRING: 'Speed:',
  TRANSACTION_UPDATED_STRING: 'Transaction updated',
  KEEP_STRING: 'Keep',
  CANCEL_TRANSACTION_STRING: 'Cancel Transaction',
  CANCEL_TRANSACTION_PROMPT_STRING: `Transaction will still process, but its value will be set at zero “0”.`,
  // Props
  SLIDER_STEP_PROP: 1,
  // Enums
  GAS_SETTINGS_STATE_ENUM,
};
