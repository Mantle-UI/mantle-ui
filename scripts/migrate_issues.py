import os
import time
from github import Github, Auth

auth = Auth.Token(GITHUB_TOKEN)

github = Github(auth=auth)

source = github.get_repo(SOURCE_REPO)
dest = github.get_repo(DEST_REPO)


def get_existing_migrations():
    migrated = set()

    print("Checking existing migrations...")

    for issue in dest.get_issues(state="all"):
        if issue.body and "Original issue:" in issue.body:
            original_url = issue.body.split("Original issue:", 1)[1].split()[0]
            migrated.add(original_url)

    return migrated


existing = get_existing_migrations()
available_labels = {label.name for label in dest.get_labels()}

print(f"Found {len(existing)} already migrated issues.")

for issue in source.get_issues(state="open"):

    # Skip pull requests
    if issue.pull_request:
        continue

    original_url = issue.html_url

    if original_url in existing:
        print(f"Skipping: {original_url}")
        continue

    print(f"Migrating #{issue.number}: {issue.title}")

    new_issue = dest.create_issue(
        title=issue.title,
        body=f"""{issue.body or ""}

---

Original issue:
{original_url}
"""
    )

    labels = [
        label.name
        for label in issue.labels
        if label.name in available_labels
    ]

    if labels:
        new_issue.set_labels(*labels)

    new_issue.create_comment(
        f"""Hi @{issue.user.login},

This issue has been migrated from:

{original_url}

Please continue the discussion here.

Thanks for your original report!
"""
    )

    print(f"Created #{new_issue.number}")

    existing.add(original_url)

    time.sleep(1)

print("Migration complete.")
