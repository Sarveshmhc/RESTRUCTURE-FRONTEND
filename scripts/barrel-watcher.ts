#!/usr/bin/env node

import chokidar from 'chokidar';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../src/views/components');

console.log('🔍 Watching for component changes...');
console.log(`📁 Watching directory: ${componentsDir}`);

const watcher = chokidar.watch(componentsDir, {
    ignored: [
        '**/index.ts',           // Ignore the main barrel file itself
        '**/node_modules/**',
        '**/.git/**',
        '**/.DS_Store'
    ],
    persistent: true,
    ignoreInitial: false
});

let timeout: NodeJS.Timeout;

const regenerateBarrel = (event: string, filePath: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const relativePath = path.relative(componentsDir, filePath);
        console.log(`\n🔄 ${event} detected: ${relativePath}`);
        console.log('⚡ Regenerating barrel file...');

        try {
            execSync('tsx scripts/generate-barrel.ts', { stdio: 'inherit' });
            console.log('✅ Barrel file updated successfully!');
            console.log('👀 Continuing to watch for changes...\n');
        } catch (error) {
            console.error('❌ Error regenerating barrel:', error);
        }
    }, 500); // Debounce for 500ms to avoid multiple rapid regenerations
};

watcher
    .on('add', (filePath) => {
        if (filePath.includes('/index.ts') && filePath !== path.join(componentsDir, 'index.ts')) {
            regenerateBarrel('Component added', filePath);
        } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            regenerateBarrel('File added', filePath);
        }
    })
    .on('change', (filePath) => {
        if (filePath.includes('/index.ts') && filePath !== path.join(componentsDir, 'index.ts')) {
            regenerateBarrel('Component export changed', filePath);
        }
    })
    .on('unlink', (filePath) => {
        if (filePath.includes('/index.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
            regenerateBarrel('Component deleted', filePath);
        }
    })
    .on('addDir', (dirPath) => {
        const relativePath = path.relative(componentsDir, dirPath);
        if (relativePath && !relativePath.includes('node_modules')) {
            console.log(`📁 New component folder created: ${relativePath}`);
            // Don't regenerate immediately, wait for index.ts to be created
        }
    })
    .on('unlinkDir', (dirPath) => {
        const relativePath = path.relative(componentsDir, dirPath);
        if (relativePath && !relativePath.includes('node_modules')) {
            regenerateBarrel('Component folder deleted', dirPath);
        }
    })
    .on('error', (error) => {
        console.error('❌ Watcher error:', error);
    })
    .on('ready', () => {
        console.log('✅ Initial scan complete. Ready for changes!');
        console.log('💡 Tip: Create, modify, or delete components and watch the barrel update automatically!');
        console.log('🛑 Press Ctrl+C to stop watching\n');
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Stopping barrel watcher...');
    watcher.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n👋 Stopping barrel watcher...');
    watcher.close();
    process.exit(0);
});