const { inspect } = require("util");
const core = require("@actions/core");
const github = require("@actions/github");
const { request } = require("@octokit/request");

function getSha() {
  if (github.context.eventName == "pull_request") {
    return github.context.payload.pull_request.head.sha;
  } else {
    return github.context.sha;
  }
}

async function run() {
  try {
    const inputs = {
      token: core.getInput("token"),
      sha: core.getInput("sha"),
      body: core.getInput("body"),
      path: core.getInput("path"),
      position: core.getInput("position"),
    };
    core.debug(`Inputs: ${inspect(inputs)}`);

    const sha = inputs.sha ? inputs.sha : getSha();
    core.debug(`SHA: ${sha}`);

    await request(
      `POST /repos/${process.env.GITHUB_REPOSITORY}/commits/${sha}/comments`,
      {
        headers: {
          authorization: `token ${inputs.token}`,
        },
        body: `${inputs.body}`,
        path: `${inputs.path}`,
        position: `${inputs.position}`,
      }
    );
  } catch (error) {
    core.debug(inspect(error));
    core.setFailed(error.message);
  }
}

run();
