import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/(protected)/form/utils/*.{js,ts,jsx,tsx,mdx}",
    "./app/(protected)/form/components/*.{js,ts,jsx,tsx,mdx}",
    "./app/\\(protected\\)/form/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
   safelist: [
    // === For StepNavigation & Active States ===
    // Backgrounds for step items
    'bg-blue-100',
    'bg-orange-50',
    'bg-blue-50',
    'bg-green-100',
    'bg-purple-100',
    'bg-orange-100',
    // Text colors for step items
    'text-blue-700',
    'text-green-700',
    'text-purple-700',
    'text-orange-700',

    // === For Main Navigation/Action Buttons & Progress Bar ===
    // Backgrounds
    'bg-blue-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-orange-600',
    // Hover Backgrounds
    'hover:bg-blue-700',
    'hover:bg-green-700',
    'hover:bg-purple-700',
    'hover:bg-orange-700',
    // Focus Rings (optional, but good for accessibility if you use them)
    'focus:ring-blue-400',
    'focus:ring-green-400',
    'focus:ring-purple-400',
    'focus:ring-orange-400',

    // === For InputRenderer select/checkbox active states (if different) ===
    // If these use the same colors as above, they are covered.
    // If they use specific shades like 'border-blue-500' or 'text-blue-600' when active:
    'border-blue-500', 'text-blue-600', // Example, add for other colors if used
    'border-green-500', 'text-green-600',
    'border-purple-500', 'text-purple-600',
    'border-orange-500', 'text-orange-600',

    // === You can also use patterns for more conciseness ===
    // This pattern covers bg-color-100, bg-color-600
    {
      pattern: /bg-(blue|green|purple|orange)-(100|600)/,
    },
    // This pattern covers text-color-700, text-color-600 (if used)
    {
      pattern: /text-(blue|green|purple|orange)-(600|700)/,
    },
    // This pattern covers hover:bg-color-700
    {
      pattern: /hover:bg-(blue|green|purple|orange)-700/,
    },
    // This pattern covers focus:ring-color-400
    {
      pattern: /focus:ring-(blue|green|purple|orange)-400/,
    },
    // This pattern covers border-color-500 (if used for active inputs)
    {
      pattern: /border-(blue|green|purple|orange)-500/,
    },
    // Add any other specific variants you might need.
    // For example, if your dot indicators for answered questions use specific green shades:
    'bg-green-500', // for answered question dots
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    require('@tailwindcss/forms'),
      require("tailwindcss-animate")
],
};
export default config;
