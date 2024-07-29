"use client";

import { LoginSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { api, auth_api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Suspense } from "react";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setxcsrfToken } = useStore();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });
  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    try {
      const response = await api.post("/login", {
        username: data.username,
        password: data.password,
      });

      const xsrfToken = response.headers["x-csrf-token"];
      setxcsrfToken(xsrfToken);
      const callback = searchParams.get("callback");
      if (callback) {
        router.replace(`/${callback}`);
      } else {
        router.replace("/");
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  const tryrestricted = async () => {
    console.log("HERE");
    try {
      const res = await auth_api.post("/restricted");
      console.log(res.data);
    } catch (error: any) {
      // console.log(error);
    }
  };
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex flex-col justify-between items-center w-full h-full">
        <header className="h-14 flex items-center mt-4 w-full px-6">
          <nav className="flex w-full justify-between">
            <Link
              href="/"
              className="flex items-center gap-x-2 justify-center"
              prefetch={false}
            >
              <GraduationCap />
              <span className="font-bold text-lg">Youtube Scholar</span>
            </Link>
            <Link
              className="flex items-center gap-x-1 justify-center"
              href={"/auth/register"}
            >
              <span className="font-light underline text-base">
                Create an account
              </span>
            </Link>
          </nav>
        </header>
        <Form {...form}>
          <div className="pb-24 w-full max-w-sm">
            <span className="text-4xl text-center w-full flex justify-center">
              Welcome back
            </span>
            <p className="text-center text-lg mb-6 mt-2 text-slate-600">
              Enter your account details below.
            </p>
            <hr className="my-4 " />
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-2"
            >
              {/* <Alert>
                      <BookOpenCheck className="h-4 w-4" />
                      <AlertTitle>Heads up!</AlertTitle>
                      <AlertDescription>
                      You can now make your notes public for the community.
                      </AlertDescription>
                      </Alert> */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                    You can quickly jump to a timestamp in the video from your
                    note.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pb-6 items-center">
                <Link
                  className="text-sm text-slate-800 underline font-medium"
                  href="/"
                >
                  Forgot Password
                </Link>
              </div>
              <Button className="w-full font-bold" type="submit">
                Login
              </Button>
            </form>
          </div>
        </Form>
        <div></div>
      </div>
      <div></div>
    </div>
  );
};

const Login = () => {
  return <Suspense><LoginPage /></Suspense>;
};

export default Login;
