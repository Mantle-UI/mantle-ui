import { withBasePath } from '@/components/utils/utils';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                {/* eslint-disable */}
                <link href={withBasePath('/favicon.ico')} rel="icon" type="image/x-icon"></link>
                <link id="theme-link" href={withBasePath('/themes/lara-dark-cyan/theme.css')} rel="stylesheet"></link>
                <link id="home-table-link" href={withBasePath('/styles/landing/themes/lara-dark-cyan/theme.css')} rel="stylesheet"></link>
                <link rel="stylesheet" href={withBasePath('/styles/flags.css')}></link>
                <script src={withBasePath('/scripts/prism/prism.js')} data-manual></script>
                {/* eslint-enable */}
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
