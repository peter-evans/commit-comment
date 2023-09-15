# Commit Comment
[![CI](https://github.com/peter-evans/commit-comment/workflows/CI/badge.svg)](https://github.com/peter-evans/commit-comment/actions?query=workflow%3ACI)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Commit%20Comment-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEZPfsVJ61jbxaF0cRQRcRJ9hlYn30IHN/+9iquDCOIsblIrOjqKgy5aKoJQj4O3EEtbPwhJbr6Te28CmdSKeqzeqr0YbfVIrTBKakvtOl5dtTkK+v4HfA9PEyBFCY9AGVgCBLaBp1jPAyfAJ/AAdIEG0dNAiyP7+K1qIfMdonZic6+WJoBJvQlvuwDqcXadUuqPA1NKAlexbRTAIMvMOCjTbMwl1LtI/6KWJ5Q6rT6Ht1MA58AX8Apcqqt5r2qhrgAXQC3CZ6i1+KMd9TRu3MvA3aH/fFPnBodb6oe6HM8+lYHrGdRXW8M9bMZtPXUji69lmf5Cmamq7quNLFZXD9Rq7v0Bpc1o/tp0fisAAAAASUVORK5CYII=)](https://github.com/marketplace/actions/commit-comment)

A GitHub action to create a comment for a commit on GitHub.

![Commit Comment Example](https://github.com/peter-evans/commit-comment/blob/main/comment-example.png?raw=true)

## Usage

### Add a comment to the current context's commit SHA

The SHA defaults to `github.sha` OR, for `pull_request` events `github.event.pull_request.head.sha`.

```yml
      - name: Create commit comment
        uses: peter-evans/commit-comment@v3
        with:
          body: |
            This is a multi-line test comment
            - With GitHub **Markdown** :sparkles:
            - Created by [commit-comment][1]

            [1]: https://github.com/peter-evans/commit-comment
          reactions: '+1'
```

### Update a commit comment

```yml
      - name: Update commit comment
        uses: peter-evans/commit-comment@v3
        with:
          comment-id: 557858210
          body: |
            **Edit:** Some additional info
          reactions: eyes
```

### Add commit comment reactions

```yml
      - name: Add reactions
        uses: peter-evans/commit-comment@v3
        with:
          comment-id: 557858210
          reactions: |
            heart
            hooray
            laugh
```

## Action inputs

| Name | Description | Default |
| --- | --- | --- |
| `token` | `GITHUB_TOKEN` or a `repo` scoped [PAT](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token). | `GITHUB_TOKEN` |
| `repository` | The full name of the target repository. | `github.repository` (current repository) |
| `sha` | The commit SHA. | `github.sha` OR, for `pull_request` events `github.event.pull_request.head.sha` |
| `path` | Relative path of the file to comment on. | |
| `position` | Line index in the diff to comment on. | |
| `comment-id` | The id of the comment to update. | |
| `body` | The comment body. Cannot be used in conjunction with `body-path`. | |
| `body-path` | The path to a file containing the comment body. Cannot be used in conjunction with `body`. | |
| `edit-mode` | The mode when updating a comment, `replace` or `append`. | `append` |
| `append-separator` | The separator to use when appending to an existing comment. (`newline`, `space`, `none`) | `newline` |
| `reactions` | A comma or newline separated list of reactions to add to the comment. (`+1`, `-1`, `laugh`, `confused`, `heart`, `hooray`, `rocket`, `eyes`) | |
| `reactions-edit-mode` | The mode when updating comment reactions, `replace` or `append`. | `append` |

Note: In *public* repositories this action does not work in `pull_request` workflows when triggered by forks.
Any attempt will be met with the error, `Resource not accessible by integration`.
This is due to token restrictions put in place by GitHub Actions. Private repositories can be configured to [enable workflows](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#enabling-workflows-for-forks-of-private-repositories) from forks to run without restriction. See [here](https://github.com/peter-evans/create-pull-request/blob/main/docs/concepts-guidelines.md#restrictions-on-repository-forks) for further explanation. Alternatively, use the [`pull_request_target`](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#pull_request_target) event to comment on pull request commits.

#### Outputs

The ID of the created comment will be output for use in later steps.
Note that in order to read the step output the action step must have an id.

```yml
      - name: Create commit comment
        uses: peter-evans/commit-comment@v3
        id: cc
        with:
          body: |
            My comment
      - name: Check outputs
        run: |
          echo "Comment ID - ${{ steps.cc.outputs.comment-id }}"
```

### Setting the comment body from a file

```yml
      - name: Create commit comment
        uses: peter-evans/commit-comment@v3
        with:
          body-path: 'comment-body.md'
```

### Using a markdown template

In this example, a markdown template file is added to the repository at `.github/comment-template.md` with the following content.
```
This is a test comment template
Render template variables such as {{ .foo }} and {{ .bar }}.
```

The template is rendered using the [render-template](https://github.com/chuhlomin/render-template) action and the result is used to create the comment.
```yml
      - name: Render template
        id: template
        uses: chuhlomin/render-template@v1.4
        with:
          template: .github/comment-template.md
          vars: |
            foo: this
            bar: that

      - name: Create commit comment
        uses: peter-evans/commit-comment@v3
        with:
          body: ${{ steps.template.outputs.result }}
```

### Accessing commits and comments in other repositories

You can create and update commit comments in another repository by using a [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) instead of `GITHUB_TOKEN`.
The user associated with the PAT must have write access to the repository.

## License

[MIT](LICENSE)
