import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteSingleFile } from 'vite-plugin-singlefile';

// https://vitejs.dev/config/
export default defineConfig({
	mode: 'production',
	base: './',
	
	build: {
		outDir: 'dist',
		
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
	
	// Resolve alias
	resolve: {
		alias: {
			'konva-ui-kit': resolve(__dirname, 'src/index.ts')
		}
	},
	
	// Plugins
	plugins: [
		// Plugin for single file
		viteSingleFile()
	]
}); 