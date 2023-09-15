import * as core from '@actions/core'
import * as github from '@actions/github'
import {Inputs, createOrUpdateCommitComment} from './commit-comment'
import {existsSync, readFileSync} from 'fs'
import {inspect} from 'util'
import * as utils from './utils'

function getSha() {
  if (github.context.eventName == 'pull_request') {
    return github.context.payload.pull_request!.head.sha
  } else {
    return github.context.sha
  }
}

function getBody(inputs: Inputs) {
  if (inputs.body) {
    return inputs.body
  } else if (inputs.bodyPath) {
    return readFileSync(inputs.bodyPath, 'utf-8')
  } else {
    return ''
  }
}

async function run(): Promise<void> {
  try {
    const inputs: Inputs = {
      token: core.getInput('token'),
      repository: core.getInput('repository'),
      sha: core.getInput('sha'),
      path: core.getInput('path'),
      position: core.getInput('position'),
      commentId: Number(core.getInput('comment-id')),
      body: core.getInput('body'),
      bodyPath: core.getInput('body-path') || core.getInput('body-file'),
      editMode: core.getInput('edit-mode'),
      appendSeparator: core.getInput('append-separator'),
      reactions: utils.getInputAsArray('reactions'),
      reactionsEditMode: core.getInput('reactions-edit-mode')
    }
    core.debug(`Inputs: ${inspect(inputs)}`)

    if (!['append', 'replace'].includes(inputs.editMode)) {
      throw new Error(`Invalid edit-mode '${inputs.editMode}'.`)
    }

    if (!['append', 'replace'].includes(inputs.reactionsEditMode)) {
      throw new Error(
        `Invalid reactions edit-mode '${inputs.reactionsEditMode}'.`
      )
    }

    if (!['newline', 'space', 'none'].includes(inputs.appendSeparator)) {
      throw new Error(`Invalid append-separator '${inputs.appendSeparator}'.`)
    }

    if (inputs.bodyPath && inputs.body) {
      throw new Error("Only one of 'body' or 'body-path' can be set.")
    }

    if (inputs.bodyPath) {
      if (!existsSync(inputs.bodyPath)) {
        throw new Error(`File '${inputs.bodyPath}' does not exist.`)
      }
    }

    const body = getBody(inputs)

    if (inputs.commentId) {
      if (!body && !inputs.reactions) {
        throw new Error("Missing comment 'body', 'body-path', or 'reactions'.")
      }
    } else if (inputs.sha) {
      if (!body) {
        throw new Error("Missing comment 'body' or 'body-path'.")
      }
    } else {
      inputs.sha = getSha()
      if (!body) {
        throw new Error("Missing comment 'body' or 'body-path'.")
      }
    }

    createOrUpdateCommitComment(inputs, body)
  } catch (error) {
    core.debug(inspect(error))
    const errMsg = utils.getErrorMessage(error)
    core.setFailed(errMsg)
    if (errMsg == 'Resource not accessible by integration') {
      core.error(`See this action's readme for details about this error`)
    }
  }
}

run()
