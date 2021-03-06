const chalk = require('chalk')

const checklist = [
	{
		name: 'package.json',
		prettyName: 'package.json',
		aliases: [],
		errors: [],
		package: false,
		fix: chalk`From your project's root, run: {yellow $ npm init -y}`,
	},
	{
		name: 'README.md',
		prettyName: 'Readme file',
		aliases: ['readme.md', 'README'],
		errors: [],
		package: false,
		fix: chalk`From your project's root, run: {yellow $ touch README.md} and edit`,
	},
	{
		name: '.gitignore',
		prettyName: 'Git Ignore settings',
		aliases: [],
		errors: [],
		package: false,
		fix: chalk`From your project's root, run: {yellow $ touch .gitignore}. Make sure to include things like {cyan /node_modules/!}`,
	},
	{
		name: '.editorconfig',
		prettyName: 'Editor config',
		aliases: [],
		errors: [],
		package: false,
		fix: chalk`From your project's root, run: {yellow $ touch .editorconfig}. Here is a recommended file: {cyan https://gist.github.com/cwlsn/8cd6ba2f536176a2d35df2fcb860a4ab}`,
	},
	{
		name: '.eslintrc',
		prettyName: 'ESLint config',
		aliases: ['.eslintrc.json', '.eslintrc.yml'],
		errors: [],
		package: true,
		packageKey: 'eslint',
		fix: chalk`From your project's root, run: {yellow $ touch .eslintrc}. Info on ESLint is here: {cyan https://eslint.org}`,
	},
	{
		name: '.eslintignore',
		prettyName: 'ESLint Ignore settings',
		aliases: ['.eslintignore.json', '.eslintignore.yml'],
		errors: [],
		package: false,
		fix: chalk`From your project's root, run: {yellow $ touch .eslintignore}. Info on ESLint is here: {cyan https://eslint.org}`,
	},
	{
		name: '.babelrc',
		prettyName: 'Babel config',
		aliases: ['.babelrc.json', '.babelrc.yml'],
		errors: [],
		package: true,
		packageKey: 'babel',
		fix: chalk`From your project's root, run: {yellow $ touch .babelrc}. Info on Babel is here: {cyan https://babeljs.io}`,
	},
	{
		name: '.travis.yml',
		prettyName: 'Travis CI config',
		aliases: [],
		errors: [],
		package: false,
		fix: chalk`Travis CI requires GitHub integration. See if it's right for you here {cyan https://travis-ci.org/}`,
	},
	{
		name: 'LICENSE',
		prettyName: 'License information',
		aliases: ['license.md', 'LICENSE.md'],
		errors: [],
		package: true,
		packageKey: 'license',
		fix: chalk`It's recommended to include a license, even if you are unsure of which one (try MIT in that case). Light reading: {cyan https://en.wikipedia.org/wiki/Software_license}`,
	},
]

export default checklist
