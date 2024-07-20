import userModel from "@/models/user.model";
import { NextResponse, NextRequest } from "next/server";
import { DBConnet } from "@/libs/DBConnect";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest) => {
    try {
        DBConnet();
        const { verified, file } = await req.json();
        console.log(file)
        // console.log(verified)

        // const existingUser = await userModel.findOne({ certificateId });
        // if (existingUser) {
        //     return NextResponse.json({ error: "Someone with the same certificate ID already exists" }, { status: 400 });
        // }
        const token: any = req.cookies.get("token");
        if (!token) {
            return NextResponse.json({ error: "Token not provided" }, { status: 400 });
        }
        // console.log(token)

        const decodedToken: any = jwt.decode(token.value,{complete: true});
        // console.log(decodedToken)
        if (!decodedToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        const id = decodedToken.payload.id;

        const realUser = await userModel.findOne({ _id: id });
        if (!realUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        realUser.isDonor = false
        await realUser.save();

        return NextResponse.json({ message: "User verified" }, { status: 200 });

    } catch (error) {
        console.error("Server Error in income validation: ", error);
        return NextResponse.json({ error: "Server Error in income validation" }, { status: 500 });
    }
};
