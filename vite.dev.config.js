import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	mode: 'development',
	base: './',
	
	server: {
		port: 3000,
		open: true
	},
	
	build: {
		outDir: 'dist',
		
		minify: false,
		
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html')
			},
			output: {
				assetFileNames: 'assets/[name]-[hash][extname]',
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js'
			}
		}
	},
	
	// Resolve alias
	resolve: {
		alias: {
			'konva-ui-kit': resolve(__dirname, 'src/index.js')
		}
	}
}); 