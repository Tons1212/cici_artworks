/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      turboMode: false, // Désactive Turbopack
    },
    images: {
      domains: ['xmobeyxirqmimvjfzisj.supabase.co'], // Remplace bien par ton vrai domaine Supabase
    },
  };
  
  export default nextConfig;
  
  
