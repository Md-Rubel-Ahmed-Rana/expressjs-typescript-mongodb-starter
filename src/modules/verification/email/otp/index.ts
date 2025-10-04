class Service {
  sendEmailVerifyOtp(payload: { name: string; email: string }) {
    console.log(payload);
    // steps analysis
    // 1. generate 6 digit otp and store on DB with dynamically set expired (auto deletion) time
    // 2. design the email template
    // 3. send email to user mailbox
  }
}

export const EmailVerifyOTPkService = new Service();
