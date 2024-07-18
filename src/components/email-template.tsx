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
    {forVerification? <p>Here is your ${verifyCode} which is valid for next 24hr and if not validated then your account will deleted with all the saved data. <br/>
    <Link href='/verify'>Verify Yourself</Link>
    </p> : 
    <p>Here is your ${passwordRecoveryCode} which is valid for next 1hr.<br/>
    <Link href='/new-password'>Verify and Change Password</Link>
    </p>
    }

  </div>
);
