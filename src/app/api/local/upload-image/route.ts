import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(" ", "_");
    console.log(filename);

    const directory = path.join(process.cwd(), "public/assets/");
    // Ensure the directory exists
    await mkdir(directory, { recursive: true });

    await writeFile(path.join(directory, filename), buffer);

    return NextResponse.json({ Message: "Success", status: 201, filename });
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json({ Message: "Failed", status: 500, error: error });
  }
};