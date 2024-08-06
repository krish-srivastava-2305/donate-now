import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { DBConnect } from "@/libs/DBConnect";
import jwt from "jsonwebtoken";

export const POST = async (req: NextRequest): Promise<any> => {
  await DBConnect();
  try {
    const { username, firstName, lastName, password, email } = await req.json();

    if (!username || !firstName || !lastName || !password || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User Already Exists" }, { status: 400 });
    }

    const saltRounds = 16;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);
    console.log(hashedPass);

    const verifyCode: number = Math.floor(Math.random() * 10000);
    const verifyCodeExpiry = Date.now() + 3600000 * 24; // 24 hours

    const newUser = await userModel.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPass,
      verifyCode,
      verifyCodeExpiry
    });

    const token = jwt.sign({ id: newUser._id, isDonor: false }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({ message: "New User Registered", verifyCode }, { status: 200 });
    response.cookies.set("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return response;

  } catch (error) {
    console.error("Problem registering user!", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};
