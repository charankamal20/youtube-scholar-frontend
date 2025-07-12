"use client";
import {
  CheckCheck,
  NotebookPen,
  PlusIcon,
  RocketIcon,
  SkipBack,
  SkipForward,
  Youtube,
} from "lucide-react";
// pages/index.js
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FormSchema } from "@/schemas/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
// import { sampleNotes } from "@/data/constants";
import { useStore } from "@/lib/store";
import { auth_api } from "@/lib/api";
import { toast } from "sonner";
import Confetti from "./Confetti";
// import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
// import { Label } from "./ui/label";

const YouTubePlayer = ({
  playlist_url,
  playerRef,
  submitAddNote,
}: {
  submitAddNote: (data: any) => void;
  playlist_url: string;
  playerRef: MutableRefObject<any>;
}) => {
  const [progress, setProgress] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [percentLoaded, setPercentLoaded] = useState(0);
  const [currentTime, setCurrentTime] = useState<TimeCapsule>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { zenMode } = useStore();
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize YouTube Player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 0,
          listType: "playlist",
          list: playlist_url,
        },
        events: {
          onReady: onPlayerReady,
          onpause: () => {
            console.log("PAUSE");
          },
          onStateChange: onPlayerStateChange,
        },
      });
    };
    return () => {
      // Cleanup API script and player
      console.log("CLEARED");
      delete window.onYouTubeIframeAPIReady;
      // if (playerRef.current) {
      //   playerRef.current.destroy();
      // }
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [playlist_url]);

  const clearTrackingInterval = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const onPlayerReady = (event: any) => {
    console.log("Player is ready");
  };

  useEffect(() => {
    if (playerRef.current && percentLoaded !== 1) {
      const progress = playerRef.current.getVideoLoadedFraction();
      console.log(progress);
      setPercentLoaded(progress * 100);
    }
  }, [percentLoaded]);

  const stopTrackingProgress = () => {
    setProgress(0);
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      console.log("Video has ended");
      clearTrackingInterval();
      stopVideo();
      // Handle video end event (e.g., mark as watched)
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      if (playerRef.current.getVideoUrl() !== videoUrl) {
        setVideoUrl(playerRef.current.getVideoUrl());
      }
      startTrackingProgress();
    } else {
      clearTrackingInterval();
    }
  };

  const updateProgress = async () => {
    if (playerRef.current) {
      const playlistIndex = playerRef.current.getPlaylistIndex();
      try {
        const response = await auth_api.put(
          "/playlist/update/" + playlist_url + "?index=" + playlistIndex
        );
        if (response.status === 201) {
          toast.success("You just finished this Course 🎉");
        }
      } catch (error) {
        toast.error("Oops!", {
          description: "Some Error occured while updating your progress. 😣",
        });
      }
    }
  };

  const startTrackingProgress = () => {
    if (playerRef.current) {
      clearTrackingInterval();
      const duration = playerRef.current!.getDuration();
      intervalRef.current = window.setInterval(() => {
        const currentTime = playerRef.current!.getCurrentTime();
        const progressPercentage = (currentTime / duration) * 100;
        setProgress(progressPercentage);
        // if (progressPercentage >= 95.0) {
        //   return;
        // }
        if (currentTime >= duration - 5) {
          clearTrackingInterval();
          toast.success("You have completed the video 🎉");
          stopVideo();
          updateProgress()
            .then(() => {
              console.log("updated");
            })
            .catch(() => {
              console.log("Some error");
            });
          return;
        }
      }, 2000);
    }
  };

  const stopVideo = () => {
    playerRef.current?.stopVideo();
  };

  const playVideo = () => {
    if (playerRef.current) {
      console.log(typeof playerRef);
      playerRef.current.playVideo();
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
  };

  const nextVideo = () => {
    if (playerRef.current) {
      playerRef.current.nextVideo();
    }
  };

  const previousVideo = () => {
    if (playerRef.current) {
      playerRef.current.previousVideo();
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setDrawerOpen(false);
    form.reset();

    submitAddNote({
      title: data.title,
      note_text: data.note,
      timestamp: currentTime?.seconds,
      video_id: playerRef.current.getVideoData().video_id,
      playlist_id: playlist_url,
    });
    // toast({
    //   title: data.title,
    //   description: <p className="text-ellipsis line-clamp-2">{data.note}</p>,
    //   action: <CheckCheck />,
    // });
  }

  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hoursString = hours > 0 ? `${hours}h ` : "";
    const minutesString = minutes > 0 ? `${minutes}m ` : "";
    const secondsString = `${remainingSeconds}s`;

    return `${hoursString}${minutesString}${secondsString}`;
  }

  useEffect(() => {
    if (drawerOpen === true && playerRef.current !== null) {
      const currTime = Math.floor(playerRef.current!.getCurrentTime());
      setCurrentTime({
        displayTime: formatTime(currTime),
        seconds: currTime,
      });
    }
  }, [drawerOpen]);

  return (
    <>
      <div className="h-full overflow-hidden" id="player"></div>
      <div className="flex px-1 items-center justify-between py-2">
        <div className="relative">
          <div
            className={`h-full w-full absolute bg-background duration-500 ${
              zenMode ? "opacity-100 z-10" : "opacity-0 -z-10"
            }`}
          ></div>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={videoUrl}
            className="text-sm flex hover:underline transition-all group items-center gap-x-1"
          >
            <Youtube className="stroke-1" /> Visit Creator{" "}
            <ArrowTopRightIcon className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
          </Link>
        </div>
        <div className="flex items-center gap-x-2">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger className="">
              <Button
                onClick={() => {
                  pauseVideo();
                  setDrawerOpen(true);
                }}
                className="w-full space-x-2 active:scale-[.98]"
                variant={"default"}
              >
                <span className="font-semibold">Add Note</span>
                <PlusIcon size={20} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="w-full mx-auto max-w-lg">
                <DrawerHeader>
                  <DrawerTitle>
                    Add your note at {currentTime?.displayTime}.
                  </DrawerTitle>
                  <DrawerDescription>
                    Your Notes will be saved and can be accessed later.
                  </DrawerDescription>
                </DrawerHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
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
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <span>Title</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Note Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note Body</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Use this space to write your note."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            You can quickly jump to a timestamp in the video
                            from your note.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DrawerFooter className="flex">
                      <Button type="submit">Submit</Button>
                      <DrawerClose className="w-full">
                        <Button className="w-full" variant="outline">
                          Cancel
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </form>
                </Form>
              </div>
            </DrawerContent>
          </Drawer>
          <Button
            onClick={previousVideo}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-black space-x-2"
          >
            <SkipBack className="w-4 h-4" />
            <span className="font-medium">Previous</span>
          </Button>
          <Button
            onClick={nextVideo}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-black space-x-2"
          >
            <span className="font-medium">Next</span>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {confetti && <Confetti />}
    </>
  );
};

export default YouTubePlayer;
