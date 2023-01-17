import { spawn } from 'child_process'
import { build } from 'esbuild'
let server;
build({
    entryPoints: ['./app.js'],
    watch: {
        onRebuild: () => {
            console.log('Reiniciando...')
            if (server) server.kill('SIGINT') // Si ya hay un servidor ejecutandose, lo matamos
            server = spawn('node', ['./'], { stdio: 'inherit' }) // Al terminar el re-build lanza el servidor
        }
    },
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node18',
    format: "esm",
    packages: "external",
    outfile: './dist/index.js',
}).then(() => {
    console.log("Hecho 🚀")
    server = spawn('node', ['./'], { stdio: 'inherit' }) // Al terminar el build lanza el servidor
}).catch(() => process.exit(1))