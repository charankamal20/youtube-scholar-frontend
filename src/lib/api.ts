import axios from "axios";

export const youtube_api = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/playlists",
  params: {
    key: process.env.YOUTUBE_DATA_API,
  },
});

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
});

export const auth_api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
});

auth_api.interceptors.response.use((response) => {
  console.log("in interceptors");
  const newXcsrfToken = response.headers["x-csrf-token"];
  if (typeof window !== "undefined") {
    localStorage.setItem("x-csrf-token", newXcsrfToken);
  }
  if (newXcsrfToken) {
    auth_api.defaults.headers["x-csrf-token"] = newXcsrfToken;
  }

  return response;
});
