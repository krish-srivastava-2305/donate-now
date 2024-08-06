import * as React from 'react';

type EmailTemplateProps = {
  firstName: string;
  forVerification: boolean;
  verifyCode?: string;
  passwordRecoveryCode?: string;
};

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  forVerification,
  verifyCode,
  passwordRecoveryCode,
}: EmailTemplateProps) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>
      Here is your {forVerification ? verifyCode : passwordRecoveryCode} which is valid for the next {forVerification ? '24hr' : '1hr'}.
    </p>
  </div>
);
