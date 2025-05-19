import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
	mode: 'development',
	base: './',
	
	build: {
		outDir: 'dist',
		
		cssCodeSplit: false,
		
		minify: false,
		
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'KonvaUIKit',
			formats: ['es', 'umd', 'cjs'],
			fileName: (format) => {
				if (format === 'es') return 'index.esm.js';
				if (format === 'cjs') return 'index.js';
				return `konva-ui-kit.${format}.js`;
			}
		},
		
		rollupOptions: {
			external: ['konva'],
			output: {
				globals: {
					konva: 'Konva'
				}
			}
		},
		
		assetsInlineLimit: 100000000
	},
	
	// Resolve alias
	resolve: {
		alias: {
			'konva-ui-kit': resolve(__dirname, 'src/index.ts')
		},
		extensions: ['.ts', '.js']
	},
	
	// Support TypeScript
	optimizeDeps: {
		include: ['konva']
	},
	
	plugins: [
		dts({
			include: ['src/**/*.ts'],
			outDir: 'dist',
			insertTypesEntry: true
		})
	]
}); 