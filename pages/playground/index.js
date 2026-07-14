import { Button } from '@/components/lib/button/Button';
import sdk from '@stackblitz/sdk';
import Head from 'next/head';
import { getVite } from '@/components/doc/common/codeeditor/templates';

const createPlaygroundProject = () => {
    const { files, dependencies } = getVite(
        {
            title: 'Mantle UI Playground',
            description: 'Interactive Mantle UI playground powered by Vite and StackBlitz.',
            code: {
                typescript: `
import React from 'react';
import { Button } from '@mantle-ui/react/button';
import { Card } from '@mantle-ui/react/card';
import { InputText } from '@mantle-ui/react/inputtext';

export default function App() {
    return (
        <div className="card flex flex-column gap-3">
            <h2 className="m-0">Mantle UI Playground</h2>
            <p className="m-0">Edit the code and experiment with Mantle UI components directly in the browser.</p>
            <div className="flex flex-column gap-2 md:flex-row">
                <InputText placeholder="Try typing here" />
                <Button label="Primary action" />
            </div>
            <Card title="Starter card" subTitle="Vite + React + Mantle UI">
                <p className="m-0">This starter is generated from the Mantle UI docs project instead of pointing to an old PrimeReact StackBlitz sample.</p>
            </Card>
        </div>
        );
    }
                `
            }
        },
        'typescript'
    );

    const normalizedFiles = {};

    Object.entries(files).forEach(([key, value]) => {
        normalizedFiles[key] = typeof value.content === 'object' ? JSON.stringify(value.content, null, 2) : value.content;
    });

    return {
        title: 'Mantle UI Playground',
        template: 'node',
        description: 'Interactive Mantle UI playground powered by Vite and StackBlitz.',
        dependencies,
        files: normalizedFiles
    };
};

const PlayGround = () => {
    const openPlayground = () => {
        sdk.openProject(createPlaygroundProject(), {
            newWindow: true,
            openFile: ['src/App.tsx']
        });
    };

    return (
        <div>
            <Head>
                <title>Playground - MantleUI</title>
                <meta name="description" content="Experience Mantle UI right now with the interactive environment." />
            </Head>
            <div className="doc">
                <div className="doc-main">
                    <div className="doc-intro">
                        <h1>Playground</h1>
                        <p>Experience Mantle UI right now with the interactive environment.</p>
                    </div>
                    <section className="py-4">
                        <div className="surface-card border-1 surface-border border-round p-4 md:p-5" style={{ minHeight: '32rem' }}>
                            <div className="flex flex-column justify-content-center h-full gap-4">
                                <div>
                                    <h2 className="text-2xl mt-0 mb-3">Open the Mantle UI playground</h2>
                                    <p className="m-0 line-height-3">
                                        The interactive starter is generated from this repository and opened in StackBlitz in a separate tab. Embedded WebContainer editors require browser isolation headers that are not available on the GitHub Pages
                                        docs host.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Button label="Open in StackBlitz" icon="pi pi-external-link" onClick={openPlayground} />
                                </div>
                                <div className="surface-ground border-round p-3">
                                    <p className="mt-0 mb-2 font-semibold">What you get</p>
                                    <p className="m-0 line-height-3">A Vite + React + TypeScript starter with Mantle UI components prewired, so you can edit `src/App.tsx` immediately instead of loading an old PrimeReact sample.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PlayGround;
