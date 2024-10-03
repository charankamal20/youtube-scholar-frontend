"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YouTubePlayer from "@/components/VideoPlayer";
import {
  AlarmClock,
  Brain,
  Disc3,
  Hourglass,
  Link2,
  PartyPopper,
  Plus,
  RefreshCcw,
  Timer,
  TimerIcon,
  TvMinimalPlay,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import Error from "@/components/shared/Error";
import NoteCard from "@/components/NoteCard";
import { Separator } from "@/components/ui/separator";
import { auth_api, youtube_api } from "@/lib/api";
import PlaylistCardComponent from "@/components/PlaylistCard";
import { useStore } from "@/lib/store";
import TimerComponent from "@/components/Timer";
import PomodoroTimerComponent from "@/components/Pomodoro";
import AlarmComponent from "@/components/alarmComponent";
import { toast } from "sonner";
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
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

const CoursePageComponent = () => {
  const [open, setOpen] = useState(false);
  const [playlistLink, setPlaylistLink] = useState("");
  const playerRef = useRef<any>(null);
  const params = useSearchParams();
  const [listID, setListID] = useState<string>();
  const [error, setError] = useState<string | undefined>();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const { zenMode, toggleZenMode } = useStore();
  const [timerType, setTimerType] = useState<"pomodoro" | "timer" | "alarm">();
  const [notes, setNotes] = useState<Note[]>([]);
  const [playlistArr, setPlaylistArr] = useState<PlaylistCard[]>([]);

  //* Timer Component
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);

  //* Pomodoro Component
  const [cycleCount, setCycleCount] = useState(0);
  const [isWorkInterval, setIsWorkInterval] = useState(true);
  const [workMinutes, setWorkMinutes] = useState(0);
  const [longBreakMinutes, setLongBreakMinutes] = useState(0);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(0);

  const toggleInterval = () => {
    if (isWorkInterval) {
      setCycleCount((prev: any) => prev + 1);
      const breakMinutes =
        cycleCount + 1 >= cycleCount ? longBreakMinutes : shortBreakMinutes;

      setTimeLeft(breakMinutes * 60);
      setIsWorkInterval(false);
      setIsRunning(true);

      toast.success(`Break Started for ${breakMinutes} minutes!`);
    } else {
      toast.info(`Study Session started for ${workMinutes} minutes!`);
      setTimeLeft(workMinutes * 60);
      setIsWorkInterval(true);
      setIsRunning(true);
    }
  };

  const getUserNotesByPlaylist = async () => {
    try {
      const response = await auth_api.get(`/notes/user/${listID}`);
      if (response.status === 200) {
        console.log(response.data);
        if (response.data) {
          setNotes(response.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user notes:", error);
      toast.error("Failed to get user notes.");
    }
  };

  useEffect(() => {
    getUserPlaylists();

    if (listID !== undefined) {
      getUserNotesByPlaylist();
    }
  }, [listID]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev: any) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (timerType === "pomodoro") {
              toggleInterval();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timeLeft !== 0) {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    document.title = zenMode ? "Zen Mode" : "Youtube Scholar";
  }, [zenMode]);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const isValidUrl = (url: string) => {
    setError(undefined);
    try {
      const _url = new URL(url);
      if (
        _url.origin !== "https://www.youtube.com" &&
        _url.origin !== "https://youtube.com"
      ) {
        console.log("NOT YOUTUBE", url);
        setError((error) => "Please Enter a Youtube URL!");
        return false;
      }

      setError((error) => undefined);

      if (
        _url.searchParams.get("list") === null ||
        _url.searchParams.get("list") === ""
      ) {
        console.log("list not fount");
        setError((error) => "Please Enter a Valid Playlist URL!");
        return false;
      }

      setError((error) => undefined);
      return true;
    } catch (error) {
      return false;
    }
  };

  async function fetchPlaylistInfo(listid: string) {
    try {
      const response = await youtube_api.get("", {
        params: {
          part: "snippet",
          id: listid,
          key: process.env.NEXT_PUBLIC_YOUTUBE_DATA_API,
        },
      });
      const playlist = response.data.items[0];
      console.log(response.data);
      return {
        title: playlist.snippet.title,
        channel: playlist.snippet.channelTitle,
        thumbnail: playlist.snippet.thumbnails.medium.url,
      };
    } catch (error) {
      console.error("Failed to fetch playlist info:", error);
    }
  }

  const deleteNote = async (noteId: number) => {
    // delete note
    toast.loading("Deleting note...");
    try {
      await auth_api.delete(`/notes/user/${noteId}`);
      toast.dismiss();
      getUserNotesByPlaylist();
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete note");
    }
  };

  const getPlaylistData = async (listid: string) => {
    try {
      const data = await fetchPlaylistInfo(listid!);
      const response = {
        title: data?.title,
        channel: data?.channel,
        thumbnail: data?.thumbnail,
        id: listid!,
        url: playlistLink,
      };

      return response;
    } catch (error) {
      console.error("Failed to fetch playlist info:", error);
    }
  };

  const createEmbedLink = () => {
    if (playlistLink === "" || playlistLink == undefined) {
      return;
    }

    const urlObj = new URL(playlistLink);
    const params = new URLSearchParams(urlObj.search);

    let newEmbedLink: string = "https://www.youtube.com/embed/videoseries?";

    const siValue = params.get("si");
    if (siValue !== null && siValue !== undefined) {
      newEmbedLink = newEmbedLink + "si=" + siValue + "&";
    }

    const listValue = params.get("list");
    if (listValue !== null) {
      newEmbedLink = newEmbedLink + "list=" + listValue;
    }

    if (!isValidUrl(newEmbedLink)) {
      return;
    }

    //! Save this playlist to users playlists
    console.log(newEmbedLink);
    // setUrl(() => newEmbedLink);

    return listValue;
  };

  const jumpToTimestamp = (seconds: number) => {
    if (playerRef.current === null) {
      return;
    }
    playerRef.current.pauseVideo();
    playerRef.current.seekTo(seconds, true);
  };

  useEffect(() => {
    const playlistid = params.get("list");
    if (playlistid) {
      console.log(playlistid);
      setListID(playlistid);
      return;
    }

    setTimeout(() => {
      if (open === false) {
        setOpen(true);
      }
    }, 2000);
  }, []);

  const getUserPlaylists = async () => {
    try {
      const response = await auth_api.get("/playlist/user", {
        withCredentials: true,
      });

      if (response.status === 200) {
        const playlists = response.data;
        const playlist_Arr: PlaylistCard[] = [];
        playlists.forEach((playlist: any) => {
          playlist_Arr.push({
            id: playlist.playlist.playlist_id,
            title: playlist.playlist.title,
            url: playlist.playlist.url,
            channel: playlist.playlist.channel,
            thumbnail: playlist.playlist.thumbnail_url,
            progress: playlist.progress
          });
        });
        if (
          playlist_Arr.length > 0 &&
          playlistArr.length !== playlist_Arr.length
        ) {
          setPlaylistArr(playlist_Arr);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch user playlists:", error);
      toast.error("Failed to fetch user playlists.");
    }
  };

  const SubmitPlaylist = async (data: any) => {
    console.log(data);
    try {
      const response = await auth_api.post("/playlist/new", {
        title: data.title,
        url: data.url,
        playlist_id: data.id,
        thumbnail_url: data.thumbnail,
        channel: data.channel,
        videos: playerRef.current.getPlaylist()
      });
      toast.dismiss();
      if (response.status === 200) {
        toast.success("Playlist Added Successfully 🎉");
      }

      return true;
    } catch (error: any) {
      toast.dismiss();
      console.error("Failed to add playlist:", error);

      toast.error("Playlist Already Exists!");

      return false;
    }
  };

  const formSubmit = async (e: any) => {
    e.preventDefault();

    if (playlistLink == "" || playlistLink == undefined) {
      setError("Please enter a valid Youtube URL.");
      return;
    }

    if (!isValidUrl(playlistLink)) {
      setError("Please enter a valid Youtube URL.");
      return;
    } else {
      setError(undefined);
    }

    toast.loading("Adding Playlist...");

    setOpen(false);

    const listid = createEmbedLink();

    const playlistData = await getPlaylistData(listid!);

    const result = await SubmitPlaylist(playlistData);

    if (result) {
      setListID(listid!);
    }
  };

  const addNoteToPlaylist = async (data: any) => {
    try {
      const response = await auth_api.post("/notes/user", data);

      console.log(response);
      if (response.status === 200) {
        getUserNotesByPlaylist();
        toast.success("Note added successfully 🚀");
        return;
      }
    } catch (error) {
      toast.error("An error occured while adding note");
      console.log(error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Paste Youtube Playlist Link Below</DialogTitle>
            <DialogDescription>
              Copy the link for youtube playlist you want to watch and paste it
              below.
            </DialogDescription>
          </DialogHeader>
          <form onClick={formSubmit}>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Input
                  id="link"
                  value={playlistLink}
                  onChange={(e) => {
                    if (!isValidUrl(e.target.value)) {
                      setError("Please enter a valid Youtube URL.");
                    } else {
                      setError(undefined);
                    }
                    setPlaylistLink(e.target.value);
                  }}
                  placeholder="Paste YouTube Playlist Link Here"
                  type="url"
                  className="col-span-4"
                />
              </div>
              {error && <Error message={error} />}
            </div>
            <DialogFooter>
              <Button type="submit">Import Playlist</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="p-2 gap-2 w-full h-full grid grid-cols-[1fr_300px] grid-rows-[40px_1fr_52px]">
        <div className="row-start-1 gap-x-1 flex justify-between items-center col-start-1">
          <div className="flex justify-start items-center">
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant={"ghost"}
                  className="flex h-10 gap-x-1 animate-shimmer items-center justify-center rounded-md  px-4 font-medium text-slate-600 overflow-x-hidden transition-all group"
                >
                  <Brain className="h-4/5" />
                  <div className="w-0 overflow-x-hidden transition-all group-hover:w-16 duration-300">
                    <span className="text-nowrap">Zen Mode</span>
                  </div>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {zenMode
                      ? "You are doing great! 🎉"
                      : "You are about to enter the Zen Mode! 🧘‍♂️"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Stay focused without any distractions!
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      toggleZenMode(!zenMode);
                    }}
                  >
                    {zenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Dialog>
              <DialogTrigger>
                <Button
                  variant={"ghost"}
                  className="flex h-10 gap-x-1 items-center justify-center rounded-md px-4 font-medium text-slate-600 transition-all group"
                >
                  <div
                    className={`text-slate-600 ${
                      isRunning && timerType !== "pomodoro"
                        ? "group-hover:w-6 w-0 overflow-x-hidden"
                        : ""
                    } h-6 duration-500 flex justify-center items-center`}
                  >
                    {timerType === "timer" && <TimerIcon className="h-4/5" />}
                    {timerType === "alarm" && <AlarmClock className="h-4/5" />}
                    {isWorkInterval && <Hourglass className="h-4/5" />}
                    {timerType === "pomodoro" &&
                      !isWorkInterval &&
                      isRunning && <PartyPopper className="h-4/5" />}
                  </div>
                  <div
                    className={`overflow-x-hidden transition-all ${
                      isRunning ? "w-10" : "group-hover:w-20 w-0"
                    }
                    ${isRunning && timerType === "pomodoro" ? "w-32" : ""}
                    duration-300`}
                  >
                    {timerType === "pomodoro" && isRunning && (
                      <>
                        <span className="text-nowrap">
                          {isWorkInterval ? "Study Time: " : "Break Time: "}
                        </span>
                      </>
                    )}
                    {!isRunning ? (
                      <span className="text-nowrap">Set Timer</span>
                    ) : (
                      <span>{formatTime(timeLeft)}</span>
                    )}
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select a Timer.</DialogTitle>
                </DialogHeader>
                <div className="w-full">
                  <Tabs defaultValue="timer" className="w-full">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="timer">Timer</TabsTrigger>
                      <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                      <TabsTrigger value="alarm">Alarm</TabsTrigger>
                    </TabsList>
                    <TabsContent value="timer">
                      <TimerComponent
                        setTimerType={setTimerType}
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        timeLeft={timeLeft}
                        setTimeLeft={setTimeLeft}
                      />
                    </TabsContent>
                    <TabsContent value="pomodoro">
                      <PomodoroTimerComponent
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        timeLeft={timeLeft}
                        setTimeLeft={setTimeLeft}
                        setTimerType={setTimerType}
                        setShortBreakMinutes={setShortBreakMinutes}
                        setLongBreakMinutes={setLongBreakMinutes}
                        setWorkMinutes={setWorkMinutes}
                        setCycleCount={setCycleCount}
                        setIsWorkInterval={setIsWorkInterval}
                      />
                    </TabsContent>
                    <TabsContent value="alarm">
                      <AlarmComponent />
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button
            onClick={() => {
              setIsMusicPlaying(!isMusicPlaying);
            }}
            variant={"ghost"}
            className={`flex h-10 gap-x-1 items-center justify-center rounded-md  px-4 font-medium text-slate-600 transition-all group`}
          >
            <Disc3
              className={`${
                isMusicPlaying ? "animate-spin" : ""
              } duration-3000 h-4/5`}
            />
          </Button>
        </div>
        <div className="bg-white col-start-2 row-start-1 row-span-3 pb-[24%]">
          <Tabs defaultValue="resources" className="h-full w-[300px]">
            <TabsList className="grid my-1 grid-cols-2">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            <TabsContent className="px-0.5 h-full" value="resources">
              <div className="ring-1 ring-gray-300 rounded-lg h-full flex flex-col justify-start items-center text-gray-400 overflow-y-scroll your-scrollable-element">
                {notes.length ? (
                  notes.map((note) => {
                    return (
                      <>
                        <NoteCard
                          onDeleteNote={deleteNote}
                          jumpToTimestamp={jumpToTimestamp}
                          key={note.id}
                          note={note}
                        />
                        {/* <Separator className="my-2 w-11/12 mx-auto" /> */}
                      </>
                    );
                  })
                ) : (
                  <span>Add Notes and Resources.</span>
                )}
              </div>
            </TabsContent>
            <TabsContent className="px-0.5 h-full" value="videos">
              <div className="ring-1 p-2 ring-gray-300 rounded-lg h-full flex flex-col justify-between w-full text-gray-400">
                <div
                  className={`"h-full flex-1 overflow-y-scroll gap-y-1 flex flex-col ${
                    playlistArr.length ? "" : "justify-center"
                  } items-center"`}
                >
                  {playlistArr.length ? (
                    playlistArr.map((playlist) => (
                      <PlaylistCardComponent
                        key={playlist.id}
                        playlist={playlist}
                      />
                    ))
                  ) : (
                    <span className="text-center">
                      Your added playlists come here!
                    </span>
                  )}
                </div>
                <Separator className="my-2 w-11/12 mx-auto" />
                <Button
                  disabled={zenMode}
                  onClick={() => {
                    setPlaylistLink("");
                    setOpen(true);
                  }}
                  className="w-full gap-x-2"
                >
                  Add New Playlist
                  <RefreshCcw
                    strokeWidth={2.5}
                    absoluteStrokeWidth
                    className="size-4"
                  />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="relative aspect-video rounded-lg row-span-2 col-start-1 col-span-1 row-start-2">
          {!listID && (
            <div
              onClick={() => {
                setOpen(true);
              }}
              className="cursor-pointer w-full h-full  flex items-center justify-center rounded-lg border border-black border-dashed animate-pulse bg-slate-100 text-sm"
            >
              <div className="space-y-2">
                <TvMinimalPlay className="size-8 mx-auto " />
                <hr className="mx-4" />
                <h2 className="font-bold text-xl">
                  Click here to enter a new Youtube Playlist
                </h2>
              </div>
            </div>
          )}
          {listID && (
            // <iframe
            //   className="w-full h-full object-cover"
            //   src={url}
            //   title="Playlist"
            //   allow="accelerometer; clipboard-write; encrypted-media; gyroscope; web-share"
            //   referrerPolicy="strict-origin-when-cross-origin"
            //   allowFullScreen
            // ></iframe>
            <YouTubePlayer
              submitAddNote={addNoteToPlaylist}
              playerRef={playerRef}
              playlist_url={listID}
            />
          )}
        </div>
      </div>
    </>
  );
};

function CoursePage() {
  return (
    <Suspense>
      <CoursePageComponent />
    </Suspense>
  );
}

export default CoursePage;
