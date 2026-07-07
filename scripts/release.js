const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const BUMP_PRIORITY = {
    bug: 1,
    feature: 2,
    'breaking-change': 3
};
const SECTION_ORDER = ['breaking-change', 'feature', 'bug', 'other'];
const SECTION_TITLES = {
    'breaking-change': 'Breaking Changes',
    feature: 'Features',
    bug: 'Bug Fixes',
    other: 'Other Changes'
};
const CLOSING_KEYWORDS_PATTERN = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)\b/gi;

function run(command, args, options = {}) {
    const result = spawnSync(command, args, {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        ...options
    });

    if (result.status !== 0) {
        throw new Error(result.stderr.trim() || `Command failed: ${command} ${args.join(' ')}`);
    }

    return result.stdout.trim();
}

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, content) {
    fs.writeFileSync(filePath, `${JSON.stringify(content, null, 4)}\n`);
}

function parseVersion(version) {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);

    if (!match) {
        throw new Error(`Unsupported version format: ${version}`);
    }

    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3])
    };
}

function incrementVersion(version, bump) {
    const parsed = parseVersion(version);

    if (bump === 'breaking-change') {
        return `${parsed.major + 1}.0.0`;
    }

    if (bump === 'feature') {
        return `${parsed.major}.${parsed.minor + 1}.0`;
    }

    return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
}

function normalizeLabels(labels) {
    return labels
        .map((label) => label.name.toLowerCase())
        .filter(Boolean);
}

function extractBreakingChangeLabel(labels) {
    return normalizeLabels(labels).includes('breaking-change');
}

function getHighestPriorityLabel(labels) {
    return labels.reduce((highest, label) => {
        if (!highest || BUMP_PRIORITY[label] > BUMP_PRIORITY[highest]) {
            return label;
        }

        return highest;
    }, null);
}

function extractClosingIssueNumbers(body) {
    const issueNumbers = new Set();
    const text = body || '';
    let match;

    while ((match = CLOSING_KEYWORDS_PATTERN.exec(text)) !== null) {
        issueNumbers.add(Number(match[1]));
    }

    return [...issueNumbers];
}

function fetchMergedPullRequests(lastTagDate) {
    const mergedSinceDate = lastTagDate.slice(0, 10);
    const prs = JSON.parse(
        run('gh', [
            'pr',
            'list',
            '--state',
            'merged',
            '--base',
            'main',
            '--search',
            `merged:>=${mergedSinceDate}`,
            '--limit',
            '200',
            '--json',
            'number,title,url,mergedAt,labels,body'
        ])
    );

    return prs.filter((pr) => pr.mergedAt > lastTagDate).sort((left, right) => new Date(left.mergedAt) - new Date(right.mergedAt));
}

function fetchPullRequestLinkedIssueNumbers(repo, pullRequestNumber) {
    const [owner, name] = repo.split('/');
    const response = JSON.parse(
        run('gh', [
            'api',
            'graphql',
            '-f',
            `query=query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      closingIssuesReferences(first: 100) {
        nodes {
          number
        }
      }
    }
  }
}`,
            '-F',
            `owner=${owner}`,
            '-F',
            `name=${name}`,
            '-F',
            `number=${pullRequestNumber}`
        ])
    );

    return response.data?.repository?.pullRequest?.closingIssuesReferences?.nodes?.map((issue) => issue.number) || [];
}

function fetchIssueLabelMap(repo, issueNumbers) {
    const issueMap = new Map();

    const [owner, name] = repo.split('/');

    for (const issueNumber of issueNumbers) {
        const response = JSON.parse(
            run('gh', [
                'api',
                'graphql',
                '-f',
                `query=query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    issue(number: $number) {
      number
      issueType {
        name
      }
      labels(first: 100) {
        nodes {
          name
        }
      }
    }
  }
}`,
                '-F',
                `owner=${owner}`,
                '-F',
                `name=${name}`,
                '-F',
                `number=${issueNumber}`
            ])
        );
        const issue = response.data?.repository?.issue;

        if (!issue) {
            continue;
        }

        issueMap.set(issueNumber, {
            type: issue.issueType?.name?.toLowerCase() || null,
            hasBreakingChange: extractBreakingChangeLabel(issue.labels?.nodes || [])
        });
    }

    return issueMap;
}

function resolvePullRequestReleaseInfo(pr, issueMap, githubLinkedIssueNumbers) {
    const hasPrBreakingChange = extractBreakingChangeLabel(pr.labels || []);
    const bodyLinkedIssueNumbers = extractClosingIssueNumbers(pr.body);
    const linkedIssueNumbers = [...new Set([...bodyLinkedIssueNumbers, ...githubLinkedIssueNumbers])];
    const linkedIssues = linkedIssueNumbers.map((issueNumber) => issueMap.get(issueNumber)).filter(Boolean);
    const hasIssueBreakingChange = linkedIssues.some((issue) => issue.hasBreakingChange);
    const linkedIssueTypes = [...new Set(linkedIssues.map((issue) => issue.type).filter((type) => type === 'feature' || type === 'bug'))];
    let effectiveLabel = null;

    if (hasPrBreakingChange || hasIssueBreakingChange) {
        effectiveLabel = 'breaking-change';
    } else if (linkedIssueTypes.includes('feature')) {
        effectiveLabel = 'feature';
    } else if (linkedIssueTypes.includes('bug')) {
        effectiveLabel = 'bug';
    }

    return {
        number: pr.number,
        title: pr.title,
        url: pr.url,
        mergedAt: pr.mergedAt,
        hasPrBreakingChange,
        bodyLinkedIssueNumbers,
        githubLinkedIssueNumbers,
        linkedIssueNumbers,
        linkedIssueTypes,
        hasIssueBreakingChange,
        effectiveLabel
    };
}

