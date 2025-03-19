/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Đảm bảo sử dụng App Router
  },
  output: "standalone", // Giúp deploy dễ dàng hơn trên Vercel
  revalidate: 0, // 🔥 Ngăn Next.js cache trang để tránh lỗi SSG
};

export default nextConfig;
