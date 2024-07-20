import { cloudinary } from "@/libs/cloudinary"
import { DBConnet } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    DBConnet()
    const {fileUri } = await req.json()
    const res = await cloudinary.uploader.upload(fileUri)
    // console.log(res)
    if(res.url){
      const token: any = req.cookies.get('token')
      console.log(token)
      if(!token) return NextResponse.json({error: "token not found"}, {status: 500})
      const decodeToken :any = jwt.decode(token.value, {complete: true})
      if(!decodeToken) return NextResponse.json({error: "token error"}, {status: 500})
      const { id, isDonor } = decodeToken.payload
      const user = await userModel.findOne({_id: id})
      if(!user){
        return NextResponse.json({error: "User not found"}, {status: 400})
      }
      user.certificateId = res.url
      await user.save()
    }
    return NextResponse.json({message: "successfully uploaded"}, {status: 200})
  } catch (error) {
    console.error(error)
    return NextResponse.json({error}, {status: 500})
  }
};