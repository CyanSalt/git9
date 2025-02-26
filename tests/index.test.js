import assert from 'node:assert'
import path from 'node:path'
import { describe, it } from 'node:test'
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
} from '../dist/index.mjs'

describe('getCommit', () => {

  it('should return a SHA-1 hash string', async () => {
    const hash = await getCommit('HEAD')
    assert.match(hash, /^[0-9a-z]{40}$/)
  })

})

describe('getCurrentCommit', () => {

  it('should be able to get hash of the current branch', async () => {
    const hash = await getCurrentCommit()
    assert.match(hash, /^[0-9a-z]{40}$/)
  })

})

describe('hasCommit', () => {

  it('should be able to detect HEAD', async () => {
    const result = await hasCommit('HEAD')
    assert.strictEqual(result, true)
  })

  it('should not throw even if the committish is non-existing', async () => {
    const result = await hasCommit('non-existing-branch')
    assert.strictEqual(result, false)
  })

})

describe('isMerging', () => {

  it('should recognize current state', async () => {
    const state = await isMerging()
    assert.strictEqual(state, false)
  })

})

describe('hasConflicts', () => {

  it('should recognize current state', async () => {
    const state = await hasConflicts()
    assert.strictEqual(state, false)
  })

})

describe('getBranch', () => {

  it('should be able to get current branch', async () => {
    const branch = await getBranch('HEAD')
    assert.strictEqual(branch, 'main')
  })

})

describe('getCurrentBranch', () => {

  it('should be able to get current branch', async () => {
    const branch = await getCurrentBranch()
    assert.strictEqual(branch, 'main')
  })

})

describe('getRootDirectory', () => {

  it('should be able to get root directory', async () => {
    const root = await getRootDirectory()
    assert.strictEqual(root, path.resolve(import.meta.filename, '../..'))
  })

})

describe('getConfig', () => {

  it('should be able to get built-in config', async () => {
    const ignorecase = await getConfig('core.ignorecase')
    assert.match(ignorecase, /^(true|false)$/)
  })

})

describe('getRemoteURL', () => {

  it('should be able to get remote URL with name', async () => {
    const url = await getRemoteURL('origin')
    assert.ok(url.includes('github.com'))
  })

})

describe('getRemoteCommit', () => {

  it('should be able to get main branch from GitHub', async () => {
    const hash = await getRemoteCommit('https://github.com/CyanSalt/git9.git', 'main')
    assert.match(hash, /^[0-9a-z]{40}$/)
  })

})

describe('getDifferences', () => {

  it('should be able to get differences locally', async () => {
    const diff = await getDifferences('main')
    assert.ok(Array.isArray(diff))
    assert.ok(diff.every(item => typeof item.name === 'string' && typeof item.status === 'string'))
  })

})

describe('getChangedFiles', () => {

  it('should be able to get changed files locally', async () => {
    const files = await getChangedFiles('main')
    assert.ok(Array.isArray(files))
    assert.ok(files.every(file => typeof file === 'string'))
  })

})
