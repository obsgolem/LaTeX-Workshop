import * as path from 'path'
import * as process from 'process'
import * as tmpFile from 'tmp'
import { runTests } from '@vscode/test-electron'

async function runTestSuites(fixture: 'testground' | 'multiroot') {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../')
        const extensionTestsPath = path.resolve(__dirname, './suites/index')

        await runTests({
            version: '1.71.0',
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs: [
                'test/fixtures/' + fixture + (fixture === 'multiroot' ? '/resource.code-workspace' : ''),
                '--user-data-dir=' + tmpFile.dirSync({ unsafeCleanup: true }).name,
                '--extensions-dir=' + tmpFile.dirSync({ unsafeCleanup: true }).name,
                '--disable-gpu'
            ],
            extensionTestsEnv: {
                LATEXWORKSHOP_CI: '1',
                LATEXWORKSHOP_CLI: '1'
            }
        })
    } catch (error) {
        console.error(error)
        console.error('Failed to run tests')
        process.exit(1)
    }
}

async function main() {
    try {
        await runTestSuites('testground')
        await runTestSuites('multiroot')
    } catch (err) {
        console.error('Failed to run tests')
        process.exit(1)
    }
}

void main()
