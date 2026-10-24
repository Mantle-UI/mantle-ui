export function recordRunnerFailure(report, error, phase) {
    const detail = error?.stack || String(error);

    report.passed = false;
    report.error ??= detail;
    (report.failures ??= []).push({ phase, error: detail });
}

export function writeRunnerOutput(stream, text) {
    return new Promise((resolve, reject) => {
        const onError = (error) => reject(error);

        stream.once('error', onError);

        try {
            stream.write(text, (error) => {
                if (error) {
                    // Writable emits 'error' after its write callback; retain
                    // the once listener until that event has been consumed.
                    reject(error);
                } else {
                    stream.removeListener('error', onError);
                    resolve();
                }
            });
        } catch (error) {
            stream.removeListener('error', onError);
            reject(error);
        }
    });
}

// A failed artifact or cleanup step must not prevent the remaining resources
// from being released, or leave a previously successful report marked passed.
export async function finalizeBrowserRun({ report, captureScreenshot, writeScreenshot, closeBrowser, terminateBrowser, closeServer, removeProfile, writeReport, outputReport, timeoutMs = 10000 }) {
    const step = async (phase, action) => {
        if (!action) return { completed: true };

        let timer;

        try {
            const value = await Promise.race([
                Promise.resolve().then(action),
                new Promise((resolve, reject) => {
                    timer = setTimeout(() => reject(new Error(`${phase} timed out after ${timeoutMs}ms`)), timeoutMs);
                })
            ]);

            return { completed: true, value };
        } catch (error) {
            recordRunnerFailure(report, error, phase);

            return { completed: false };
        } finally {
            clearTimeout(timer);
        }
    };

    if (captureScreenshot) {
        const capture = await step('screenshot.capture', captureScreenshot);

        if (capture.completed) await step('screenshot.write', () => writeScreenshot(capture.value));
    }

    await step('browser.close', closeBrowser);
    await step('browser.terminate', terminateBrowser);
    await step('server.close', closeServer);
    await step('profile.remove', removeProfile);
    await step('report.write', writeReport && (() => writeReport(report)));
    const output = await step('report.output', outputReport && (() => outputReport(report)));

    if (!output.completed) await step('report.rewrite', writeReport && (() => writeReport(report)));

    return report.passed ? 0 : 1;
}
