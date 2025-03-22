"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IUser } from "../register/page";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const Signin = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    reset({ email: "arthurmorgan@gmail.com", password: "Arthur12345" });
  }, []);

  async function submit(data: IUser) {
    const { email, password } = data;
    try {
      const result = await signIn("credentials", {
        callbackUrl: "/",
        redirect: false,
        email,
        password,
      });
      if (!result?.error) router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  const labelStyles = "text-[12px] font-semibold";
  const inputStyles =
    "text-sm border-[1px] rounded-full py-2 pl-3 focus:outline-none";
  const fieldStyles = "w-full flex-1 flex flex-col gap-1";
  const buttonStyles =
    "flex items-center justify-center gap-2 text-black rounded-full w-full py-3 hover:opacity-60";
  const errorStyles = "text-red-400 text-xs";

  return (
    <div className="h-full w-full flex max-h-screen ">
      <section className="flex-1 max-lg:hidden">Banner</section>
      <section className="flex-1 h-full">
        <div className="relative w-[80%] top-1/2 -translate-y-1/2 max-lg:mx-auto">
          <img src="Logo.svg" alt="Logo" />
          <h1 className="text-[24px] font-semibold text-center my-5">
            Hi! Welcome To Vaultify
          </h1>
          <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
            <div className={`${fieldStyles}`}>
              <label htmlFor="email" className={`${labelStyles}`}>
                Email
              </label>
              <input
                placeholder="JohnDoe@gmail.com"
                {...register("email")}
                type="text"
                className={`${inputStyles} `}
              />
              {errors.email && (
                <p className={`${errorStyles}`}>{errors.email.message}</p>
              )}
            </div>
            <div className={`${fieldStyles}`}>
              <label htmlFor="password" className={`${labelStyles}`}>
                password
              </label>
              <input
                placeholder="**********"
                {...register("password")}
                type="password"
                className={`${inputStyles} `}
              />
              {errors.password && (
                <p className={`${errorStyles}`}>{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              className={`${buttonStyles} ${labelStyles} bg-[#0F90ED] text-white mt-4`}
            >
              {isSubmitting ? "Loading..." : "Sign in"}
            </button>
            <div className="flex flex-col gap-2 text-sm text-center">
              <div className="text-sm">
                <span className="text-black/60">Create new acount?</span>
                <span
                  onClick={() => router.push("/register")}
                  className="underline hover:text-black/70 cursor-pointer"
                >
                  Register
                </span>
              </div>
              <span className="my-1">OR</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${buttonStyles} ${labelStyles} bg-[#F0ECEC] cursor-not-allowed`}
              >
                <FaGoogle size={20} />
                Google
              </button>
              <button
                onClick={async () => {
                  await signIn("github", { callbackUrl: "/" });
                }}
                type="button"
                className={`${buttonStyles} ${labelStyles} bg-[#F0ECEC]`}
              >
                <FaGithub size={20} />
                Github
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Signin;
