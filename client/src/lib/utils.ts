import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// utility function to merge tailwind classes
// removes duplicates and handles conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
