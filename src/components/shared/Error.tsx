import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorProps {
  message?: string | undefined;
  className?: string | undefined;
}

function Error({ message, className }: ErrorProps) {
  return (
    <div
      className={cn(`${
        message ? "flex" : "hidden"
      } capitalize border border-red-200 w-full text-red-500 p-3 text-sm justify-start gap-x-4 items-center rounded-md text-red bg-red-200/50`, className)}
    >
      <ExclamationTriangleIcon className="size-7 m-2" />
      {message}
    </div>
  );
}

export default Error;
