export type IOTP = {
  credential: string;
  otp: number;
  createdAt: Date;
};

export type IOtpVerify = {
  credential: string;
  otp: number;
};
