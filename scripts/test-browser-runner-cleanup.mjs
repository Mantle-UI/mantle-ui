import assert from 'node:assert/strict';
import { Writable } from 'node:stream';
import { test } from 'node:test';
import { finalizeBrowserRun, recordRunnerFailure, writeRunnerOutput } from './browser-runner-cleanup.mjs';

function harness(failing = []) {
    const calls = [];
    const report = { passed: true, assertions: [{ name: 'Browser assertions', passed: true }] };
    let savedReport;
    let output;

    const action = (name, value) => async () => {
        calls.push(name);
        if (failing.includes(name)) throw new Error(`${name} failed`);

        return value;
    };

    const options = {
        report,
        captureScreenshot: action('capture', Buffer.from('png')),
        writeScreenshot: async (data) => {
            assert.equal(data.toString(), 'png');
            await action('screenshot')();
        },
        closeBrowser: action('close'),
        terminateBrowser: action('terminate'),
        closeServer: action('server'),
        removeProfile: action('profile'),
        writeReport: async (value) => {
            await action('report')();
            savedReport = JSON.parse(JSON.stringify(value));
        },
        outputReport: async (value) => {
            await action('output')();
            output = JSON.parse(JSON.stringify(value));
        }
    };

    return { calls, report, options, savedReport: () => savedReport, output: () => output };
}

test('successful run captures once, cleans up and writes a passing report', async () => {
    const run = harness();

    assert.equal(await finalizeBrowserRun(run.options), 0);
    assert.deepEqual(run.calls, ['capture', 'screenshot', 'close', 'terminate', 'server', 'profile', 'report', 'output']);
    assert.equal(run.savedReport().passed, true);
});

test('late browser-close failure changes a passing run to nonzero and preserves evidence', async () => {
    const run = harness(['close']);

    assert.equal(await finalizeBrowserRun(run.options), 1);
    assert.equal(run.report.passed, false);
    assert.match(run.savedReport().error, /close failed/);
    assert.deepEqual(run.calls.slice(-5), ['terminate', 'server', 'profile', 'report', 'output']);
});

test('screenshot capture failure is recorded once and cannot skip cleanup', async () => {
    const run = harness(['capture']);

    assert.equal(await finalizeBrowserRun(run.options), 1);
    assert.deepEqual(run.calls, ['capture', 'close', 'terminate', 'server', 'profile', 'report', 'output']);
    assert.equal(run.savedReport().failures[0].phase, 'screenshot.capture');
});

test('screenshot write failure does not retry capture or replace the original test error', async () => {
    const run = harness(['screenshot']);

    recordRunnerFailure(run.report, new Error('original assertion failure'), 'test');
    assert.equal(await finalizeBrowserRun(run.options), 1);
    assert.match(run.savedReport().error, /original assertion failure/);
    assert.deepEqual(
        run.savedReport().failures.map(({ phase }) => phase),
        ['test', 'screenshot.write']
    );
    assert.equal(run.calls.filter((name) => name === 'capture').length, 1);
    assert.deepEqual(run.calls.slice(-5), ['terminate', 'server', 'profile', 'report', 'output']);
});

for (const [name, phase] of [
    ['terminate', 'browser.terminate'],
    ['server', 'server.close'],
    ['profile', 'profile.remove'],
    ['report', 'report.write'],
    ['output', 'report.output']
]) {
    test(`${phase} failure records nonzero and continues independent remaining cleanup`, async () => {
        const run = harness([name]);

        assert.equal(await finalizeBrowserRun(run.options), 1);
        assert.equal(run.report.passed, false);
        assert.equal(run.report.failures[0].phase, phase);
        assert.deepEqual(run.calls, ['capture', 'screenshot', 'close', 'terminate', 'server', 'profile', 'report', 'output', ...(name === 'output' ? ['report'] : [])]);
        if (name !== 'output') assert.equal(run.output().passed, false);
        if (name === 'output') assert.equal(run.savedReport().passed, false);
    });
}

test('failed report rewrite preserves the primary output failure', async () => {
    const run = harness(['output']);
    const writeReport = run.options.writeReport;
    let writes = 0;

    run.options.writeReport = async (value) => {
        if (++writes === 2) throw new Error('rewrite failed');

        await writeReport(value);
    };

    assert.equal(await finalizeBrowserRun(run.options), 1);
    assert.equal(writes, 2);
    assert.match(run.report.error, /output failed/);
    assert.deepEqual(
        run.report.failures.map(({ phase }) => phase),
        ['report.output', 'report.rewrite']
    );
});

test('real Writable EPIPE is consumed and the persisted report is rewritten as failed', async () => {
    const run = harness();
    const stream = new Writable({
        write(chunk, encoding, callback) {
            callback(Object.assign(new Error('broken output pipe'), { code: 'EPIPE' }));
        }
    });

    run.options.outputReport = (value) => writeRunnerOutput(stream, JSON.stringify(value));
    assert.equal(await finalizeBrowserRun(run.options), 1);
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(run.savedReport().passed, false);
    assert.match(run.savedReport().error, /broken output pipe/);
    assert.equal(run.savedReport().failures[0].phase, 'report.output');
    assert.equal(stream.listenerCount('error'), 0);
});

test('successful output write releases its scoped error listener', async () => {
    let output = '';
    const stream = new Writable({
        write(chunk, encoding, callback) {
            output += chunk;
            callback();
        }
    });

    await writeRunnerOutput(stream, 'complete report');
    assert.equal(output, 'complete report');
    assert.equal(stream.listenerCount('error'), 0);
});

test('multiple cleanup failures retain primary error and record every later phase', async () => {
    const run = harness(['capture', 'close', 'terminate', 'server', 'profile', 'report']);

    assert.equal(await finalizeBrowserRun(run.options), 1);
    assert.match(run.output().error, /capture failed/);
    assert.deepEqual(
        run.output().failures.map(({ phase }) => phase),
        ['screenshot.capture', 'browser.close', 'browser.terminate', 'server.close', 'profile.remove', 'report.write']
    );
});

test('a stalled browser termination is bounded and still permits server/profile/report cleanup', async () => {
    const run = harness();

    run.options.timeoutMs = 5;

    run.options.terminateBrowser = () => {
        run.calls.push('terminate');

        return new Promise(() => {});
    };

    assert.equal(await finalizeBrowserRun(run.options), 1);
    assert.match(run.savedReport().error, /browser.terminate timed out/);
    assert.deepEqual(run.calls.slice(-4), ['server', 'profile', 'report', 'output']);
});

test('runs without a screenshot target skip capture and still finalize', async () => {
    const run = harness();

    delete run.options.captureScreenshot;
    delete run.options.writeScreenshot;
    assert.equal(await finalizeBrowserRun(run.options), 0);
    assert.deepEqual(run.calls, ['close', 'terminate', 'server', 'profile', 'report', 'output']);
});