function detectBump(prs) {
    const labels = prs.map((pr) => pr.effectiveLabel).filter(Boolean);

    return getHighestPriorityLabel(labels);
}

function updatePackageVersion(filePath, nextVersion) {
    const content = readJson(filePath);

    content.version = nextVersion;

    if (content.packages && content.packages['']) {
        content.packages[''].version = nextVersion;
    }

    writeJson(filePath, content);
}

function formatReleaseItem(pr) {
    const linkedIssuesSuffix = pr.linkedIssueNumbers.length ? ` (issues: ${pr.linkedIssueNumbers.map((issueNumber) => `#${issueNumber}`).join(', ')})` : '';

    return `- ${pr.title} [#${pr.number}](${pr.url})${linkedIssuesSuffix}`;
}

function buildReleaseNotes(nextVersion, today, compareUrl, prs) {
    const grouped = {
        'breaking-change': [],
        feature: [],
        bug: [],
        other: []
    };

    for (const pr of prs) {
        grouped[pr.effectiveLabel || 'other'].push(pr);
    }

    const sections = [];

    for (const key of SECTION_ORDER) {
        if (!grouped[key].length) {
            continue;
        }

        sections.push(`## ${SECTION_TITLES[key]}\n\n${grouped[key].map(formatReleaseItem).join('\n')}`);
    }

    return [`## [${nextVersion}](${compareUrl}) (${today})`, '', `[Full Changelog](${compareUrl})`, '', ...sections].join('\n');
}

function prependChangelogEntry(filePath, entry) {
    const current = fs.readFileSync(filePath, 'utf8');
    const header = '# Changelog';

    if (!current.startsWith(header)) {
        throw new Error(`${path.basename(filePath)} is missing the expected "# Changelog" header.`);
    }

    const body = current.slice(header.length).replace(/^\r?\n*/, '');
    const next = `${header}\n\n${entry}\n\n${body.trimStart()}`;

    fs.writeFileSync(filePath, `${next.trimEnd()}\n`);
}

function main() {
    const repo = process.env.GITHUB_REPOSITORY;

    if (!repo) {
        throw new Error('GITHUB_REPOSITORY is required.');
    }

    const packageJsonPath = path.resolve('package.json');
    const packageLockPath = path.resolve('package-lock.json');
    const changelogPath = path.resolve('CHANGELOG.md');
    const releaseNotesPath = path.resolve('RELEASE_NOTES.md');
    const currentVersion = readJson(packageJsonPath).version;
    const lastTag = run('git', ['describe', '--tags', '--abbrev=0']);
    const lastTagDate = run('git', ['log', '-1', '--format=%cI', lastTag]);
    const lastTaggedVersion = lastTag.replace(/^v/, '');

    if (currentVersion !== lastTaggedVersion) {
        throw new Error(`package.json version (${currentVersion}) does not match the latest tag (${lastTag}).`);
    }

    const mergedPullRequests = fetchMergedPullRequests(lastTagDate);

    if (!mergedPullRequests.length) {
        throw new Error(`No merged pull requests found after ${lastTag}.`);
    }

    const githubLinkedIssueNumbersByPr = new Map(
        mergedPullRequests.map((pr) => [pr.number, fetchPullRequestLinkedIssueNumbers(repo, pr.number)])
    );
    const allIssueNumbers = [...new Set(
        mergedPullRequests.flatMap((pr) => {
            const bodyLinkedIssueNumbers = extractClosingIssueNumbers(pr.body);
            const githubLinkedIssueNumbers = githubLinkedIssueNumbersByPr.get(pr.number) || [];

            return [...bodyLinkedIssueNumbers, ...githubLinkedIssueNumbers];
        })
    )];
    const issueMap = fetchIssueLabelMap(repo, allIssueNumbers);
    const releasePullRequests = mergedPullRequests.map((pr) => resolvePullRequestReleaseInfo(pr, issueMap, githubLinkedIssueNumbersByPr.get(pr.number) || []));
    const detectedBump = detectBump(releasePullRequests);

    if (!detectedBump) {
        throw new Error('No relevant release signal found since the latest tag. Use breaking-change on the PR or linked issue, or link issues with type feature or bug before creating a release.');
    }

    const nextVersion = incrementVersion(currentVersion, detectedBump);
    const today = new Date().toISOString().slice(0, 10);
    const compareUrl = `https://github.com/${repo}/compare/${lastTag}...v${nextVersion}`;
    const releaseNotes = buildReleaseNotes(nextVersion, today, compareUrl, releasePullRequests);

    updatePackageVersion(packageJsonPath, nextVersion);

    if (fs.existsSync(packageLockPath)) {
        updatePackageVersion(packageLockPath, nextVersion);
    }

    prependChangelogEntry(changelogPath, releaseNotes);
    fs.writeFileSync(releaseNotesPath, `${releaseNotes}\n`);
    console.log(`Prepared ${nextVersion} from ${releasePullRequests.length} merged pull request(s) since ${lastTag}.`);
    console.log(`Detected bump: ${detectedBump}`);
}

try {
    main();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
