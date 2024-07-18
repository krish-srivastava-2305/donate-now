import { verify } from 'crypto';
import Link from 'next/link';
import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  forVerification: boolean,
  verifyCode?: number,
  passwordRecoveryCode?: number,
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName, forVerification, verifyCode, passwordRecoveryCode
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
    <p>Here is your ${forVerification? verifyCode: passwordRecoveryCode} which is valid for next {forVerification? '24hr': '1hr'}. <br/>
    </p>

  </div>
);
