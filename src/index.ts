import * as childProcess from 'child_process'
import * as util from 'util'
import { quansync } from 'quansync'
import { extract } from './tar'

const execa = util.promisify(childProcess.exec)

const $ = quansync({
  sync: (command: string) => {
    const stdout = childProcess.execSync(command, { encoding: 'utf8' })
    return stdout.trim()
  },
  async: async (command: string) => {
    const { stdout } = await execa(command)
    return stdout.trim()
  },
})

export const getCommit = quansync(function (committish: string) {
  return $(`git rev-parse -q ${committish}`)
})

export const getCurrentCommit = quansync(function () {
  return getCommit('HEAD')
})

export const hasCommit = quansync(function* (committish: string) {
  try {
    const id = yield* $(`git rev-parse -q --verify ${committish}`)
    return Boolean(id)
  } catch {
    return false
  }
})

export const isMerging = quansync(function () {
  return hasCommit('MERGE_HEAD')
})

export const hasConflicts = quansync(function* (subpath?: string) {
  try {
    yield* $(`git diff --name-only --diff-filter=U --exit-code${subpath ? ' ' + subpath : ''}`)
    return false
  } catch {
    return true
  }
})

export const getBranch = quansync(function (committish: string) {
  return $(`git rev-parse --abbrev-ref ${committish}`)
})

export const getCurrentBranch = quansync(function () {
  return getBranch('HEAD')
})

export const getRootDirectory = quansync(function () {
  return $(`git rev-parse --show-toplevel`)
})

export const getConfig = quansync(function (config: string) {
  return $(`git config ${config}`)
})

export const getRemoteURL = quansync(function (name: string) {
  return $(`git remote get-url ${name}`)
})

export const getRemoteCommit = quansync(function* (url: string, committish: string) {
  const line = yield* $(`git ls-remote ${url} ${committish}`)
  return line.split(/\s+/)[0]
})

export const getDifferences = quansync(function* (committish: string) {
  const hash = yield* $(`git merge-base ${committish} HEAD`)
  if (hash) {
    const diffTree = yield* $(`git diff-tree --name-status -r ${hash} HEAD`)
    const lines = diffTree.split('\n').filter(Boolean)
    return lines.map(line => {
      const [status, name] = line.split(/\s+/)
      return { name, status }
    })
  }
  return []
})

export const getChangedFiles = quansync(function* (committish: string) {
  const diff = yield* getDifferences(committish)
  return diff.filter(item => item.status !== 'D').map(item => item.name)
})

export const downloadFile = quansync({
  sync: (url: string, committish: string, file: string): never => {
    throw new Error('Not supported in sync mode')
  },
  async: async (url: string, committish: string, file: string) => {
    const downloading = execa(`git archive --remote=${url} ${committish} -- ${file}`)
    const extracting = extract(downloading.child.stdout!, file)
    await downloading
    return extracting
  },
})
