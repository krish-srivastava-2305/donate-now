import { DBConnet } from "@/libs/DBConnect";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import userModel from "@/models/user.model";
import requestModel from "@/models/requests.model";

export const DELETE = async (req : NextRequest): Promise<NextResponse> => {
    DBConnet()
    try {
        
        const { reqId } = await req.json()

        const token = req.cookies.get('token')
        if(!token) return NextResponse.json({error: "Token not found"}, {status: 400})

        const decodedToken = jwt.decode(token.value) as {id:string}
        if(!decodedToken) return NextResponse.json({error: "Problem in decoding token"}, {status: 400})

        const id = decodedToken.id 
        
        const request = await requestModel.findByIdAndDelete(reqId)
        if(!request) return NextResponse.json({error: "error deleting request"}, {status: 400})
        
        const user = await userModel.findOne({_id: id})
        if(!user) return NextResponse.json({error: "User not found"}, {status: 400})
        
        user.requests = user.requests.filter(id => id.toString() !== reqId);
        await user.save()
        
        return NextResponse.json({message: "req deleted"}, {status: 200})

    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({erro : error}, {status: 500})
    }
}