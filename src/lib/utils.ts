import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const strIncludeInsensitive = (target: string, str: string): boolean => {
    return str.toUpperCase().includes(target.toUpperCase());
};
