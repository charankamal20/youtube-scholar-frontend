"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YouTubePlayer from "@/components/VideoPlayer";
import {
  AlarmClock,
  Brain,
  Disc3,
  Hourglass,
  LucideFastForward,
  PartyPopper,
  RefreshCcw,
  Timer,
  TimerIcon,
  TvMinimalPlay,
} from "lucide-react";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
import { auth_api, youtube_api } from "@/lib/api";
import { Separator } from "@/components/ui/separator";
import PlaylistCardComponent from "@/components/PlaylistCard";
import NoteCard from "@/components/NoteCard";

type TimerType = "pomodoro" | "timer" | "alarm";

// Custom hooks
const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  }, []);

  const startTimer = useCallback(() => setIsRunning(true), []);
  const pauseTimer = useCallback(() => setIsRunning(false), []);
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  return {
    timeLeft,
    setTimeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
  };
};

const usePomodoro = () => {
  const [cycleCount, setCycleCount] = useState(0);
  const [isWorkInterval, setIsWorkInterval] = useState(true);
  const [workMinutes, setWorkMinutes] = useState(25);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);

  const toggleInterval = useCallback(() => {
    if (isWorkInterval) {
      setCycleCount((prev) => prev + 1);
      const breakMinutes =
        (cycleCount + 1) % 4 === 0 ? longBreakMinutes : shortBreakMinutes;
      setIsWorkInterval(false);
      toast.success(`Break Started for ${breakMinutes} minutes!`);
      return breakMinutes * 60;
    } else {
      toast.info(`Study Session started for ${workMinutes} minutes!`);
      setIsWorkInterval(true);
      return workMinutes * 60;
    }
  }, [
    isWorkInterval,
    cycleCount,
    longBreakMinutes,
    shortBreakMinutes,
    workMinutes,
  ]);

  return {
    cycleCount,
    setCycleCount,
    isWorkInterval,
    setIsWorkInterval,
    workMinutes,
    setWorkMinutes,
    longBreakMinutes,
    setLongBreakMinutes,
    shortBreakMinutes,
    setShortBreakMinutes,
    toggleInterval,
  };
};

const usePlaylist = () => {
  const [playlistLink, setPlaylistLink] = useState("");
  const [listID, setListID] = useState<string>();
  const [error, setError] = useState<string>();
  const [playlistArr, setPlaylistArr] = useState<PlaylistCard[]>([]);

  const isValidUrl = useCallback((url: string) => {
    setError(undefined);

    if (!url.trim()) {
      setError("Please enter a valid YouTube URL.");
      return false;
    }

    try {
      const _url = new URL(url);

      if (!_url.hostname.includes("youtube.com")) {
        setError("Please Enter a YouTube URL!");
        return false;
      }

      const listParam = _url.searchParams.get("list");
      if (!listParam) {
        setError("Please Enter a Valid Playlist URL!");
        return false;
      }

      return true;
    } catch {
      setError("Please enter a valid URL.");
      return false;
    }
  }, []);

  const extractPlaylistId = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("list");
    } catch {
      return null;
    }
  }, []);

  const fetchPlaylistInfo = useCallback(async (listId: string) => {
    try {
      const response = await youtube_api.get("", {
        params: {
          part: "snippet",
          id: listId,
          key: process.env.NEXT_PUBLIC_YOUTUBE_DATA_API,
        },
      });

      const playlist = response.data.items[0];
      return {
        title: playlist.snippet.title,
        channel: playlist.snippet.channelTitle,
        thumbnail: playlist.snippet.thumbnails.medium.url,
      };
    } catch (error) {
      console.error("Failed to fetch playlist info:", error);
      throw error;
    }
  }, []);

  const getUserPlaylists = useCallback(async () => {
    try {
      const response = await auth_api.get("/playlist", {
        withCredentials: true,
      });
      console.log("User Playlists Response:", response.data);
      if (response.status === 200) {
        if (response.data == null || response.data.length === 0) {
          toast.dismiss();
          return;
        }

        const playlists: PlaylistCard[] = response.data.map(
          (playlist: any) => ({
            id: playlist.playlist_id,
            title: playlist.title,
            url: playlist.url,
            channel: playlist.channel,
            thumbnail: playlist.thumbnail_url,
            progress: 0, // TODO!
          })
        );

        setPlaylistArr(playlists);
      }
    } catch (error) {
      console.error("Failed to fetch user playlists:", error);
      toast.error("Failed to fetch user playlists.");
    }
  }, []);

  const submitPlaylist = useCallback(async (data: any, playerRef: any) => {
    try {
      const response = await auth_api.post("/playlist", {
        title: data.title,
        url: data.url,
        playlist_id: data.id,
        thumbnail_url: data.thumbnail,
        channel: data.channel,
        // videos: playerRef.current.getPlaylist(),
      });

      if (response.status === 200) {
        toast.success("Playlist Added Successfully 🎉");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Failed to add playlist:", error);
      toast.error("Playlist Already Exists!");
      return false;
    }
  }, []);

  return {
    playlistLink,
    setPlaylistLink,
    listID,
    setListID,
    error,
    setError,
    playlistArr,
    setPlaylistArr,
    submitPlaylist,
    isValidUrl,
    extractPlaylistId,
    fetchPlaylistInfo,
    getUserPlaylists,
  };
};

