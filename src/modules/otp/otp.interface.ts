export type IOTP = {
  credential: string;
  otp: number;
  expireAt: Date;
};

export type IOtpVerify = {
  credential: string;
  otp: number;
};
