import * as childProcess from 'child_process'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import * as util from 'util'
import { describe, expect, it } from 'vitest'
import {
  getRootDirectory,
} from '../src'

const execa = util.promisify(childProcess.exec)

describe('default', () => {

  it('should respect this arg as context', async () => {
    const repo = await fs.mkdtemp(path.join(os.tmpdir(), 'git9-test-'))
    const realpath = await fs.realpath(repo)
    await execa('git init', { cwd: repo })
    const root = await getRootDirectory.call({ cwd: repo })
    expect(root).toBe(realpath)
  })

})

describe('async', () => {

  it('should respect this arg as context', async () => {
    const repo = await fs.mkdtemp(path.join(os.tmpdir(), 'git9-test-'))
    const realpath = await fs.realpath(repo)
    await execa('git init', { cwd: repo })
    const root = await getRootDirectory.async.call({ cwd: repo })
    expect(root).toBe(realpath)
  })

})

describe('sync', () => {

  it('should respect this arg as context', async () => {
    const repo = await fs.mkdtemp(path.join(os.tmpdir(), 'git9-test-'))
    const realpath = await fs.realpath(repo)
    await execa('git init', { cwd: repo })
    const root = getRootDirectory.sync.call({ cwd: repo })
    expect(root).toBe(realpath)
  })

})
