import * as esbuild from 'esbuild';
import * as fs from 'fs';
import sassPlugin from 'esbuild-sass-plugin';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isDev = NODE_ENV === 'development';
const outDir = NODE_ENV;

const onBuild = () => {
	const copiedFiles = [
		// 'manifest.json',
		// 'icons/favicon.ico',
		// 'icons/icon-192x192.png',
		// 'icons/icon-512x512.png',
	];
	if (!fs.existsSync(`./${outDir}/static/assets/icons`)) {
		fs.mkdirSync(`./${outDir}/static/assets/icons`);
	}
	fs.copyFileSync('src/static/index.html', `${outDir}/static/index.html`);
	for (let i = 0; i < copiedFiles.length; i += 1) {
		const copiedFilePath = copiedFiles[i];
		fs.copyFileSync(`src/static/${copiedFilePath}`, `${outDir}/static/assets/${copiedFilePath}`);
	}
	console.log(`${new Date().toISOString()}: Built Successfully.`);
}

const options: esbuild.BuildOptions = {
	entryPoints: [
		'src/index.tsx',
		// 'src/worker.ts',
		// 'src/serviceWorker.ts',
	],
	outdir: `${outDir}/static/assets/`,
	bundle: true,
	define: {
		'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
	},
	minify: !isDev,
	sourcemap: isDev,
	watch: isDev ? {
		onRebuild: (err, res) => {
			if (err) {
				console.error(err.message);
			} else {
				onBuild();
			}
		},
	} : false,
	target: ['chrome98', 'firefox97', 'edge98', 'safari14'],
	plugins: [sassPlugin()],
};

const start =  () => {
	esbuild.build(options).then(result => {
		onBuild();
	});
	if (!isDev) {
		process.exit(0);
	}
	return;
}

start();
