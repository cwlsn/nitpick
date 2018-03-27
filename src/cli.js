#!/usr/bin/env node
// @flow
import generateOutput from './generateOutput'

// deps
const meow = require('meow')
const chalk = require('chalk')

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

const output = generateOutput(cli)

if (output !== '') {
	console.log(output)
}
