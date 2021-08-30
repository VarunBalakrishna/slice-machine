import path from 'path'
import { exec } from 'child_process'
import { parseDomain, fromUrl, ParseResultType, ParseResult } from 'parse-domain'

import { getPrismicData } from '../auth'
import initClient from '../models/common/http'

import { getConfig as getMockConfig } from '../mock/misc/fs'

import Files from '../utils/files'
import { SMConfig } from '../models/paths'

import Environment from '../models/common/Environment'
import ServerError from '../models/server/ServerError'
import Chromatic from '../models/common/Chromatic'
import FakeClient from '../models/common/http/FakeClient'
import { detectFramework } from '../framework'
import { ConfigErrors } from '../models/server/ServerState';

import { createComparator } from './semver'
import handleManifest, { ManifestStates, Manifest } from './manifest'
import UserConfig from '@lib/models/common/UserConfig'

const ENV_CWD = process.env.CWD || (process.env.TEST_PROJECT_PATH ? path.resolve(process.env.TEST_PROJECT_PATH) : '')

const compareNpmVersions = createComparator(path.join(ENV_CWD, 'package.json'))

function validate(config: Manifest): ConfigErrors {
  const errors: ConfigErrors = {}
  if (!config.storybook) {
    errors.storybook = {
      message: `Could not find storybook property in sm.json`,
      example: 'http://localhost:STORYBOOK_PORT',
      run: 'Add "storybook" property with a localhost url'
    }
  }
  return errors
}

function extractRepo(parsedRepo: ParseResult): string | undefined {
  switch (parsedRepo.type) {
    case ParseResultType.Listed:
      if (parsedRepo.labels.length) {
        return parsedRepo.labels[0]
      }
      if (parsedRepo.subDomains.length) {
        return parsedRepo.subDomains[0]
      }
    default: return
  }
}

function handleBranch(): Promise<{ branch?: string, err?: Error }> {
  return new Promise(resolve => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
      if (err) {
        resolve({ err })
      }
      resolve({ branch: stdout.trim() })
    })
  })
}

function createChromaticUrls({ branch, appId, err }: { branch?: string, appId?: string, err?: Error}): Chromatic | undefined {
  if (err || !branch || !appId) {
    return;
  }
  return {
    storybook: `https://${branch}--${appId}.chromatic.com`,
    library: `https://chromatic.com/library?appId=${appId}&branch=${branch}`
  }
}

function parseStorybookConfiguration(cwd: string) {
  const pathsToFile = [path.join(cwd, '.storybook/main.js'), path.join(cwd, 'nuxt.config.js')]
  const f = Files.readFirstOf(pathsToFile)(v => v)
  const file = f?.value as string || ''
  return file.includes('getStoriesPaths') || file.includes('.slicemachine')
}

export async function getEnv(maybeCustomCwd?: string): Promise<{ errors?: {[errorKey: string]: ServerError }, env: Environment }> {
  const cwd = maybeCustomCwd || ENV_CWD
  if (!cwd) {
    const message = '[api/env]: Unrecoverable error. Could not find cwd. Exiting..'
    console.error(message)
    throw new Error(message)
  }

  if (!Files.exists(SMConfig(cwd))) {
    const message = '[api/env]: Unrecoverable error. Could not find file sm.json. Exiting..'
    console.error(message)
    throw new Error(message)
  }

  const manifestState = handleManifest(cwd)
  if (manifestState.state !== ManifestStates.Valid) {
    console.error(manifestState.message)
    throw new Error(manifestState.message)
  }

  const userConfig = manifestState.content as UserConfig

  const maybeErrors = validate(userConfig)
  const hasGeneratedStoriesPath = parseStorybookConfiguration(cwd)
  const parsedRepo = parseDomain(fromUrl(userConfig.apiEndpoint))
  const repo = extractRepo(parsedRepo)
  const prismicData = getPrismicData()

  const branchInfo = await handleBranch()
  const chromatic = createChromaticUrls({ ...branchInfo, appId: userConfig.chromaticAppId })

  const npmCompare = await compareNpmVersions({ cwd })

  const mockConfig = getMockConfig(cwd)

  const client = (() => {
    if(prismicData.isOk()) {
      return initClient(cwd, prismicData.value.base, repo, prismicData.value.auth?.auth)
    } else {
      return new FakeClient()
    }
  })()

  return {
    errors: maybeErrors,
    env: {
      cwd,
      userConfig,
      repo,
      prismicData: prismicData.isOk() ? prismicData.value : undefined,
      chromatic,
      currentVersion: npmCompare.currentVersion || '',
      updateAvailable: npmCompare.updateAvailable || { current: '', next: '', message: 'Could not fetch remote version' },
      mockConfig,
      hasGeneratedStoriesPath,
      framework: detectFramework(cwd),
      baseUrl: `http://localhost:${process.env.PORT}`,
      client
    }
  }
}

