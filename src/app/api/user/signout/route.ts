import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const token = req.cookies.get('token');
        if (!token) {
            return NextResponse.json({ error: 'Error signing out' }, { status: 400 });
        }

        const res = NextResponse.json({ message: "SignOut Success" }, { status: 200 });
        res.cookies.delete('token');
        return res;
    } catch (error) {
        console.error("Error Signing Out:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
};
