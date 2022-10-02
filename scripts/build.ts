import * as esbuild from 'esbuild';
import stylePlugin from 'esbuild-style-plugin';
import tailwindcss from 'tailwindcss';
import { tailwindConfig } from '../tailwind.config';
const autoprefiexer = require('autoprefixer');
const copyPlugin = require('esbuild-copy-static-files');

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isDev = NODE_ENV === 'development';
const outDir = NODE_ENV;

const onBuild = () => {
	console.log(`${new Date().toISOString()}: Built Successfully.`);
}

const onError = (err: any) => {
	console.error(err);
}

const options: esbuild.BuildOptions = {
	entryPoints: [
		'src/index.tsx',
		// 'src/worker.ts',
		// 'src/serviceWorker.ts',
	],
	outdir: `${outDir}`,
	bundle: true,
	define: {
		'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
	},
	minify: !isDev,
	sourcemap: isDev,
	watch: isDev ? {
		onRebuild: (err, res) => {
			if (err) {
				onError(err);
			} else {
				onBuild();
			}
		},
	} : false,
	target: ['chrome98', 'firefox97', 'edge98', 'safari14'],
	plugins: [
		stylePlugin({
			postcss: {
				plugins: [tailwindcss(tailwindConfig), autoprefiexer()],
			},
		}),
		copyPlugin({
			src: 'src/static',
			dest: `${outDir}`,
		}),
	],
};

const start = () => {
	esbuild.build(options).then((result) => {
		onBuild();
		if (!isDev) {
			process.exit(0);
		}
	}).catch((err) => {
		onError(err);
	});
	return;
}

start();
