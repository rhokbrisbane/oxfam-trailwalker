#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_PULL_REQUEST" = "false" -o "$TRAVIS_SECURE_ENV_VARS" = "false" ]; then
  echo "Only deploying local pull requests, which doesn't seem to be $TRAVIS_BRANCH'"
  exit 0
fi

rawgit_test_url="https://rawgit.com/findmeawalk-ci/builds/${TRAVIS_PULL_REQUEST_BRANCH}/"
pr_revision=$(git rev-parse --short HEAD)

echo "Deploying branch ${TRAVIS_PULL_REQUEST_BRANCH} at ${pr_revision} to ${rawgit_test_url}"

sed -i "s/https:\/\/findmeawalk\.com\//${rawgit_test_url//\//\\/}/" package.json
npm run build

mkdir deploy
cd deploy

git init
git config user.name "Findmeawalk Bot"
git config user.email "findmeawalk@gmail.com"

git remote add upstream "https://${GH_TOKEN}@github.com/findmeawalk-ci/builds.git"
git fetch upstream

# Checkout (if existing), or create a new branch and post a comment saying where to find it
if ! git checkout ${TRAVIS_PULL_REQUEST_BRANCH}; then
  git checkout -b ${TRAVIS_PULL_REQUEST_BRANCH}
  curl -i \
    -u "findmeawalk-ci:${GH_TOKEN}" \
    -H "Content-Type: application/json" \
    --data '{"body": "Test this live at '${rawgit_test_url}'"}' \
    "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments"
fi

echo "Cleaning current directory"
git rm -rf --ignore-unmatch .
cp -R ../build/* .

# Note the current deploy sha/date
echo -n "<!-- ${pr_revision} - $(date) -->" >> index.html

echo "Adding files"
git add -A .
git commit -m "Deploy branch ${TRAVIS_PULL_REQUEST_BRANCH} at ${pr_revision}"

echo "Pushing branch"
git push upstream HEAD:${TRAVIS_PULL_REQUEST_BRANCH}

