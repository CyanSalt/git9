import assert from 'node:assert'
import { describe, it } from 'node:test'
import {
  getBranch,
  getChangedFiles,
  getCommittish,
  getConfig,
  getCurrentBranch,
  getDifferences,
  getRemoteCommittish,
  hasCommittish,
  isMerging,
} from '../dist/index.mjs'

describe('getCommittish', () => {

  it('should return a SHA-1 hash string', async () => {
    const hash = await getCommittish('HEAD')
    assert.match(hash, /^[0-9a-z]{40}$/)
  })

})

describe('hasCommittish', () => {

  it('should be able to detect HEAD', async () => {
    const result = await hasCommittish('HEAD')
    assert.strictEqual(result, true)
  })

  it('should not throw even if the committish is non-existing', async () => {
    const result = await hasCommittish('non-existing-branch')
    assert.strictEqual(result, false)
  })

})

describe('isMerging', () => {

  it('should recognize current state', async () => {
    const state = await isMerging()
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

describe('getConfig', () => {

  it('should be able to get built-in config', async () => {
    const ignorecase = await getConfig('core.ignorecase')
    assert.match(ignorecase, /^(true|false)$/)
  })

})

describe('getRemoteCommittish', () => {

  it('should be able to get main branch from GitHub', async () => {
    const hash = await getRemoteCommittish('https://github.com/CyanSalt/git9.git', 'main')
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
