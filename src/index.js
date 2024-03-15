#!/usr/bin/env node

import inquirer from 'inquirer'
import chalk from 'chalk'
import { clear, log } from 'console'
import { exec } from 'child_process'
import { exit } from 'process'
import figlet from 'figlet'

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
		.prompt([
			{
				type: 'list',
				name: 'breakingChange',
				message: chalk.yellow('是否有破坏性变更？'),
				choices: ['否', '是'],
				filter: (input) => (input === '是' ? true : false)
			},
			{
				type: 'list',
				name: 'type',
				message: chalk.blue('本次提交在哪些方面做出变动？'),
				choices: [
					'修复：bug相关的变更',
					'功能：新功能、修改已有功能',
					'格式：如文档格式化，重命名变量等',
					'性能：性能优化相关的更改',
					'文档：仅修改项目文档，不涉及源代码的修改',
					'撤销：撤回提交',
					'其他：任何不涉及源代码的修改'
				],
				validate: (value) => {
					if (value.length) return true
					else return '本次提交在哪些方面做出变动？'
				},
				filter: (input) => input.split('：')[0]
			},
			{
				type: 'input',
				name: 'title',
				message: chalk.green('对本次提交做一个简短的描述：'),
				validate: (value) => {
					if (value.length) {
						if (value.length > 80)
							return '描述过长，请控制在80个字符以内👆'
						else return true
					} else return '请输入一个简短的描述👆'
				}
			},
			{
				type: 'input',
				name: 'scope',
				message: chalk.dim('修改范围(可选)：')
			},
			{
				type: 'input',
				name: 'details',
				message: chalk.dim('详细描述(可选)：')
			}
		])
		.then((res) => handleCommit(res))
		.catch((err) => console.warn(err))
}

const handleCommit = (output) => {
	const result = parseCommitMessage(output)
	checkCommitMessage(result)
}

const parseCommitMessage = (output) => {
	let typeAndScope = undefined
	if (output.scope === '') typeAndScope = output.type
	else typeAndScope = output.type.concat('(').concat(output.scope).concat(')')
	if (output.breakingChange)
		typeAndScope = typeAndScope.concat(BREAKING_CHANGE_MARKER)
	return typeAndScope.concat(COLON).concat(output.title)
}

const checkCommitMessage = (commitMessage) => {
	clear()
	bigScreen(commitMessage)
}

const bigScreen = (message) => {
	const divider = (length, str = '') => {
		if (str.length < length) return divider(length, str.concat('-'))
		else return str
	}
	const title = '提交消息👇'
	const header = insertStr(
		divider(message.length),
		message.length / 2,
		'提交消息👇'
	)
	const footer = divider(message.length + title.length + 4)
	log(chalk.green(header))
	newLine()
	log(message)
	newLine()
	log(chalk.green(footer))
	ifContinue(message)
}

const ifContinue = (message) => {
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
			if (answer) return processCommit(message)
			else return exit(1)
		})
		.catch(() => {
			console.warn(chalk.bgYellowBright('[commitk]：意外错误'))
			exit(1)
		})
}

const processCommit = (message) => {
	const commitCommand = 'git commit -m '
	exec(commitCommand.concat(message), (err) => {
		if (err) {
			console.warn('😫 '.concat(chalk.red('提交时发生错误')))
			console.log(`· 命令：${commitCommand}`)
		} else console.log('👍 '.concat(chalk.green('已提交')))
	})
}

const insertStr = (source, at, plugin) =>
	source.slice(0, at).concat(plugin).concat(source.slice(at))

const newLine = () => log('\n')
