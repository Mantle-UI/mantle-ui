import sdk from '@stackblitz/sdk';
import { getVite } from '@/components/doc/common/codeeditor/templates';
import Head from 'next/head';
import { useEffect } from 'react';

const PlayGround = () => {
    useEffect(() => {
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
                    `
                }
            },
            'typescript'
        );

        const normalizedFiles = {};

        Object.entries(files).forEach(([key, value]) => {
            normalizedFiles[key] = typeof value.content === 'object' ? JSON.stringify(value.content, null, 2) : value.content;
        });

        sdk.embedProject(
            'playground-embed',
            {
                title: 'Mantle UI Playground',
                template: 'node',
                description: 'Interactive Mantle UI playground powered by Vite and StackBlitz.',
                dependencies,
                files: normalizedFiles
            },
            {
                openFile: 'src/App.tsx',
                view: 'default',
                height: '800px'
            }
        );
    }, []);

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
                        <div id="playground-embed" className="w-full h-full" style={{ border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '2px', minHeight: '800px' }} />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PlayGround;
