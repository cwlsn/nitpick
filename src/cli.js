#!/usr/bin/env node
// @flow

// deps
const fs = require('fs')
const meow = require('meow')
const chalk = require('chalk')

const checklist = [
	{
		name: 'package.json',
		prettyName: 'package.json',
		aliases: [],
		errors: [],
		package: false,
	},
	{
		name: 'README.md',
		prettyName: 'Readme file',
		aliases: [],
		errors: [],
		package: false,
	},
	{
		name: '.gitignore',
		prettyName: 'Git Ignore settings',
		aliases: [],
		errors: [],
		package: false,
	},
	{
		name: '.editorconfig',
		prettyName: 'Editor config',
		aliases: [],
		errors: [],
		package: false,
	},
	{
		name: '.eslintrc',
		prettyName: 'ESLint config',
		aliases: ['.eslintrc.json', '.eslintrc.yml'],
		errors: [],
		package: true,
		packageKey: 'eslint',
	},
	{
		name: '.eslintignore',
		prettyName: 'ESLint Ignore settings',
		aliases: ['.eslintignore.json', '.eslintignore.yml'],
		errors: [],
		package: false,
	},
	{
		name: '.babelrc',
		prettyName: 'Babel config',
		aliases: ['babelrc.json', 'babelrc.yml'],
		errors: [],
		package: true,
		packageKey: 'babel',
	},
	{
		name: '.travis.yml',
		prettyName: 'Travis CI config',
		aliases: [],
		errors: [],
		package: false,
	},
	{
		name: 'LICENSE.md',
		prettyName: 'License information',
		aliases: ['License.md', 'license.md', 'LICENSE'],
		errors: [],
		package: true,
		packageKey: 'license',
	},
]

let packageData = null
let ignorable = []
// redundant to check package.json twice
if (fs.existsSync('package.json')) {
	packageData = JSON.parse(fs.readFileSync('package.json', 'utf8'))
	if ('nitpick' in packageData && 'ignore' in packageData.nitpick) {
		ignorable = packageData.nitpick.ignore
	}
}

if (ignorable.length) {
	console.log(chalk.bold.yellow(`Ignoring: ${ignorable.join('m ')}`))
}

// filter the ignorable things
const filteredChecklist = checklist
	.filter(requirement => ignorable.indexOf(requirement.name) === -1)

// run through checklist
filteredChecklist.forEach(requirement => {
	if (!fs.existsSync(requirement.name)) {
		requirement.errors.push('File not found')
		if (requirement.package) {
			if (packageData && !(requirement.packageKey in packageData)) {
				requirement.errors.push(`Could not find key "${requirement.packageKey}" in package.json`)
			}
		}
		if (requirement.aliases.length) {
			const foundInAliases = requirement.aliases
				.filter(alias => fs.existsSync(alias))
			if (!foundInAliases.length) {
				requirement.errors.push('File not found, no aliases for file found')
			}
		}
	}

})

// This is printed when you --help
const cli = meow(chalk`
	{bold.yellow nitpick 🙈}
		{green Just run this in your projects root!}
`)

const output = filteredChecklist
	.map(requirement => {
		let response = ''
		if (requirement.errors.length) {
			response = chalk`{bold.red Found issues with ${requirement.prettyName}:}
${requirement.errors.map(error => chalk.red(`└─${error}`)).join('\n')}`
		} else {
			response = chalk`{bold.green Found no issues with ${requirement.prettyName}!}`
		}

		return response
	})
	.join('\n')

console.log(output)
