import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { DBConnet } from "@/libs/DBConnect";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    DBConnet()
    try {
        const { username, firstName, lastName, password, email } = await req.json();

        if (!username || !firstName || !lastName || !password || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const user = await userModel.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return NextResponse.json({ error: "User Already Exists" }, { status: 400 });
        }

        const saltRounds = 16;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPass = await bcrypt.hash(password, salt);

        const verifyCode: number = Math.floor(Math.random() * 10000);
        const verifyCodeExpiry = Date.now() + 3600000; // 1 hour

        const newUser = await userModel.create({
            username,
            firstName,
            lastName,
            email,
            password: hashedPass,
            verifyCode,
            verifyCodeExpiry
        });

        return NextResponse.json({ message: "New User Registered" }, { status: 201 });

    } catch (error) {
        console.error("Problem registering user!", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
};
