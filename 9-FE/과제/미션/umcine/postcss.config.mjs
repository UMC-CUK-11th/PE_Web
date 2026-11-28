// Vite에서는 @tailwindcss/vite 플러그인이 하던 일을 Next.js에서는 PostCSS 플러그인이 한다
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
