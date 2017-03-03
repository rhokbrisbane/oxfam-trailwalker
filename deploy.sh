#!/bin/bash

set -o errexit -o nounset
pr_revision=$(git rev-parse --short HEAD)

# If you want to check what environment variables are available, use this instead of a normal printenv to avoid leaking GH_TOKEN
#printenv | grep "^TRAVIS"

if [ "$TRAVIS_PULL_REQUEST" != "false" -a "$TRAVIS_SECURE_ENV_VARS" = "true" ]; then
  repo="findmeawalk-ci/builds"
  rawgit_test_url="https://rawgit.com/${repo}/${TRAVIS_PULL_REQUEST_BRANCH}/"

  build_branch=${TRAVIS_PULL_REQUEST_BRANCH}
  deploy_branch=${TRAVIS_PULL_REQUEST_BRANCH}

  # rerun build with the correct base path
  sed -i "s/https:\/\/findmeawalk\.com\//${rawgit_test_url//\//\\/}/" package.json
  npm run build

  should_leave_pr_comment=1
elif [ "$TRAVIS_PULL_REQUEST" = "false" -a "$TRAVIS_BRANCH" = "master" ]; then
  repo="rhokbrisbane/oxfam-trailwalker"
  build_branch=${TRAVIS_BRANCH}
  deploy_branch="gh-pages"
else
  echo "Only deploying local pull requests or master"
  exit 0
fi

echo "Deploying branch ${deploy_branch} at ${pr_revision} to ${repo}"

mkdir deploy
cd deploy

git init
git config user.name "Findmeawalk Bot"
git config user.email "findmeawalk@gmail.com"

git remote add upstream "https://${GH_TOKEN}@github.com/${repo}.git"
git fetch upstream

# Checkout (if existing), or create a new branch and post a comment saying where to find it
if ! git checkout ${deploy_branch}; then
  git checkout -b ${deploy_branch}

  if [ $should_leave_pr_comment ]; then
    curl -i \
      -u "findmeawalk-ci:${GH_TOKEN}" \
      -H "Content-Type: application/json" \
      --data '{"body": "Test this at '${rawgit_test_url}'"}' \
      "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/issues/${TRAVIS_PULL_REQUEST}/comments"
  fi
fi

echo "Cleaning current directory"
git rm -rf --ignore-unmatch .
cp -R ../build/* .

# Note the current deploy sha/date
echo -n "<!-- ${pr_revision} - $(date) -->" >> index.html

echo "Adding files"
git add -A .
git commit -m "Deploy branch ${build_branch} at ${pr_revision}"

echo "Pushing branch"

# this needs to use -q or it leaks the GH_TOKEN in the public travis log
git push -q upstream HEAD:${deploy_branch}

