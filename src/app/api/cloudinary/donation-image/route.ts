import { cloudinary } from "@/libs/cloudinary"
import { DBConnect } from "@/libs/DBConnect";
import donationModel from "@/models/donation.model";
import userModel from "@/models/user.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    DBConnect()
    const {fileUri, donationId} = await req.json()
    const res = await cloudinary.uploader.upload(fileUri)
    if(res.url){
      const donation = await donationModel.findById(donationId)
      if(!donation) return NextResponse.json({error: "not found"}, {status: 400})
      donation.image = res.url
      await donation.save()
    }
    return NextResponse.json({message: "successfully uploaded"}, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({error}, {status: 500})
  }
};