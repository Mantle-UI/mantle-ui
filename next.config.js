const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGitHubPages ? '/mantle-ui' : '';

module.exports = {
    reactStrictMode: process.env.NODE_ENV === 'production' ? false : true,
    trailingSlash: true,
    output: isGitHubPages ? 'export' : undefined,
    assetPrefix: isGitHubPages ? `${basePath}/` : '',
    basePath,
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js'
            }
        }
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
