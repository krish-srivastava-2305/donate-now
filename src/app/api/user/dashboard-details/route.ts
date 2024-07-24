import { DBConnet } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    DBConnet();
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Token error" }, { status: 400 });

        const decodedToken = jwt.decode(token)
        console.log(decodedToken)
        if (!decodedToken) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

        const id = decodedToken.id;
        const user = await userModel.findById(id).select('-password')
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const details = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            imageUrl: user.certificateId,
            donated: user.donated,
            isDonor: user.isDonor
        }

        return NextResponse.json({ message: "Data Sent",details }, { status: 200 });
    } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json({ error: "Some error" }, { status: 500 });
    }
};
