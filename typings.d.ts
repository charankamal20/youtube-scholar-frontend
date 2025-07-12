interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT: {
    Player: any;
    PlayerState: any;
  };
}

type Note = {
  id: int;
  title: string;
  note_text: string;
  timestamp: number;
  timestampDisplay: string;
  video_id: string;
  playlist_id: string;
  // visibility: "public" | "private";
};

type TimeCapsule = {
  seconds: number;
  displayTime: string;
};

type PlaylistCard = {
  id: string;
  progress: int;
  title: string;
  thumbnail: string;
  channel: string;
  url: string;
};
