import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  getBranch,
  getChangedFiles,
  getCommit,
  getConfig,
  getCurrentBranch,
  getCurrentCommit,
  getDifferences,
  getRemoteCommit,
  getRemoteURL,
  getRootDirectory,
  hasCommit,
  hasConflicts,
  isMerging,
} from '../src'

describe('getCommit', () => {

  it('should return a SHA-1 hash string', async () => {
    const hash = await getCommit('HEAD')
    expect(hash).toMatch(/^[0-9a-z]{40}$/)
  })

})

describe('getCurrentCommit', () => {

  it('should be able to get hash of the current branch', async () => {
    const hash = await getCurrentCommit()
    expect(hash).toMatch(/^[0-9a-z]{40}$/)
  })

})

describe('hasCommit', () => {

  it('should be able to detect HEAD', async () => {
    const result = await hasCommit('HEAD')
    expect(result).toBe(true)
  })

  it('should not throw even if the committish is non-existing', async () => {
    const result = await hasCommit('non-existing-branch')
    expect(result).toBe(false)
  })

})

describe('isMerging', () => {

  it('should recognize current state', async () => {
    const state = await isMerging()
    expect(state).toBe(false)
  })

})

describe('hasConflicts', () => {

  it('should recognize current state', async () => {
    const state = await hasConflicts()
    expect(state).toBe(false)
  })

})

describe('getBranch', () => {

  it('should be able to get current branch', async () => {
    const branch = await getBranch('HEAD')
    expect(branch).toBe('main')
  })

})

describe('getCurrentBranch', () => {

  it('should be able to get current branch', async () => {
    const branch = await getCurrentBranch()
    expect(branch).toBe('main')
  })

})

describe('getRootDirectory', () => {

  it('should be able to get root directory', async () => {
    const root = await getRootDirectory()
    expect(root).toBe(path.resolve(import.meta.filename, '../..'))
  })

})

describe('getConfig', () => {

  it('should be able to get built-in config', async () => {
    const ignorecase = await getConfig('core.ignorecase')
    expect(ignorecase).toMatch(/^(true|false)$/)
  })

})

describe('getRemoteURL', () => {

  it('should be able to get remote URL with name', async () => {
    const url = await getRemoteURL('origin')
    expect(url).toEqual(expect.stringContaining('github.com'))
  })

})

describe('getRemoteCommit', () => {

  it('should be able to get main branch from GitHub', async () => {
    const hash = await getRemoteCommit('https://github.com/CyanSalt/git9.git', 'main')
    expect(hash).toMatch(/^[0-9a-z]{40}$/)
  })

})

describe('getDifferences', () => {

  it('should be able to get differences locally', async () => {
    const diff = await getDifferences('main')
    expect(Array.isArray(diff)).toBe(true)
    expect(diff.every(item => typeof item.name === 'string' && typeof item.status === 'string')).toBe(true)
  })

})

describe('getChangedFiles', () => {

  it('should be able to get changed files locally', async () => {
    const files = await getChangedFiles('main')
    expect(Array.isArray(files)).toBe(true)
    expect(files.every(file => typeof file === 'string')).toBe(true)
  })

})
