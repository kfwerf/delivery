export const validateJSON = (input = '') => {
  try {
    JSON.parse(input);
    return true;
  } catch (ignore) {}
  return false;
};
