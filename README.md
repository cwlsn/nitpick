<p align="center">
	<br>
	<img width="500" src="https://user-images.githubusercontent.com/10063864/37803938-1fa67e1e-2e08-11e8-8ca2-bd0f2e064bce.png" alt="nitpick">
	<br>
</p>

[![NPM version](https://img.shields.io/npm/v/nitpick.svg?style=flat-square)](https://npmjs.org/package/nitpick)
[![Build Status](https://img.shields.io/travis/cwlsn/nitpick/master.svg?style=flat-square)](https://travis-ci.org/cwlsn/nitpick) [![Coverage Status](https://img.shields.io/codecov/c/github/cwlsn/nitpick/master.svg?style=flat-square)](https://codecov.io/gh/cwlsn/nitpick/branch/master)

A command line tool to make you feel bad about how you set up your app.

## Install

    $ npm i -g nitpick

## Usage

In your project's root directory, simply run:

    $ nitpick

### Options

- `--disable-colors` (`-d`): Disable beatiful colors, will happen automatically in terminals that can't handle color;
- `--explain` (`-e`): Provide an explanation on how to fix an error, note: will not work with `--quiet`;
- `--quiet` (`-q`): Run silently, will throw error if necessary;

### Ignoring rules

In `package.json`, add a `nitpick` key:

```json
{
	...
	"nitpick": {
		"ignore": [
			<rules>
		]
	}
	...
}
```

The identifiers are:

```
package.json
README.md
.gitignore
.editorconfig
.eslintrc
.eslintignore
.babelrc
LICENSE
.travis.yml
```

### Aliases

Some packages can be used in different ways, such as including Babel options in your `package.json` file. Current valid filename aliases are as follows:

```
README.md
└─readme.md
└─README
.eslintrc
└─.eslintrc.json
└─.eslintrc.yml
.eslintignore
└─.eslintignore.json
└─.eslintignore.yml
.babelrc
└─.babelrc.json
└─.babelrc.yml
LICENSE
└─license.md
└─LICENSE.md
```

Current files with `package.json` support:

- `.eslintrc` -> `"eslint"`
- `.babelrc` -> `"babel"`
- `LICENSE` -> `"license"`

## License

MIT © [Connor Wilson](https://cwlsn.com)
