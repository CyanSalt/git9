import * as childProcess from 'child_process'
import * as util from 'util'
import { extract } from './tar'

const execa = util.promisify(childProcess.exec)

async function $(command: string) {
  const { stdout } = await execa(command)
  return stdout.trim()
}

export function getCommit(committish: string) {
  return $(`git rev-parse -q ${committish}`)
}

export function getCurrentCommit() {
  return getCommit('HEAD')
}

export async function hasCommit(committish: string) {
  try {
    const id = await $(`git rev-parse -q --verify ${committish}`)
    return Boolean(id)
  } catch {
    return false
  }
}

export function isMerging() {
  return hasCommit('MERGE_HEAD')
}

export async function hasConflicts(subpath?: string) {
  try {
    await $(`git diff --name-only --diff-filter=U --exit-code${subpath ? ' ' + subpath : ''}`)
    return false
  } catch {
    return true
  }
}

export function getBranch(committish: string) {
  return $(`git rev-parse --abbrev-ref ${committish}`)
}

export function getCurrentBranch() {
  return getBranch('HEAD')
}

export function getConfig(config: string) {
  return $(`git config ${config}`)
}

export function getRemoteURL(name: string) {
  return $(`git remote get-url ${name}`)
}

export async function getRemoteCommit(url: string, committish: string) {
  const line = await $(`git ls-remote ${url} ${committish}`)
  return line.split(/\s+/)[0]
}

export async function getDifferences(committish: string) {
  const hash = await $(`git merge-base ${committish} HEAD`)
  if (hash) {
    const diffTree = await $(`git diff-tree --name-status -r ${hash} HEAD`)
    const lines = diffTree.split('\n').filter(Boolean)
    return lines.map(line => {
      const [status, name] = line.split(/\s+/)
      return { name, status }
    })
  }
  return []
}

export async function getChangedFiles(committish: string) {
  const diff = await getDifferences(committish)
  return diff.filter(item => item.status !== 'D').map(item => item.name)
}

export async function downloadFile(url: string, committish: string, file: string) {
  const downloading = execa(`git archive --remote=${url} ${committish} -- ${file}`)
  const extracting = extract(downloading.child.stdout!, file)
  await downloading
  return extracting
}
