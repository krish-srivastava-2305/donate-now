import { EmailTemplate } from '../../../components/email-template';
import { Resend } from 'resend';
import * as React from 'react';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {firstName, verifyCode, passwordRecoveryCode, forVerification, email} = await req.json()
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [email],
      subject: forVerification? "Verify" : "Recover Password",
      react: EmailTemplate({ firstName, forVerification, verifyCode, passwordRecoveryCode }) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Mail sent to registered email" }, {status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}