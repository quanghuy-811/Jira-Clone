import nookies from "nookies";
import { clsx } from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const setCookies = (name, value, options = {}) => {
  value = JSON.stringify(value);
  Cookies.set(name, value, { httpOnly: false });
};

export const removeCookies = (name) => {
  return Cookies.remove(name);
};

// Lấy cookies trên client
export const getClientAuthToken = (name) => {
  const value = Cookies.get(name);
  if (!value) return "";

  return JSON.parse(value) || "";
};
// Lấy cookies trên server
export const getServerAuthToken = async (key) => {
  const { cookies } = require("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get(key)?.value || "";
  return token;
};
