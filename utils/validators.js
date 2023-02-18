const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

const isPassword8 = (string) => {

  if (String(string).length < 8) return true;
  else return false;
};

const isEmpty = (string) => {
  if(!string) return true;
  if (String(string).trim() === '') return true;
  else return false;
};

const isMobile = (string) => {
  if(!string) return false;
  if (String(string).trim() === '') return false;
  if (String(string).trim().charAt(0) !== '0' ) return true;
  if (String(string).trim().length !== 11) return true;
  else return false;
};

export const validateSignupData = (data) => {
  let errors = {};

  // if (isEmpty(data.username)) errors.username = 'Username must not be empty';
  if (isEmail(data.email));
  if (isEmpty(data.password)) errors.password = 'Password must not be empty';
  if (data.confirmPassword !== data.password) errors.confirmPassword = 'Password not match';
  if (isEmpty(data.confirmPassword)) errors.confirmPassword = 'Confirm password, must not be empty';
  if (isPassword8(data.password)) errors.password = 'Password must be 8 characters';
  // if (isEmpty(data.refId)) errors.refId = 'Referrer ID is Required';
  if (isEmpty(data.phone)) errors.phone = 'Phone is Required';
  if (isMobile(data.phone)) errors.phone = 'Phone is Invalid';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

export const validateLoginData = (data) => {
  let errors = {};

  // if (isEmpty(data.phone)) errors.phone= 'Mobile must not be empty';
  if (isEmail(data.email));
  if (isEmpty(data.password)) errors.password = 'Password must be empty';
  if (isPassword8(data.password)) errors.password = 'Password must be 8 characters';
  // if (isEmpty(data.refId)) errors.refId = 'Referrer ID is Required';

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
