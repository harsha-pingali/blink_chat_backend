import otpGenerator from "otp-generator";
const otpUtility = async () => {
  const otp = await otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  return otp;
};

export default otpUtility;
