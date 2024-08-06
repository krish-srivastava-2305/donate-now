import { DBConnect } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const POST = async (req: NextRequest):Promise<NextResponse> => {
    DBConnect()
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        const user = await userModel.findOne({email})
        if(!user) return NextResponse.json({error: "User does not exist"},{status: 400})

        const correctPass = await bcrypt.compare(password, user.password)
        if(!correctPass) return NextResponse.json({error: "Incorrect password"},{status: 400})

        if(!user.isVerified) {
            return NextResponse.json({message: "Please verify your account"},{status: 200})
        }

        const token = jwt.sign({id: user._id, isDonor: user.isDonor}, process.env.JWT_SECRET!, {expiresIn: '1d'})

        const res = NextResponse.json({message: "Sign-In Success", isDonor: user.isDonor},{status: 200})
        res.cookies.set("token", token)
        return res
    } catch (error) {
        console.error("Error sign-in: ",error)
        return NextResponse.json({error: "Server error"},{status: 500})
    }
}