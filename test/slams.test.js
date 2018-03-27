import slams from '../src/slams'

describe('there should be an array of slams', () => {
	it('is an array', () => {
		expect(Array.isArray(slams)).toBe(true)
	})
	it('has at least 5 items', () => {
		expect(slams.length).toBeGreaterThanOrEqual(5)
	})
})
