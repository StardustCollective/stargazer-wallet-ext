import * as Yup from 'yup';

export const CREATE_PASS_TITLE1 = `Let's create a \npassword for your\nStargazer Wallet`;
export const CREATE_PASS_TITLE2 = `Password set\nsuccessfully!`;

export const CREATE_PASS_COMMENT1 = `DO NOT FORGET to save your password.\nYou will need this Password to unlock your wallet.`;
export const CREATE_PASS_COMMENT2 = `You can now see your balance and transaction history, send and receive DAG`;

export const schema = Yup.object().shape({
  password: Yup.string()
    .required(
      'At least 6 charachters, 1 lower-case, 1 capital, 1 numeral and 1 special charachter.'
    )
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      'At least 6 charachters, 1 lower-case, 1 capital, 1 numeral and 1 special charachter.'
    ),
  repassword: Yup.string()
    .oneOf([Yup.ref('password'), ''], 'Incorrect please re-enter password!')
    .required('Incorrect please re-enter password!'),
});
