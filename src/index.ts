import * as childProcess from 'child_process'
import * as util from 'util'
import { extract } from './tar'

const execa = util.promisify(childProcess.exec)

async function $(command: string) {
  const { stdout } = await execa(command)
  return stdout.trim()
}

export function getCommittish(committish: string) {
  return $(`git rev-parse -q --verify ${committish}`)
}

export function getBranch() {
  return $('git rev-parse --abbrev-ref HEAD')
}

export async function isMerging() {
  try {
    const id = await getCommittish('MERGE_HEAD')
    return Boolean(id)
  } catch {
    return false
  }
}

export function getConfig(config: string) {
  return $(`git config ${config}`)
}

export async function getRemoteCommittish(url: string, committish: string) {
  const line = await $(`git ls-remote ${url} ${committish}`)
  return line.split(/\s+/)[0]
}

export async function getDifferences(diffWith: string) {
  const hash = await $(`git merge-base ${diffWith} HEAD`)
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

export async function getChangedFiles(diffWith: string) {
  const diff = await getDifferences(diffWith)
  return diff.filter(item => item.status !== 'D').map(item => item.name)
}

export async function downloadFile(url: string, committish: string, file: string) {
  const downloading = execa(`git archive --remote=${url} ${committish} -- ${file}`)
  const extracting = extract(downloading.child.stdout!, file)
  await downloading
  return extracting
}
