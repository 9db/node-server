module.exports = {
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100
		},
	},
	modulePaths: ['<rootDir>/src', 'node_modules'],
	moduleFileExtensions: ['js', 'ts'],
	roots: [
		'test'
	],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	testEnvironment: 'node',
	testMatch: [
		'**/test/**/*.ts'
	]
};
