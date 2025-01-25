import SignInErrorCodes from "../data/SignInErrorCodes.json";

export const getSignInErrorCodeTranslation = (errorCode) => {
  if (SignInErrorCodes.hasOwnProperty(String(errorCode))) {
    return SignInErrorCodes[String(errorCode)];
  } else {
    return errorCode;
  }
};
