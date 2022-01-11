import * as Yup from 'yup';

export const LOGIN_SUCCESS_COMMENT = `Login successful.`;
export const LOGIN_FAILURE_COMMENT = `Error: Invalid password`;

export const schema = Yup.object().shape({
  password: Yup.string().required('Error: Password is a required field.'),
  // .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});
