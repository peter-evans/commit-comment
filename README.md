# Commit Comment
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Commit%20Comment-blue.svg?colorA=24292e&colorB=0366d6&style=flat&longCache=true&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAM6wAADOsB5dZE0gAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAERSURBVCiRhZG/SsMxFEZPfsVJ61jbxaF0cRQRcRJ9hlYn30IHN/+9iquDCOIsblIrOjqKgy5aKoJQj4O3EEtbPwhJbr6Te28CmdSKeqzeqr0YbfVIrTBKakvtOl5dtTkK+v4HfA9PEyBFCY9AGVgCBLaBp1jPAyfAJ/AAdIEG0dNAiyP7+K1qIfMdonZic6+WJoBJvQlvuwDqcXadUuqPA1NKAlexbRTAIMvMOCjTbMwl1LtI/6KWJ5Q6rT6Ht1MA58AX8Apcqqt5r2qhrgAXQC3CZ6i1+KMd9TRu3MvA3aH/fFPnBodb6oe6HM8+lYHrGdRXW8M9bMZtPXUji69lmf5Cmamq7quNLFZXD9Rq7v0Bpc1o/tp0fisAAAAASUVORK5CYII=)](https://github.com/marketplace/actions/commit-comment)

A GitHub action to create a comment for a commit on GitHub.

![Commit Comment Example](https://github.com/peter-evans/commit-comment/blob/master/comment-example.png?raw=true)

## Usage

```yml
      - name: Create commit comment
        uses: peter-evans/commit-comment@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          body: |
            This is a multi-line test comment
            - With GitHub **Markdown**
            - Created by [commit-comment][1]

            [1]: https://github.com/peter-evans/commit-comment
```

## Parameters

- `token` (**required**) - The GitHub authentication token
- `sha` - The commit SHA. Defaults to the current commit.
- `body` (**required**) - The contents of the comment.
- `path` - Relative path of the file to comment on.
- `position` - Line index in the diff to comment on.

## Example

Here is an example setting all of the input parameters.

```yml
      - name: Create commit comment
        uses: peter-evans/commit-comment@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          sha: 843dea1cc2e721163c20a5c876b5b155f7f3aa75
          body: |
            This is a multi-line test comment
            - With GitHub **Markdown**
            - Created by [commit-comment][1]

            [1]: https://github.com/peter-evans/commit-comment
          path: path/to/file.txt
          position: 1
```

## License

[MIT](LICENSE)
