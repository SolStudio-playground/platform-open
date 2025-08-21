import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string;
  }
  interface SimplePaletteColorOptions {
    lighter: string;
    darker: string;
  }
  interface PaletteColor {
    lighter: string;
    darker: string;
  }
}

// SETUP COLORS

const GREY = {
  0: '#FFFFFF',
  100: '#F8FAFC',
  200: '#F1F5F9',
  300: '#E2E8F0',
  400: '#CBD5E1',
  500: '#94A3B8',
  600: '#64748B',
  700: '#475569',
  800: '#334155',
  900: '#1E293B',
};

// Modern, vibrant color palettes
const PRIMARY = {
  lighter: '#818CF8', // Lighter indigo
  light: '#6366F1', // Indigo
  main: '#4F46E5', // Deep indigo
  dark: '#4338CA', // Darker indigo
  darker: '#3730A3', // Darkest indigo
  contrastText: '#FFFFFF',
};

const SECONDARY = {
  lighter: '#FBBF24', // Lighter amber
  light: '#F59E0B', // Amber
  main: '#D97706', // Orange
  dark: '#B45309', // Darker orange
  darker: '#92400E', // Darkest orange
  contrastText: '#FFFFFF',
};

const INFO = {
  lighter: '#60A5FA', // Lighter blue
  light: '#3B82F6', // Blue
  main: '#2563EB', // Deep blue
  dark: '#1D4ED8', // Darker blue
  darker: '#1E40AF', // Darkest blue
  contrastText: '#FFFFFF',
};

const SUCCESS = {
  lighter: '#34D399', // Lighter emerald
  light: '#10B981', // Emerald
  main: '#059669', // Deep emerald
  dark: '#047857', // Darker emerald
  darker: '#065F46', // Darkest emerald
  contrastText: '#FFFFFF',
};

const WARNING = {
  lighter: '#FCD34D', // Lighter yellow
  light: '#F59E0B', // Yellow
  main: '#D97706', // Orange
  dark: '#B45309', // Darker orange
  darker: '#92400E', // Darkest orange
  contrastText: '#FFFFFF',
};

const ERROR = {
  lighter: '#F87171', // Lighter red
  light: '#EF4444', // Red
  main: '#DC2626', // Deep red
  dark: '#B91C1C', // Darker red
  darker: '#991B1B', // Darkest red
  contrastText: '#FFFFFF',
};

// Common colors
const COMMON = {
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: alpha(GREY[500], 0.2),
  action: {
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export function palette(mode: 'light' | 'dark') {
  const light = {
    ...COMMON,
    mode: 'light',
    text: {
      primary: '#1E293B', // Modern dark blue
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    background: {
      paper: '#FFFFFF',
      default: '#F8FAFC', // Modern light blue-gray
      neutral: '#F1F5F9',
    },
    action: {
      ...COMMON.action,
      active: GREY[600],
    },
  };

  const dark = {
    ...COMMON,
    mode: 'dark',
    text: {
      primary: '#F8FAFC',
      secondary: GREY[400],
      disabled: GREY[600],
    },
    background: {
      paper: "#1E293B",
      default: '#0F172A', // Modern dark blue
      neutral: alpha(GREY[500], 0.12),
    },
    action: {
      ...COMMON.action,
      active: GREY[400],
    },
  };

  return mode === 'light' ? light : dark;
}