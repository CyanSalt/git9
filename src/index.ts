import * as childProcess from 'child_process'
import * as util from 'util'
import { quansync } from 'quansync'
import { extract } from './tar'

const execa = util.promisify(childProcess.exec)

export interface Context {
  cwd?: string,
}

const $ = quansync({
  sync(this: Context | undefined, command: string) {
    const stdout = childProcess.execSync(command, { cwd: this?.cwd, encoding: 'utf8' })
    return stdout.trim()
  },
  async async(this: Context | undefined, command: string) {
    const { stdout } = await execa(command, { cwd: this?.cwd })
    return stdout.trim()
  },
})

export const getCommit = quansync(function (this: Context | undefined, committish: string) {
  return $.call(this, `git rev-parse -q ${committish}`)
})

export const getCurrentCommit = quansync(function (this: Context | undefined) {
  return getCommit.call(this, 'HEAD')
})

export const hasCommit = quansync(function* (this: Context | undefined, committish: string) {
  try {
    const id = yield* $.call(this, `git rev-parse -q --verify ${committish}`)
    return Boolean(id)
  } catch {
    return false
  }
})

export const isMerging = quansync(function (this: Context | undefined) {
  return hasCommit.call(this, 'MERGE_HEAD')
})

export const hasConflicts = quansync(function* (this: Context | undefined, subpath?: string) {
  try {
    yield* $.call(this, `git diff --name-only --diff-filter=U --exit-code${subpath ? ' ' + subpath : ''}`)
    return false
  } catch {
    return true
  }
})

export const getBranch = quansync(function (this: Context | undefined, committish: string) {
  return $.call(this, `git rev-parse --abbrev-ref ${committish}`)
})

export const getCurrentBranch = quansync(function (this: Context | undefined) {
  return getBranch.call(this, 'HEAD')
})

export const getRootDirectory = quansync(function (this: Context | undefined) {
  return $.call(this, `git rev-parse --show-toplevel`)
})

export const getConfig = quansync(function (this: Context | undefined, config: string) {
  return $.call(this, `git config ${config}`)
})

export const getRemoteURL = quansync(function (this: Context | undefined, name: string) {
  return $.call(this, `git remote get-url ${name}`)
})

export const getRemoteCommit = quansync(function* (this: Context | undefined, url: string, committish: string) {
  const line = yield* $.call(this, `git ls-remote ${url} ${committish}`)
  return line.split(/\s+/)[0]
})

export const getDifferences = quansync(function* (this: Context | undefined, committish: string) {
  const hash = yield* $.call(this, `git merge-base ${committish} HEAD`)
  if (hash) {
    const diffTree = yield* $.call(this, `git diff-tree --name-status -r ${hash} HEAD`)
    const lines = diffTree.split('\n').filter(Boolean)
    return lines.map(line => {
      const [status, name] = line.split(/\s+/)
      return { name, status }
    })
  }
  return []
})

export const getChangedFiles = quansync(function* (this: Context | undefined, committish: string) {
  const diff = yield* getDifferences.call(this, committish)
  return diff.filter(item => item.status !== 'D').map(item => item.name)
})

export const downloadFile = quansync({
  sync(url: string, committish: string, file: string): never {
    throw new Error('Not supported in sync mode')
  },
  async async(this: Context | undefined, url: string, committish: string, file: string) {
    const downloading = execa(`git archive --remote=${url} ${committish} -- ${file}`, { cwd: this?.cwd })
    const extracting = extract(downloading.child.stdout!, file)
    await downloading
    return extracting
  },
})
