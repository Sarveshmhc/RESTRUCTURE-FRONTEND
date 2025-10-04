#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(__dirname, '../src/views/components');
const indexFile = path.join(componentsDir, 'index.ts');

interface ExportResult {
    type: 'default' | 'named' | 'exportAll' | 'none';
    exportName: string | null;
    reason: string;
    content: string;
}

interface Warning {
    folder: string;
    reason: string;
    content: string;
}

function getComponentFolders(): string[] {
    return fs.readdirSync(componentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .sort();
}

// Improved function to properly detect export type from index.ts
function detectExportType(componentPath: string, componentName: string): ExportResult {
    const indexPath = path.join(componentPath, 'index.ts');

    if (!fs.existsSync(indexPath)) {
        return {
            type: 'none',
            exportName: null,
            reason: 'No index.ts file found',
            content: ''
        };
    }

    let content = fs.readFileSync(indexPath, 'utf8');
    // Remove comments and extra whitespace for cleaner analysis
    content = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').trim();

    console.log(`\n🔍 Checking ${componentName}:`);
    console.log(`   File: ${indexPath}`);
    console.log(`   Content: "${content}"`);

    // Extract actual export name from patterns like "export { default as ActualName }"
    const defaultAsMatch = content.match(/export\s*{\s*default\s+as\s+(\w+)\s*}/i);
    const directNamedMatch = content.match(/export\s*{\s*(\w+)\s*}/i);

    // Check for export * pattern
    const exportAllMatch = content.match(/export\s*\*\s*from\s*['"']\.\/(\w+)['"']/i);

    // Check for pure default export: "export { default }" 
    const pureDefaultPattern = /export\s*{\s*default\s*}\s*from/i;
    const hasPureDefault = pureDefaultPattern.test(content);

    if (exportAllMatch) {
        // Found "export * from './componentName'" - this re-exports everything
        const componentFileName = exportAllMatch[1];
        const pascalCaseName = toPascalCase(componentFileName);
        console.log(`   Found export all: ${componentFileName} -> ${pascalCaseName}`);
        return {
            type: 'exportAll',
            exportName: pascalCaseName,
            reason: `Found "export * from './${componentFileName}'" - re-exports all`,
            content: content
        };
    } else if (defaultAsMatch) {
        // Found "export { default as ActualName }" - use the actual name
        const actualExportName = defaultAsMatch[1];
        console.log(`   Found default as named: ${actualExportName}`);
        return {
            type: 'named',
            exportName: actualExportName,
            reason: `Found "export { default as ${actualExportName} }" - creates named export`,
            content: content
        };
    } else if (directNamedMatch && !hasPureDefault) {
        // Found "export { ActualName }" - use the actual name
        const actualExportName = directNamedMatch[1];
        console.log(`   Found direct named: ${actualExportName}`);
        return {
            type: 'named',
            exportName: actualExportName,
            reason: `Found direct named export: ${actualExportName}`,
            content: content
        };
    } else if (hasPureDefault) {
        // "export { default } from" is a default re-export
        const pascalCaseName = toPascalCase(componentName);
        console.log(`   Found pure default - using: ${pascalCaseName}`);
        return {
            type: 'default',
            exportName: pascalCaseName,
            reason: 'Found pure default re-export',
            content: content
        };
    } else {
        return {
            type: 'none',
            exportName: null,
            reason: 'No recognizable export pattern found',
            content: content
        };
    }
}

function generateBarrelFile(): void {
    console.log('🔍 Running TypeScript barrel generation...\n');

    const componentFolders = getComponentFolders();
    const exports: string[] = [];
    const warnings: Warning[] = [];

    componentFolders.forEach(folder => {
        const componentPath = path.join(componentsDir, folder);
        const { type, exportName, reason, content } = detectExportType(componentPath, folder);

        console.log(`\n📋 Result for ${folder}:`);
        console.log(`   Type: ${type}`);
        console.log(`   Export Name: ${exportName}`);
        console.log(`   Reason: ${reason}`);

        switch (type) {
            case 'default':
                if (exportName) {
                    exports.push(`export { default as ${exportName} } from "./${folder}";`);
                    console.log(`   ✅ Generated: export { default as ${exportName} } from "./${folder}/index";`);
                }
                break;

            case 'named':
                if (exportName) {
                    exports.push(`export { ${exportName} } from "./${folder}";`);
                    console.log(`   📦 Generated: export { ${exportName} } from "./${folder}/index";`);
                }
                break;

            case 'exportAll':
                exports.push(`export * from "./${folder}";`);
                console.log(`   🌟 Generated: export * from "./${folder}";`);
                break;

            case 'none':
                warnings.push({ folder, reason, content });
                console.log(`   ⚠️  Skipped: ${reason}`);
                break;
        }
    });

    // Generate the TypeScript barrel file content
    const content = `/**
 * @file Automatically generated TypeScript barrel file.
 * Export types detected automatically: default exports use "export { default as Name }", named exports use "export { Name }".
 */

${exports.join('\n')}
`;

    // Write the barrel file
    fs.writeFileSync(indexFile, content);

    console.log(`\n✅ Generated TypeScript barrel exports for ${exports.length} components`);
    const defaultCount = exports.filter(e => e.includes('default as')).length;
    const namedCount = exports.filter(e => !e.includes('default as') && !e.includes('export *')).length;
    const exportAllCount = exports.filter(e => e.includes('export *')).length;

    console.log(`📊 Export types: ${defaultCount} default, ${namedCount} named, ${exportAllCount} export-all`);

    if (warnings.length > 0) {
        console.log(`\n⚠️  Skipped ${warnings.length} components:`);
        warnings.forEach(({ folder, reason }) => {
            console.log(`   ${folder}: ${reason}`);
        });
    }

    console.log(`\n📁 TypeScript barrel file updated: ${path.relative(process.cwd(), indexFile)}`);
}

function toPascalCase(str: string): string {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

// Run the script
generateBarrelFile();