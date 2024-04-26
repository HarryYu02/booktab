import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const strIncludeInsensitive = (target: string, str: string): boolean => {
    return str.toUpperCase().includes(target.toUpperCase());
};

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const faviconURL = (u: string) => {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    // console.log(url.toString());
    return url.toString();
};
