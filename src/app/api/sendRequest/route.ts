import { Resend } from 'resend';
import * as React from 'react';
import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken"
import userModel from '@/models/user.model';
import { RequestEmailTemplate } from '@/components/request-email-template';
import { DBConnect } from '@/libs/DBConnect';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    DBConnect()
  try {
    const token = req.cookies.get('token')?.value
    const {donorId} = await req.json()
    let decodedToken
    if(token){
        try {
            decodedToken = jwt.decode(token) as {id: string, isDonor: boolean}
        } catch (error) {
            console.error("error decoding token")
        }
    }

    const id = decodedToken?.id

    const user = await userModel.findById(id)
    if(!user) return NextResponse.json({error: "User not found"}, {status: 400})

    const donor = await userModel.findById(donorId)
    if(!donor) return NextResponse.json({error: "Donor not found"}, {status:400})

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [donor.email],
      subject: "Donation Request",
      react: RequestEmailTemplate({donorName: donor.firstName, requesterName: user.firstName, certificateId : user.certificateId}) as React.ReactElement,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data, message: "Mail sent to registered email" }, {status: 200});
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}