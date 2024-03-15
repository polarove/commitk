import chalk from 'chalk'

/**
 * 格式必须为
 * A：B
 * 必须使用中文冒号
 */
const types = [
	'修复：bug相关的变更',
	'功能：新功能、修改已有功能',
	'格式：如文档格式化，重命名变量等',
	'性能：性能优化相关的更改',
	'文档：仅修改项目文档，不涉及源代码的修改',
	'撤销：撤回提交',
	'其他：任何不涉及源代码的修改'
]

const steps = [
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
		choices: types,
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
				if (value.length > 80) return '描述过长，请控制在80个字符以内👆'
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
]

export default steps
