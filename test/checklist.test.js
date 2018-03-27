import checklist from '../src/checklist'

describe('there should be an array of requirements in order', () => {
	it('is an array', () => {
		expect(Array.isArray(checklist)).toBe(true)
	})

	it('starts with package.json', () => {
		expect(checklist[0].name).toBe('package.json')
	})

	it('then has README.md', () => {
		expect(checklist[1].name).toBe('README.md')
	})

	it('then has .gitignore', () => {
		expect(checklist[2].name).toBe('.gitignore')
	})

	it('then has .editorconfig', () => {
		expect(checklist[3].name).toBe('.editorconfig')
	})

	it('then has .eslintrc', () => {
		expect(checklist[4].name).toBe('.eslintrc')
	})

	it('then has .eslintignore', () => {
		expect(checklist[5].name).toBe('.eslintignore')
	})

	it('then has .babelrc', () => {
		expect(checklist[6].name).toBe('.babelrc')
	})

	it('then has .travis.yml', () => {
		expect(checklist[7].name).toBe('.travis.yml')
	})

	it('finally has LICENSE', () => {
		expect(checklist[8].name).toBe('LICENSE')
	})

	it('has length of 9', () => {
		expect(checklist.length).toBe(9)
	})
})
