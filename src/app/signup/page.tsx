"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verifyButton, setVerifyButton] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/api/user/signup', { username, firstName, lastName, password, email });
      
      if (res.status === 200) {
        const verifyCodeReal = res.data?.verifyCode;
        console.log(verifyCodeReal);
  
        const emailRes = await axios.post('/api/send', { 
          email, 
          verifyCode: verifyCodeReal, 
          firstName, 
          forVerification: true, 
          passwordRecoveryCode: "" 
        });
  
        if (emailRes.status === 200) {
          toast.success("Verification code sent to your email.");
          setVerifyButton(true);
        } else {
          setError("Failed to send verification email.");
        }
      } else {
        setError("Signup failed.");
      }
    } catch (error) {
      setError("Invalid Details");
      console.error("Error in submitting form: ", error);
    } finally {
      setLoading(false);
    }
  };
  

  const verifyCodeReq = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/user/verification', { verifyCode, email });
      if (res.status === 200) {
        toast.success("Code Verified");
        router.push("/donor_settings");
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
      console.error("Error in verifying code: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyChange = (e: React.ChangeEvent<HTMLInputElement>) => setVerifyCode(parseInt(e.target.value));
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value);
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <div className="h-full w-full bg-slate-800 flex justify-center items-center">
      <Toaster />
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Welcome to DonateNow
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          SignUp to DonateNow
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
            <LabelInputContainer>
              <Label htmlFor="username">Username: </Label>
              <Input id="username" placeholder="t_rex" type="text" onChange={handleUsernameChange} />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="Tyler" type="text" onChange={handleFirstNameChange} />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Durden" type="text" onChange={handleLastNameChange} />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="projectmayhem@fc.com" type="email" onChange={handleEmailChange} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type="password" onChange={handlePasswordChange} />
          </LabelInputContainer>

          <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up →"}
            <BottomGradient />
          </button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {verifyButton && (
            <>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="verifyCode">Verification Code: </Label>
                <Input id="verifyCode" type="number" onChange={handleVerifyChange} />
              </LabelInputContainer>

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                disabled={loading}
                onClick={verifyCodeReq}
              >
                {loading ? "Verifying..." : "Verify →"}
                <BottomGradient />
              </button>
            </>
          )}

          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </div>
    </div>
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
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
