#!/usr/bin/env node
// @flow
import checklist from './checklist'
import slams from './slams'
import rewards from './rewards'

// deps
const fs = require('fs')
const meow = require('meow')
const chalk = require('chalk')

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
const cli = meow(
	chalk`
	{bold.yellow nitpick}
	 {green └─Just run this in your projects root!}
	  Options
		--quiet, -q
		  └─will only output errors
		--explain, -e
		  └─provide an explanation to errors, not compatible with --quiet
		--disable-colors, -d
		  └─disable pretty colors, pls no
	`,
	{
		flags: {
			quiet: {
				type: 'boolean',
				alias: 'q',
			},
			explain: {
				type: 'boolean',
				alias: 'e',
			},
			disableColors: {
				type: 'boolean',
				alias: 'd',
			},
		},
	},
)

// address flags
const { quiet, explain } = cli.flags
if (cli.flags.disableColors) {
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
${requirement.errors.map(error => chalk.red(`└─${error}`)).join('\n')}
${explain ? `└─${requirement.fix}` : ''}`
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

const potentialSlam = percentHealth === 100 ? random(rewards) : random(slams)

if (!quiet) {
	console.log('\n')
	console.log(healthBar)
	console.log(
		chalk` Your project scored {cyan.bold ${percentHealth}%}, {bold ${potentialSlam}}`,
	)
	console.log(healthBar)
}
