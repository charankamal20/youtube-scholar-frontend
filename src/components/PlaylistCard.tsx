"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "./ui/badge";

const PlaylistCardComponent = ({ playlist }: { playlist: PlaylistCard }  ) => {
  const { zenMode } = useStore();
  return zenMode ? (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-md">
      <AlertDialog>
        <AlertDialogTrigger>
          <Image
            src={playlist.thumbnail}
            alt="Card Image"
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="bg-gray-200 h-1 relative w-full">
            <div
              style={{
                width: playlist.progress + "%",
              }}
              className="absolute h-1 bg-red-500"
            ></div>
          </div>
          <CardContent className="border p-4 flex items-center justify-between">
            <div className="flex flex-col justify-start items-start">
              <h3 className="text-lg font-semibold line-clamp-1">
                {playlist.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {playlist.channel}
              </p>
            </div>
            <ArrowRightIcon className="size-4 text-muted-foreground" />
          </CardContent>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will exit the{" "}
              <Badge variant={"outline"}>Zen Mode</Badge>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>
              <Link target="_top" href={`/course?list=${playlist.id}`}>
                Continue
              </Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  ) : (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-md">
      <Link target="_top" href={`/course?list=${playlist.id}`}>
        <Image
          src={playlist.thumbnail}
          alt="Card Image"
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="bg-gray-200 h-1 relative w-full">
          <div
            style={{
              width: playlist.progress + "%",
            }}
            className="absolute h-1 bg-red-500"
          ></div>
        </div>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold line-clamp-1">
              {playlist.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {playlist.channel}
            </p>
          </div>
          <ArrowRightIcon className="size-4 text-muted-foreground" />
        </CardContent>
      </Link>
    </Card>
  );
};

export default PlaylistCardComponent;
