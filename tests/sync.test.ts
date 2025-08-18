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

  it('should return a SHA-1 hash string', () => {
    const hash = getCommit.sync('HEAD')
    expect(hash).toMatch(/^[0-9a-z]{40}$/)
  })

})

describe('getCurrentCommit', () => {

  it('should be able to get hash of the current branch', () => {
    const hash = getCurrentCommit.sync()
    expect(hash).toMatch(/^[0-9a-z]{40}$/)
  })

})

describe('hasCommit', () => {

  it('should be able to detect HEAD', () => {
    const result = hasCommit.sync('HEAD')
    expect(result).toBe(true)
  })

  it('should not throw even if the committish is non-existing', () => {
    const result = hasCommit.sync('non-existing-branch')
    expect(result).toBe(false)
  })

})

describe('isMerging', () => {

  it('should recognize current state', () => {
    const state = isMerging.sync()
    expect(state).toBe(false)
  })

})

describe('hasConflicts', () => {

  it('should recognize current state', () => {
    const state = hasConflicts.sync()
    expect(state).toBe(false)
  })

})

describe('getBranch', () => {

  it('should be able to get current branch', () => {
    const branch = getBranch.sync('HEAD')
    expect(branch).toBe('main')
  })

})

describe('getCurrentBranch', () => {

  it('should be able to get current branch', () => {
    const branch = getCurrentBranch.sync()
    expect(branch).toBe('main')
  })

})

describe('getRootDirectory', () => {

  it('should be able to get root directory', () => {
    const root = getRootDirectory.sync()
    expect(root).toBe(path.resolve(import.meta.filename, '../..'))
  })

})

describe('getConfig', () => {

  it('should be able to get built-in config', () => {
    const ignorecase = getConfig.sync('core.ignorecase')
    expect(ignorecase).toMatch(/^(true|false)$/)
  })

})

describe('getRemoteURL', () => {

  it('should be able to get remote URL with name', () => {
    const url = getRemoteURL.sync('origin')
    expect(url).toEqual(expect.stringContaining('github.com'))
  })

})

describe('getRemoteCommit', () => {

  it('should be able to get main branch from GitHub', () => {
    const hash = getRemoteCommit.sync('https://github.com/CyanSalt/git9.git', 'main')
    expect(hash).toMatch(/^[0-9a-z]{40}$/)
  })

})

describe('getDifferences', () => {

  it('should be able to get differences locally', () => {
    const diff = getDifferences.sync('main')
    expect(Array.isArray(diff)).toBe(true)
    expect(diff.every(item => typeof item.name === 'string' && typeof item.status === 'string')).toBe(true)
  })

})

describe('getChangedFiles', () => {

  it('should be able to get changed files locally', () => {
    const files = getChangedFiles.sync('main')
    expect(Array.isArray(files)).toBe(true)
    expect(files.every(file => typeof file === 'string')).toBe(true)
  })

})