const useNotes = (listID?: string) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const getUserNotesByPlaylist = useCallback(async () => {
    if (!listID) return;

    try {
      const response = await auth_api.get(`/notes/user/${listID}`);
      if (response.status === 200 && response.data) {
        setNotes(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user notes:", error);
      toast.error("Failed to get user notes.");
    }
  }, [listID]);

  const deleteNote = useCallback(
    async (noteId: number) => {
      const loadingToast = toast.loading("Deleting note...");

      try {
        await auth_api.delete(`/notes/user/${noteId}`);
        toast.dismiss(loadingToast);
        await getUserNotesByPlaylist();
        toast.success("Note deleted successfully");
      } catch (error) {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete note");
      }
    },
    [getUserNotesByPlaylist]
  );

  const addNoteToPlaylist = useCallback(
    async (data: any) => {
      try {
        const response = await auth_api.post("/notes/user", data);

        if (response.status === 200) {
          await getUserNotesByPlaylist();
          toast.success("Note added successfully 🚀");
        }
      } catch (error) {
        toast.error("An error occurred while adding note");
        console.error(error);
      }
    },
    [getUserNotesByPlaylist]
  );

  useEffect(() => {
    getUserNotesByPlaylist();
  }, [getUserNotesByPlaylist]);

  return {
    notes,
    deleteNote,
    addNoteToPlaylist,
    getUserNotesByPlaylist,
  };
};

const CoursePageComponent = () => {
  // State management
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [timerType, setTimerType] = useState<TimerType>();

  // Refs
  const playerRef = useRef<any>(null);

  // Hooks
  const params = useSearchParams();
  const { zenMode, toggleZenMode } = useStore();
  const timer = useTimer();
  const pomodoro = usePomodoro();
  const playlist = usePlaylist();
  const notes = useNotes(playlist.listID);

  // Memoized values
  const timerIcon = useMemo(() => {
    if (timerType === "timer") return <TimerIcon className="h-4/5" />;
    if (timerType === "alarm") return <AlarmClock className="h-4/5" />;
    if (pomodoro.isWorkInterval) return <Hourglass className="h-4/5" />;
    if (
      timerType === "pomodoro" &&
      !pomodoro.isWorkInterval &&
      timer.isRunning
    ) {
      return <PartyPopper className="h-4/5" />;
    }
    return <Timer className="h-4/5" />;
  }, [timerType, pomodoro.isWorkInterval, timer.isRunning]);

  const timerText = useMemo(() => {
    if (timerType === "pomodoro" && timer.isRunning) {
      return pomodoro.isWorkInterval ? "Study Time: " : "Break Time: ";
    }
    if (!timer.isRunning) return "Set Timer";
    return timer.formatTime(timer.timeLeft);
  }, [
    timerType,
    timer.isRunning,
    timer.timeLeft,
    pomodoro.isWorkInterval,
    timer.formatTime,
  ]);

  // Effects
  useEffect(() => {
    const playlistId = params.get("list");
    if (playlistId) {
      playlist.setListID(playlistId);
    } else {
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [params, playlist.setListID]);

  useEffect(() => {
    playlist.getUserPlaylists();
  }, [playlist.getUserPlaylists]);

  useEffect(() => {
    document.title = zenMode ? "Zen Mode" : "YouTube Scholar";
  }, [zenMode]);

  // Pomodoro timer integration
  useEffect(() => {
    if (timer.timeLeft === 0 && timer.isRunning && timerType === "pomodoro") {
      const newTime = pomodoro.toggleInterval();
      timer.setTimeLeft(newTime);
    }
  }, [
    timer.timeLeft,
    timer.isRunning,
    timerType,
    pomodoro.toggleInterval,
    timer.setTimeLeft,
  ]);

  // Handlers
  const handlePlaylistSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (
        !playlist.playlistLink ||
        !playlist.isValidUrl(playlist.playlistLink)
      ) {
        playlist.setError("Please enter a valid YouTube URL.");
        return;
      }

      const listId = playlist.extractPlaylistId(playlist.playlistLink);
      if (!listId) {
        console.error("Invalid playlist URL:", playlist.playlistLink);
        playlist.setError("Invalid playlist URL");
        return;
      }
      playlist.setListID(listId);
      setOpen(false);

      const playlistInfo = await playlist.fetchPlaylistInfo(
        playlist.listID ? playlist.listID : ""
      );

      const playlistData = {
        title: playlistInfo.title,
        channel: playlistInfo.channel,
        thumbnail: playlistInfo.thumbnail,
        id: playlist.listID,
        url: playlist.playlistLink,
      };

      const loadingToast = toast.loading("Adding Playlist...");
      // Submit to server
      const success = await playlist.submitPlaylist(playlistData, playerRef);

      if (success) {
        await playlist.getUserPlaylists(); // Refresh playlist list
      }

      toast.dismiss(loadingToast);
    },
    [playlist, playerRef]
  );

  const handleJumpToTimestamp = useCallback((seconds: number) => {
    if (!playerRef.current) return;

    playerRef.current.pauseVideo();
    playerRef.current.seekTo(seconds, true);
  }, []);

  const handleZenModeToggle = useCallback(() => {
    toggleZenMode(!zenMode);
  }, [zenMode, toggleZenMode]);

  return (
    <>
      {/* Playlist Import Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import YouTube Playlist</DialogTitle>
            <DialogDescription>
              Paste the YouTube playlist link below to get started with your
              study session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePlaylistSubmit}>
            <div className="grid gap-4 py-4">
              <Input
                id="link"
                value={playlist.playlistLink}
                onChange={(e) => playlist.setPlaylistLink(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=..."
                type="url"
                className="w-full"
                required
              />
              {playlist.error && <Error message={playlist.error} />}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={!playlist.playlistLink}>
                Import Playlist
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Layout */}
      <div className="w-full flex flex-col h-screen">
        {/* Header */}
        <header className="border-b flex h-14 justify-between items-center col-span-full lg:col-span-1">
          <div className="flex items-center gap-2">
            {/* Zen Mode Toggle */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Zen Mode</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {zenMode ? "Exit Zen Mode?" : "Enter Zen Mode?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {zenMode
                      ? "You'll be able to access all features again."
                      : "Hide distractions and focus on your study session."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleZenModeToggle}>
                    {zenMode ? "Exit" : "Enter"} Zen Mode
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Timer Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  {timerIcon}
                  <span className="hidden sm:inline min-w-0">{timerText}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Study Timer</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="timer" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="timer">Timer</TabsTrigger>
                    <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
                    <TabsTrigger value="alarm">Alarm</TabsTrigger>
                  </TabsList>
                  <TabsContent value="timer">
                    <TimerComponent
                      setTimerType={setTimerType}
                      isRunning={timer.isRunning}
                      setIsRunning={(running) =>
                        running ? timer.startTimer() : timer.pauseTimer()
                      }
                      timeLeft={timer.timeLeft}
                      setTimeLeft={timer.setTimeLeft}
                    />
                  </TabsContent>
                  <TabsContent value="pomodoro">
                    <PomodoroTimerComponent
                      isRunning={timer.isRunning}
                      setIsRunning={(running) =>
                        running ? timer.startTimer() : timer.pauseTimer()
                      }
                      timeLeft={timer.timeLeft}
                      setTimeLeft={timer.setTimeLeft}
                      setTimerType={setTimerType}
                      setShortBreakMinutes={pomodoro.setShortBreakMinutes}
                      setLongBreakMinutes={pomodoro.setLongBreakMinutes}
                      setWorkMinutes={pomodoro.setWorkMinutes}
                      setCycleCount={pomodoro.setCycleCount}
                      setIsWorkInterval={pomodoro.setIsWorkInterval}
                    />
                  </TabsContent>
                  <TabsContent value="alarm">
                    <AlarmComponent />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Music Toggle */}
          <div>
            <Button
              onClick={() => setIsMusicPlaying(!isMusicPlaying)}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 transition-colors"
            >
              <Disc3
                className={`h-4 w-4 ${isMusicPlaying ? "animate-spin" : ""}`}
              />
            </Button>

            <Button
              onClick={() => setSheetOpen(!sheetOpen)}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <LucideFastForward className={`h-4 w-4 rotate-180`} />
            </Button>
          </div>
        </header>

        {/* Video Player */}
        {/* <div className="relative bg-gray-100 h-full overflow-hidden">
          {!playlist.listID ? (
            <div
              onClick={() => setOpen(true)}
              className="cursor-pointer w-full h-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className="text-center space-y-4">
                <TvMinimalPlay className="h-16 w-16 mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold">
                    No playlist selected
                  </h2>
                  <p className="text-sm">Click to add a YouTube playlist</p>
                </div>
              </div>
            </div>
          ) : (
            <YouTubePlayer
              submitAddNote={notes.addNoteToPlaylist}
              playerRef={playerRef}
              playlist_url={playlist.listID}
            />
          )}
        </div> */}
        <div className="relative h-full flex flex-col">
          {!playlist.listID && (
            <div
              onClick={() => setOpen(true)}
              className="cursor-pointer w-full h-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <div className="text-center space-y-4">
                <TvMinimalPlay className="h-16 w-16 mx-auto" />
                <div>
                  <h2 className="text-xl font-semibold">
                    No playlist selected
                  </h2>
                  <p className="text-sm">Click to add a YouTube playlist</p>
                </div>
              </div>
            </div>
          )}
          {playlist.listID && (
            <YouTubePlayer
              submitAddNote={notes.addNoteToPlaylist}
              playerRef={playerRef}
              playlist_url={playlist.listID}
            />
          )}
        </div>

        {/* Sidebar */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                You can find your playlists and Notes here
              </SheetTitle>
              <SheetDescription className="h-full flex flex-col">
                <div className="bg-white h-20 rounded-lg border">
                  <Tabs defaultValue="notes" className="h-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="playlists">Playlists</TabsTrigger>
                    </TabsList>

                    <TabsContent value="notes" className="p-4 h-full">
                      <div className="h-full overflow-y-auto space-y-2">
                        {notes.notes.length > 0 ? (
                          notes.notes.map((note) => (
                            <NoteCard
                              key={note.id}
                              note={note}
                              onDeleteNote={notes.deleteNote}
                              jumpToTimestamp={handleJumpToTimestamp}
                            />
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <p>No notes yet. Start taking notes!</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="playlists" className="p-4 h-full">
                      <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                          {playlist.playlistArr.length}
                          {playlist.playlistArr.length > 0 ? (
                            playlist.playlistArr.map((playlistItem) => (
                              <PlaylistCardComponent
                                key={playlistItem.id}
                                playlist={playlistItem}
                              />
                            ))
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              <p>No playlists added yet</p>
                            </div>
                          )}
                        </div>

                        <Separator className="my-4" />

                        <Button
                          onClick={() => {
                            playlist.setPlaylistLink("");
                            setOpen(true);
                          }}
                          disabled={zenMode}
                          className="w-full"
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Add Playlist
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        {/*  */}
      </div>
    </>
  );
};

function CoursePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoursePageComponent />
    </Suspense>
  );
}

export default CoursePage;
