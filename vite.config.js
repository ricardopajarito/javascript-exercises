import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: { 
            provider: 'v8',
            reporter: ['text', 'lcov'] 
        }, // lcov reporter is used by IDE coverage extensions
        include: [
            'tests/**/test-*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],
    },
})