import Typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [Typography],
};
