const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages ? '/mantle-ui' : '';

module.exports = {
    reactStrictMode: process.env.NODE_ENV === 'production' ? false : true,
    trailingSlash: true,
    assetPrefix: isGitHubPages ? `${basePath}/` : '',
    basePath,
    publicRuntimeConfig: {
        appVersion: process.env.npm_package_version || '',
        basePath
    },
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack']
        });

        return config;
    },
    async redirects() {
        if (isGitHubPages) {
            return [];
        }

        return [
            {
                source: '/setup',
                destination: '/installation',
                permanent: true
            }
        ];
    }
};
