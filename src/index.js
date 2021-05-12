const { inspect } = require("util");
const core = require("@actions/core");
const github = require("@actions/github");

function getSha() {
  if (github.context.eventName == "pull_request") {
    return github.context.payload.pull_request.head.sha;
  } else {
    return github.context.sha;
  }
}

async function run() {
  try {
    core.warning(`This action's default branch has been renamed to "main"`);
    core.warning(
      `Referencing this action with "@master" is deprecated and will stop working after June 30th 2021`
    );

    const inputs = {
      token: core.getInput("token"),
      repository: core.getInput("repository"),
      sha: core.getInput("sha"),
      body: core.getInput("body"),
      path: core.getInput("path"),
      position: core.getInput("position"),
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    const [owner, repo] = inputs.repository.split("/");

    const sha = inputs.sha ? inputs.sha : getSha();
    core.debug(`SHA: ${sha}`);

    const octokit = github.getOctokit(inputs.token);

    await octokit.repos.createCommitComment({
      owner: owner,
      repo: repo,
      commit_sha: sha,
      body: inputs.body,
      path: inputs.path,
      position: inputs.position
    });
  } catch (error) {
    core.debug(inspect(error));
    core.setFailed(error.message);
  }
}

run();
