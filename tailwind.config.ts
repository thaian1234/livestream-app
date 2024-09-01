import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      // screens: {     //màn t lớn hơn 1400, cái này nó bị ảnh hưởng
      //   "2xl": "1400px",
      // },
    },
    fontSize: {
      'xxs': '0.6rem', // 10px
      'xs': '0.625rem',   // 12px 
      'sm': '0.875rem',  // 14px 
      'base': '1rem',    // 16px 
      'lg': '1.125rem',  // 18px
      'xl': '1.25rem',   // 20px 
      '2xl': '1.5rem',   // 24px 
      '3xl': '1.875rem', // 30px 
      '4xl': '2.25rem',  // 36px 
      '5xl': '3rem',     // 48px 
      '6xl': '3.75rem',  // 60px 
      '7xl': '4.5rem',   // 72px 
      '8xl': '6rem',     // 96px 
      '9xl': '8rem',     // 128px 
      '10xl': '10rem',   // 160px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    extend: {
      spacing: {
        // Các giá trị spacing mặc định
        1: '0.25rem',    // 4px
        2: '0.5rem',     // 8px
        3: '0.75rem',    // 12px
        4: '1rem',       // 16px
        5: '1.25rem',    // 20px
        6: '1.5rem',     // 24px
        8: '2rem',       // 32px
      },
      colors: {
        teal: {
          1: '#94FFD8',
          2: '#00B9AE',
          3: '#247881',
        },
        white: '#FFFFFF',
        gray: '#4D4D4D',
        black: "#000000",
        red: "#ef4444",
        //input: "#FFFFFF",
        //border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config;
