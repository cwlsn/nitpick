import rewards from '../src/rewards'

describe('there should be an array of awards', () => {
	it('is an array', () => {
		expect(Array.isArray(rewards)).toBe(true)
	})
	it('has at least 5 items', () => {
		expect(rewards.length).toBeGreaterThanOrEqual(5)
	})
})
