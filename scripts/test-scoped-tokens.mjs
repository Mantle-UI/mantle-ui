import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const available = ['provider', 'global', 'global-first', 'global-second', 'nested'];
const selected = process.env.MANTLE_TEST_GROUP;

if (selected && !available.includes(selected)) {
    throw new Error(`Unknown scoped token group: ${selected}`);
}

const groups = selected === 'global' ? ['global-first', 'global-second'] : selected ? [selected] : ['provider', 'global-first', 'global-second', 'nested'];
const aggregateOutput = !selected || selected === 'global';
const temporary = await mkdtemp(path.join(tmpdir(), 'mantle-scoped-reports-'));
const reports = [];

if (process.env.MANTLE_TEST_REPORT && aggregateOutput) {
    await writeFile(process.env.MANTLE_TEST_REPORT, JSON.stringify({ passed: false, phase: 'starting', assertions: [] }));
}

try {
    for (const group of groups) {
        const destination = process.env.MANTLE_TEST_REPORT;
        const reportPath = destination ? (aggregateOutput ? `${destination}.${group}.json` : destination) : path.join(temporary, `${group}.json`);

        await writeFile(reportPath, JSON.stringify({ passed: false, phase: 'starting', assertions: [] }));
        const run = await new Promise((resolve, reject) => {
            const child = spawn(process.execPath, [path.join(import.meta.dirname, 'test-portal-theming.mjs'), process.argv[2] || 'scoped-token-gaps.jsx'], {
                env: { ...process.env, MANTLE_TEST_GROUP: group, MANTLE_TEST_REPORT: reportPath },
                windowsHide: true
            });
            let errors = '';

            child.stdout.resume();
            child.stderr.on('data', (chunk) => (errors += chunk));
            child.on('error', reject);
            child.on('close', (code) => resolve({ code, errors }));
        });
        const result = JSON.parse(await readFile(reportPath, 'utf8'));
        const report = { ...result, assertions: result.assertions || [] };

        reports.push({ group, ...report, passed: run.code === 0 && report.passed });
        process.stdout.write(`${group}: ${run.code === 0 && report.passed ? 'passed' : 'failed'} (${report.assertions.length} assertions)\n`);

        if (run.code !== 0) {
            process.stderr.write(`${report.error || run.errors.slice(-4000)}\n`);
        }
    }

    const aggregate = {
        passed: reports.every((report) => report.passed),
        groups: reports.map(({ group, passed, assertions }) => ({ group, passed, count: assertions.length })),
        assertions: reports.flatMap(({ assertions }) => assertions)
    };

    if (process.env.MANTLE_TEST_REPORT && aggregateOutput) {
        await writeFile(process.env.MANTLE_TEST_REPORT, JSON.stringify(aggregate, null, 2));
    }

    if (!aggregate.passed) {
        process.exitCode = 1;
    }
} finally {
    if (path.dirname(temporary) === path.resolve(tmpdir()) && path.basename(temporary).startsWith('mantle-scoped-reports-')) {
        await rm(temporary, { recursive: true, force: true });
    }
}
