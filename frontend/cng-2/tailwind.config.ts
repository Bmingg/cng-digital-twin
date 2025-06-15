import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		fontSize: {
			base: '14px',
		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			'brand': {
				"773775": '#737775',
				"979C9A": '#979c9a',
				"BDC3C0": '#bdc3c0',
				"E6EBE9": '#e6ebe9',
				"F1EDEA": '#f1edea',
				"BADFCD": '#badfcd',
			},
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
