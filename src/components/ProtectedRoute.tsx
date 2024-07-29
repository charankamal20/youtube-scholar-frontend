"use client";

import { auth_api } from "@/lib/api";
import { useStore } from "@/lib/store";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({
  children,
  callback,
}: //   route,
{
  children: React.ReactNode;
  //   route: string;
  callback: string;
}) => {
  const { xcsrfToken } = useStore();
  const router = useRouter();

  if (xcsrfToken === "") {
    router.replace(`/auth/login?${callback}`)
    return null;
  }

  auth_api.defaults.headers.common["x-csrf-token"] = xcsrfToken;
  return <>{children}</>;
};

export default ProtectedRoute;
