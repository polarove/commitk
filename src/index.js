#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'
import { clear, log } from 'console'
import { exec } from 'child_process'
import { exit } from 'process'
import figlet from 'figlet'
import steps from './steps.js'

const COLON = '：'
const BREAKING_CHANGE_MARKER = '!'
clear()
const useTerminalTitle = (title, color) =>
	log(color(figlet.textSync(title, { horizontalLayout: 'full' })))
useTerminalTitle('commitk', chalk.blue)

const checkGitStatus = () => {
	const gitStatus = 'git diff --cached'
	exec(gitStatus, (_, stdout, stderr) => {
		if (stderr) {
			log(chalk.red('运行 git diff 命令时发生错误'))
			exit(0)
		}
		if (stdout) init()
		else {
			console.log(chalk.yellow('[commitk]：暂无已保存的更改'))
			console.log(
				chalk.yellow(
					`[commitk]：运行 ${formatCode('git add 文件名')} 来保存更改`
				)
			)
			return exit(1)
		}
	})
}
checkGitStatus()

const formatCode = (code) => {
	return chalk.green(chalk.italic(code))
}

const init = () => {
	inquirer
		.prompt(steps)
		.then((res) => handleCommit(res))
		.catch((err) => console.warn(err))
}

const handleCommit = (output) => {
	let typeAndScope = undefined
	if (output.scope === '') typeAndScope = output.type
	else typeAndScope = output.type.concat('(').concat(output.scope).concat(')')
	if (output.breakingChange)
		typeAndScope = typeAndScope.concat(BREAKING_CHANGE_MARKER)
	clear()
	bigScreen({
		brief: typeAndScope.concat(COLON).concat(output.title),
		details: output.details
	})
}

const bigScreen = (commitMessage) => {
	const divider = (length, str = '') => {
		if (str.length < length) return divider(length, str.concat('-'))
		else return str
	}
	const title = '提交消息👇'
	const header = insertStr(
		divider(commitMessage.brief.length),
		commitMessage.brief.length / 2,
		'提交消息👇'
	)
	const footer = divider(commitMessage.brief.length + title.length + 4)
	log(chalk.green(header))
	newLine()
	log(commitMessage.brief)
	newLine()
	log(chalk.green(footer))
	ifContinue(commitMessage)
}

const ifContinue = (commitMessage) => {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'continue',
				message: chalk.yellow('确认提交本次更改？'),
				choices: ['是', '否'],
				filter: (input) => (input === '是' ? true : false)
			}
		])
		.then((answer) => {
			if (answer) return processCommit(commitMessage)
			else return exit(1)
		})
		.catch(() => {
			console.warn(chalk.bgYellowBright('[commitk]：意外错误'))
			exit(1)
		})
}

const processCommit = (commitMessage) => {
	let command = `git commit -m ${commitMessage.brief}`
	if (commitMessage.details)
		command = command.concat(' -m ').concat(commitMessage.details)
	log(command)
	exec(command, (err) => {
		if (err) {
			console.warn('😫 '.concat(chalk.red('提交时发生错误')))
			console.log(`· 命令：${commitCommand}`)
		} else console.log('👍 '.concat(chalk.green('已提交')))
	})
}

const insertStr = (source, at, plugin) =>
	source.slice(0, at).concat(plugin).concat(source.slice(at))

const newLine = () => log('\n')
