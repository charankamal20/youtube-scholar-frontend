import { create } from "zustand";

type Store = {
  xcsrfToken: string;
  setxcsrfToken: (value: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  zenMode: boolean;
  toggleZenMode: (value: boolean) => void;
};

export const useStore = create<Store>()((set) => {
  let token;
  let loggedin;

  if (typeof window !== "undefined") {
    loggedin = true;
    token = localStorage.getItem("x-csrf-token");
  }

  return {
    xcsrfToken: token || "",
    setxcsrfToken(value) {
      if (typeof window !== "undefined") {
        localStorage.setItem("x-csrf-token", value);
      }
      set(() => ({ xcsrfToken: value, isLoggedIn: true }));
    },
    isLoggedIn: loggedin || false,
    zenMode: false,
    toggleZenMode(value) {
      set(() => ({ zenMode: value }));
    },
    setIsLoggedIn(value: boolean) {
      set(() => ({ isLoggedIn: value }));
    },
  };
});
