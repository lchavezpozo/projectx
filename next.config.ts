/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Excluir seed.ts del build
  webpack: (config: any, { isServer }: any) => {
    if (isServer) {
      // Excluir archivos específicos del build
      config.externals = config.externals || [];
      config.externals.push({
        './prisma/seed': 'commonjs ./prisma/seed',
        './prisma/seed.ts': 'commonjs ./prisma/seed.ts',
      });
    }
    return config;
  },
};

export default nextConfig;
