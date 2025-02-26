# git9

[![npm](https://img.shields.io/npm/v/git9.svg)](https://www.npmjs.com/package/git9)

<img src="https://cdn.jsdelivr.net/gh/CyanSalt/git9@main/docs/icon.svg" width="64" height="64">

Utilities (How many letters?) for Git.

## Installation

```shell
npm install --save git9
```

## Usage

```js
import {
  getCommit,
  getCurrentCommit,
  hasCommit,
  isMerging,
  hasConflicts,
  getBranch,
  getCurrentBranch,
  getRootDirectory,
  getConfig,
  getRemoteURL,
  getRemoteCommit,
  getDifferences,
  getChangedFiles,
  downloadFile,
} from 'git9'
```

### `getCommit`

```ts
function getCommit(committish: string): Promise<string>
```

Get commit hash with a commit-ish string.

### `getCurrentCommit`

```ts
function getCurrentCommit(): Promise<string>
```

Get commit hash of the current branch.

### `hasCommit`

```ts
function hasCommit(committish: string): Promise<boolean>
```

Check whether a specified branch or pointer exists.

### `isMerging`

```ts
function isMerging(): Promise<boolean>
```

Check whether the working repository is in the merging state. Equivalent to `hasCommit('MERGE_HEAD')`.

### `hasConflicts`

```ts
function hasConflicts(subpath?: string): Promise<boolean>
```

Check whether the working repository has conflicts.

### `getBranch`

```ts
function getBranch(committish: string): Promise<string>
```

Get the branch name of a commit-ish.

### `getCurrentBranch`

```ts
function getCurrentBranch(): Promise<string>
```

Get the current branch name. Equivalent to `getCurrentBranch('HEAD')`.

### `getRootDirectory`

```ts
function getRootDirectory(): Promise<string>
```

Get the root directory of the repository.

### `getConfig`

```ts
function getConfig(config: string): Promise<string>
```

Get specified config value of the repository.

### `getRemoteURL`

```ts
function getRemoteURL(name: string): Promise<string>
```

Get remote repository URL with specified name.

### `getRemoteCommit`

```ts
function getRemoteCommit(url: string, committish: string): Promise<string>
```

Get commit hash with a commit-ish string from remote.

### `getDifferences`

```ts
function getDifferences(committish: string): Promise<{
  name: string;
  status: string;
}[]>
```

Get differences between the current branch and the specified commit-ish.

> Possible status letters are:
> - A: addition of a file
> - C: copy of a file into a new one
> - D: deletion of a file
> - M: modification of the contents or mode of a file
> - R: renaming of a file
> - T: change in the type of the file (regular file, symbolic link or submodule)
> - U: file is unmerged (you must complete the merge before it can be committed)
> - X: "unknown" change type (most probably a bug, please report it)

See [git-diff](https://git-scm.com/docs/git-diff).

### `getChangedFiles`

```ts
function getChangedFiles(committish: string): Promise<string[]>
```

Get changed files in current branch from the specified commit-ish.

### `downloadFile`

```ts
function downloadFile(url: string, committish: string, file: string): Promise<string>
```

Download specified file with a commit-ish string from remote using git-archive protocol.

> [!NOTE]
> GitHub does not support git-archive protocol.
