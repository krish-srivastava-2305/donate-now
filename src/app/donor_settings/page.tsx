"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import convertor from "@/libs/convertor";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Nav } from "@/components/Navbar";


export default function ValidationForm() {
  const router = useRouter();
  const [isDonor, setIsDonor] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isDonor) {
        router.push('/dashboard/donor');
        return;
      }

      if (!file) {
        setError("Please select a file");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      const validated = await convertor(fileUrl);

      if (!validated.verified) {
        setError("Income exceeded or not read");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const localUploadRes = await axios.post('/api/local/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (localUploadRes.data.status === 201) {
        const { filename } = localUploadRes.data;
        console.log("filename: ", filename)
        const validationRes = await axios.post('/api/user/income-validation', { verified: true });
        if (validationRes.status === 200) {
          toast.success("You are Validated!");
        }

        const cloudinaryRes = await axios.post("/api/cloudinary", {fileUri: `D:\\Projects\\innovate-new\\public\\assets\\${filename}`});

        if (cloudinaryRes.status === 200) {
          toast.success("File Uploaded");
          await axios.delete(`/api/local/delete?filename=${filename}`);
        }

        router.push('/products');
      }
    } catch (error) {
      setError("Validation failed. Please try again.");
      console.error("Error in submitting form: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDonor(e.target.checked);
  };

  return (
    <AuroraBackground>
      <Nav />
      <div className="h-full w-full bg-transparent flex justify-center items-center">
      <Toaster />
      <div className="z-10 max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Please validate yourself
        </h2>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer className="flex-row">
              <input className="w-4 h-4" id="donor" type="checkbox" defaultChecked={true} onChange={handleDonorChange} />
              <Label htmlFor="donor" className="font-bold text-pretty">Are you a donor?</Label>           
            </LabelInputContainer>
            </div>
            <div>
            {!isDonor && (
              <LabelInputContainer>
                <Label htmlFor="income-file">
                  Please upload your Income Certificate
                </Label>
                <Input id="income-file" type="file" onChange={handleFileChange} />
                <p className="text-xs font-extrabold p-2">Your Income Certificate will go under an OCR check which will verify that your annual family income is less than Rs. 2,50,000 and only then you are allowed to take benifits from our site.</p>
              </LabelInputContainer>
            )}
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer className="flex-row">
              <input className="w-8 h-4" id="donor" type="checkbox" defaultChecked={true} onChange={handleDonorChange} />
              <Label htmlFor="donor" className="text-xs font-bold text-pretty">Consent to use your email so that as a donor you can recieve a mail from concerned authorities and donation acquirer to send mail to owner.
              </Label>
            </LabelInputContainer>
            </div>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Validating..." : "Validate →"}
            <BottomGradient />
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
    </AuroraBackground>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex gap-4 flex-col space-y-2 w-full items-center", className)}>
      {children}
    </div>
  );
};
