interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT: {
    Player: any;
    PlayerState: any;
  };
}

type Note = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  timestampDisplay: string;
  // visibility: "public" | "private";
};

type TimeCapsule = {
  seconds: number;
  displayTime: string;
};

type PlaylistCard = {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
};
