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
		name: 'LICENSE',
		prettyName: 'License information',
		aliases: ['License.md', 'license.md', 'LICENSE.md'],
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
const filteredChecklist = checklist.filter(
	requirement => ignorable.indexOf(requirement.name) === -1,
)

// run through checklist
filteredChecklist.forEach(requirement => {
	if (!fs.existsSync(requirement.name)) {
		requirement.errors.push('File not found')
		if (requirement.package) {
			if (packageData && !(requirement.packageKey in packageData)) {
				requirement.errors.push(
					`Could not find key "${requirement.packageKey}" in package.json`,
				)
			}
		}
		if (requirement.aliases.length) {
			const foundInAliases = requirement.aliases.filter(alias =>
				fs.existsSync(alias),
			)
			if (!foundInAliases.length) {
				requirement.errors.push('No known aliases for file found')
			}
		}
	}
})

// This is printed when you --help
const cli = meow(chalk`
	{bold.yellow nitpick}
	 {green └─Just run this in your projects root!}
	  Options
		--quiet, -q
		  └─will only output errors
		--disable-colors, -d
		  └─disable pretty colors, pls no
`)

// address flags
const quiet = cli.flags.quiet || cli.flags.q
if (cli.flags['disable-colors'] || cli.flags.d) {
	chalk.enabled = false
}

let overallSuccesses = 0
let overallErrors = 0

const output = filteredChecklist
	.map(requirement => {
		if (requirement.errors.length) {
			if (quiet) {
				throw new Error(
					`Encountered error in ${
						requirement.prettyName
					}, please run without quiet flag for more info.`,
				)
			}
			overallErrors += 1
			return chalk`{bold.red Found issues with ${requirement.prettyName}:}
${requirement.errors.map(error => chalk.red(`└─${error}`)).join('\n')}`
		}
		overallSuccesses += 1
		return chalk`{bold.green Found no issues with ${requirement.prettyName}!}`
	})
	.join('\n')
	.trim()

if (output.length && !quiet) {
	console.log(output)
}

const healthBarMultiplier = 8
const percentHealth = Math.round(
	overallSuccesses / (overallSuccesses + overallErrors) * 100,
)
const healthBar =
	chalk.bold.green('+'.repeat(overallSuccesses * healthBarMultiplier)) +
	chalk.bold.red('-'.repeat(overallErrors * healthBarMultiplier))

const random = array => array[Math.floor(Math.random() * array.length)]

const slams = [
	`that's decent for a beginner.`,
	'which is probably fine, probably.',
	'what are you doing about this?',
	`C'MON MAN`,
	'stop trying to swim upstream you salmon.',
]

const rewards = [
	'nice one!',
	'WOW!!1',
	'I am proud of you.',
	'you are destined for greatness!',
	'go get yourself a cookie AND a gold star!',
]

const potentialSlam = percentHealth === 100 ? random(rewards) : random(slams)

if (!quiet) {
	console.log('\n')
	console.log(healthBar)
	console.log(
		chalk` Your project scored {cyan.bold ${percentHealth}%}, {bold ${potentialSlam}}`,
	)
	console.log(healthBar)
}
