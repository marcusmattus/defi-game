// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}', // For pages directory
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', // For app directory
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Add this if you have a src directory
  ],
  theme: {
    extend: {
      // ... your custom theme extensions ...
    },
  },
  plugins: [],
}
export default config;