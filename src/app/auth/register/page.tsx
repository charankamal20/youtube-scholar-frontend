"use client";

import { RegisterSchema } from "@/schemas/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Register = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      const response = await api.post("/register", {
        username: data.username,
        email: data.email,
        password: data.password,
      });

      // const xsrfToken = response.headers["x-csrf-token"];
      // console.log(xsrfToken);

      // if (xsrfToken) {
      //   auth_api.defaults.headers.common["x-csrf-token"] = xsrfToken;
      // }

      toast.success("🎉 Registration successful");
      toast.loading("Redirecting to Login...")
      await new Promise((resolve) => setTimeout(resolve, 2000)).then(() => toast.dismiss());
      router.push("/auth/login");
    } catch (error: any) {
      console.log(error);
    }
  }

  const tryrestricted = async () => {
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
              href={"/auth/login"}
            >
              <span className="font-light underline text-base">
                Already have an account?
              </span>
            </Link>
          </nav>
        </header>
        <Form {...form}>
          <div className="pb-24 w-full max-w-sm">
            <span className="text-4xl text-nowrap text-center w-full flex justify-center">
              Welcome to Youtube Scholar
            </span>
            <p className="text-center text-lg mb-6 mt-2 text-slate-600">
              Create your new account.
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
                      <Input placeholder="arya_stark" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="arya.stark@winterfell.com"
                        {...field}
                      />
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
                      <Input placeholder="********" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                    You can quickly jump to a timestamp in the video from your
                    note.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pb-8 items-center"></div>
              <Button className="w-full font-bold" type="submit">
                Create Account
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

export default Register;
