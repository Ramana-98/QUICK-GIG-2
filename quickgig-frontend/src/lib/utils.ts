import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to detect if background is dark or light
export function getBackgroundBrightness(element?: HTMLElement): 'light' | 'dark' {
  if (!element) {
    // Default to checking body background
    element = document.body
  }
  
  const computedStyle = window.getComputedStyle(element)
  const backgroundColor = computedStyle.backgroundColor
  
  // Parse RGB values from background color
  const rgb = backgroundColor.match(/\d+/g)
  if (!rgb || rgb.length < 3) {
    // If no background color or transparent, check parent or default to light
    return 'light'
  }
  
  const [r, g, b] = rgb.map(Number)
  
  // Calculate relative luminance using the formula for perceived brightness
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  return luminance > 0.5 ? 'light' : 'dark'
}

// Get adaptive colors based on background
export function getAdaptiveColors(isDark: boolean = false) {
  return {
    // Text colors
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      muted: isDark ? 'text-gray-400' : 'text-gray-500',
    },
    // Background colors
    bg: {
      primary: isDark ? 'bg-gray-800' : 'bg-white',
      secondary: isDark ? 'bg-gray-700' : 'bg-gray-50',
      hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
      active: isDark ? 'bg-gray-600' : 'bg-gray-200',
    },
    // Border colors
    border: {
      primary: isDark ? 'border-gray-600' : 'border-gray-200',
      secondary: isDark ? 'border-gray-700' : 'border-gray-300',
    },
    // Icon colors
    icon: {
      primary: isDark ? 'text-white' : 'text-gray-700',
      secondary: isDark ? 'text-gray-300' : 'text-gray-500',
      active: isDark ? 'text-blue-400' : 'text-blue-600',
    }
  }
}

// Hook-like function to get current background brightness
export function useBackgroundBrightness(): 'light' | 'dark' {
  const brightness = getBackgroundBrightness()
  return brightness
}
