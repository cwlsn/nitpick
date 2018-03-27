import checklist from './checklist'
import rewards from './rewards'
import slams from './slams'

const chalk = require('chalk')
const fs = require('fs')

const generateOutput = cli => {
	let output = ''
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
		output += chalk.bold.yellow(`Ignoring: ${ignorable.join('m ')}`)
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

	// address flags
	const { quiet, explain } = cli.flags
	if (cli.flags.disableColors) {
		chalk.enabled = false
	}

	let overallSuccesses = 0
	let overallErrors = 0

	const results = filteredChecklist
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

	if (results.length && !quiet) {
		output += results
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
		output += chalk`

${healthBar}
 Your project scored {cyan.bold ${percentHealth}%}, {bold ${potentialSlam}}
${healthBar}`
	}

	return output.trim()
}

export default generateOutput
