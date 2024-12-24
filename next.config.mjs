/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    webpack(config) {
      config.module.rules.push({
        test: /\.svg$/, // Targets SVG files
        use: ['@svgr/webpack'], // Use the SVGR loader
      });
      return config;
    },
  };
  
  export default nextConfig;
  