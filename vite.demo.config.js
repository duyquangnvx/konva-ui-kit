import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
	mode: 'production',
	base: './',
	
	build: {
		outDir: 'demo',
		cssCodeSplit: false,
		minify: false,
		
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html')
			},
			output: {
				inlineDynamicImports: true
			}
		},
		
		assetsInlineLimit: 100000000
	},
	
	// Resolve alias để đảm bảo có thể import từ 'konva-ui-kit'
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
	
	// Plugins
	plugins: [
		// Plugin để bundle tất cả vào một file HTML duy nhất
		viteSingleFile()
	]
}); 