/**
 * Centralized theme configuration for all invoice layouts.
 * All colors are defined as hex codes for consistency with the backend email templates.
 */

export interface TemplateTheme {
  primary: string;
  secondary?: string;
  accent: string;
  text: {
    main: string;
    muted: string;
    light?: string;
  };
  bg: {
    main: string;
    card?: string;
    header?: string;
    footer?: string;
  };
  border: string;
  gradient?: {
    start: string;
    via?: string;
    end: string;
  };
}

export const TEMPLATE_THEMES: Record<string, TemplateTheme> = {
  standard: {
    primary: "#0F172A", // slate-900
    accent: "#64748B",  // slate-500
    text: {
      main: "#0F172A",
      muted: "#94A3B8", // slate-400
    },
    bg: {
      main: "#FFFFFF",
      header: "#F8FAFC", // slate-50
    },
    border: "#E2E8F0", // slate-200
  },
  minimal: {
    primary: "#1E293B", // slate-800
    accent: "#0F172A",
    text: {
      main: "#0F172A",
      muted: "#94A3B8",
    },
    bg: {
      main: "#FFFFFF",
    },
    border: "#E2E8F0",
  },
  botanical: {
    primary: "#14532D", // green-900
    secondary: "#166534", // green-800
    accent: "#2F7A50",
    text: {
      main: "#1C2C23",
      muted: "#5A6356",
      light: "#B5C4A1",
    },
    bg: {
      main: "#FCFDFB",
      card: "#2A3C24",
      footer: "#F3F4EE",
    },
    border: "rgba(20, 83, 45, 0.1)",
  },
  artisan: {
    primary: "#7C3AED", // violet-600
    accent: "#8B5CF6",  // violet-500
    text: {
      main: "#0F172A",
      muted: "#94A3B8",
      light: "#DDD6FE",
    },
    bg: {
      main: "#FFFFFF",
      card: "#FAF5FF",
    },
    border: "#EDE9FE",
    gradient: {
      start: "#7C3AED", // violet-600
      via: "#A855F7",   // purple-500
      end: "#D946EF",   // fuchsia-500
    },
  },
  studio: {
    primary: "#0F172A",
    secondary: "#0E7490", // cyan-700
    accent: "#0891B2",    // cyan-600
    text: {
      main: "#1E293B",
      muted: "#94A3B8",
    },
    bg: {
      main: "#FFFFFF",
      header: "#F8FAFC",
      card: "#ECFEFF",
    },
    border: "#F1F5F9",
  },
  corporate: {
    primary: "#0F1F3D",
    secondary: "#1E4DA1",
    accent: "#4A7BC4",
    text: {
      main: "#1E293B",
      muted: "#94A3B8",
    },
    bg: {
      main: "#FFFFFF",
      header: "#0F1F3D",
      card: "#F8FAFC",
    },
    border: "#E2E8F0",
  },
  luxury: {
    primary: "#3A4E3E",
    secondary: "#5A6356",
    accent: "#9FA89A",
    text: {
      main: "#3A4E3E",
      muted: "#7A8275",
      light: "#F5F4EE",
    },
    bg: {
      main: "#FCFBF8",
      card: "#F5F4EE",
      footer: "#1A2D22",
    },
    border: "#EAE8DD",
  },
  spa: {
    primary: "#E0B876", // gold
    secondary: "#2A3B31", // dark
    accent: "#E0B876",
    text: {
      main: "#1E293B",
      muted: "#94A3B8",
    },
    bg: {
      main: "#FAFAFA",
      card: "#FFFFFF",
    },
    border: "#F1F5F9",
  },
};
