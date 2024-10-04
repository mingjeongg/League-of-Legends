/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
        // hostname이 뭐 localhost ~~ 면 port가 필요한데 지금은 필요 없다
        // port: "",
        // pathname: hostname으로 시작하는 모든 이미지를 허용하겠다
        // pathname: "/test/**"
        // hostname/test/로 시작하는 모든 이미지 허용하겠다
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
