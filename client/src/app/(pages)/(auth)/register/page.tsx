"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { registerAPI } from "@/app/apiCalls/authAPI";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "firstName must be at least 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last Name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

const Register = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof registerSchema>>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { mutate } = useMutation({
    mutationFn: registerAPI,
    onSuccess: (data) => {
      router.push("/sign-in");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function submit(data: IUser) {
    mutate(data);
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
            <div className="flex justify-between gap-2">
              <div className={`${fieldStyles}`}>
                <label htmlFor="firstName" className={`${labelStyles}`}>
                  First Name
                </label>
                <input
                  placeholder="John"
                  {...register("firstName")}
                  type="text"
                  className={`${inputStyles} `}
                />
                {errors.firstName && (
                  <p className={`${errorStyles}`}>{errors.firstName.message}</p>
                )}
              </div>
              <div className={`${fieldStyles}`}>
                <label htmlFor="lastName" className={`${labelStyles}`}>
                  Last Name
                </label>
                <input
                  placeholder="Doe"
                  {...register("lastName")}
                  type="text"
                  className={`${inputStyles}`}
                />
                {errors.lastName && (
                  <p className={`${errorStyles}`}>{errors.lastName.message}</p>
                )}
              </div>
            </div>
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
              {isSubmitting ? "Loading..." : "Register"}
            </button>
            <div className="flex flex-col gap-2 text-sm text-center">
              <div className="text-sm">
                <span className="text-black/60">Already have an acount?</span>
                <span
                  onClick={() => router.push("/sign-in")}
                  className="underline hover:text-black/70 cursor-pointer"
                >
                  Sign in
                </span>
              </div>
              <span className="my-1">OR</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`${buttonStyles} ${labelStyles} bg-[#F0ECEC]`}
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

export default Register;
