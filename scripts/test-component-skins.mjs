import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const availableGroups = ['containers', 'data', 'navigation', 'feedback', 'media', 'controls', 'advanced', 'states'];
const selected = process.env.MANTLE_TEST_GROUP;

if (selected && !availableGroups.includes(selected)) {
    throw new Error(`Unknown component test group: ${selected}`);
}

const groups = selected ? [selected] : availableGroups;
const temporary = await mkdtemp(path.join(tmpdir(), 'mantle-skin-reports-'));
const reports = [];

try {
    for (const group of groups) {
        const reportPath = process.env.MANTLE_TEST_REPORT && selected ? process.env.MANTLE_TEST_REPORT : process.env.MANTLE_TEST_REPORT ? `${process.env.MANTLE_TEST_REPORT}.${group}.json` : path.join(temporary, `${group}.json`);
        const run = await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, [path.join(import.meta.dirname, 'test-portal-theming.mjs'), 'component-skins.jsx'], {
                env: { ...process.env, MANTLE_TEST_GROUP: group, MANTLE_TEST_REPORT: reportPath },
                windowsHide: true
            });
            let errors = '';

            child.stdout.resume();
            child.stderr.on('data', (chunk) => (errors += chunk));
            child.on('error', reject);
            child.on('close', (code) => resolve({ code, errors }));
        });
        const report = await readFile(reportPath, 'utf8')
            .then(JSON.parse)
            .catch(() => ({ passed: false, error: run.errors.slice(-4000), assertions: [] }));

        reports.push({ group, ...report, passed: run.code === 0 && report.passed });
        process.stdout.write(`${group}: ${report.passed && run.code === 0 ? 'passed' : 'failed'} (${report.assertions.length} assertions)\n`);

        if (run.code !== 0) {
            process.stderr.write(`${report.error || run.errors.slice(-4000)}\n`);
        }
    }

    const aggregate = {
        passed: reports.every((report) => report.passed),
        groups: reports.map(({ group, passed, assertions, error }) => ({ group, passed, count: assertions.length, error })),
        assertions: reports.flatMap(({ group, assertions }) => assertions.map((assertion) => ({ ...assertion, name: `${group}: ${assertion.name}` })))
    };

    if (process.env.MANTLE_TEST_REPORT && !selected) {
        await writeFile(process.env.MANTLE_TEST_REPORT, JSON.stringify(aggregate, null, 2));
    }

    if (!aggregate.passed) {
        process.exitCode = 1;
    }
} finally {
    if (path.dirname(temporary) === path.resolve(tmpdir()) && path.basename(temporary).startsWith('mantle-skin-reports-')) {
        await rm(temporary, { recursive: true, force: true });
    }
}
