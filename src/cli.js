import arg from 'arg';
import fs from 'fs';
import path from 'path';
import * as fileCreator from './file-creator';
import * as fileMofifier from './file-modifier';

const basePath = '/Users/slian/Workspace/fulfillment/fulfillment-tools/submodules/coman';

export async function cli(args) {
	const params = parseArgumentsIntoOptions(args);
	await createComponent(params.name);
}

async function createComponent(name) {
	try {
		fs.mkdirSync(path.resolve(basePath, `./app/form_display/${name}`));
	} catch(ex) {}
	try {
		fs.mkdirSync(path.resolve(basePath, `./app/form_editing/${name}`));
	} catch(ex) {}
	try {
		fs.mkdirSync(path.resolve(basePath, `./app/form_editing/${name}/setting`));
	} catch(ex) {}

	const createdFiles = fileCreator.getFiles(name);
	for (const file of createdFiles) {
		await createFile(file.path, file.content);
	}

	const modifiedFiles = fileMofifier.getFiles(name);
	for (const file of modifiedFiles) {
		await modifyFile(file.path, file.replaceContent);
	}

	// const sharedModelPath = path.resolve(basePath, `./app/form_display/models/form-display-field-model.js`);
	// const sharedModelContent = (await fs.readFileSync(sharedModelPath)).toString();
	// const injection = getInjectionInSharedModel(name);

	// const injectedsharedModelContent = sharedModelContent.replace(/(static createFieldModel.*else if.*)(\}\s*else \{)/s, (searchValue, r1, r2) => {
	// 	return `${r1}${injection}`;
	// })
	// await fs.writeFileSync(sharedModelPath, injectedsharedModelContent);
}

async function createFile(filePath, content) {
	const templatePath = path.resolve(basePath, filePath);
	const templateContent = new Uint8Array(Buffer.from(content));

	await fs.writeFileSync(templatePath, templateContent);
}

async function modifyFile(filePath, replaceFun) {
	const absolutePath = path.resolve(basePath, filePath);
	const fileContent = (await fs.readFileSync(absolutePath)).toString();

	const injectedContent = replaceFun(fileContent);
	await fs.writeFileSync(absolutePath, injectedContent);
}



function convertToCamelCase(str) {
	return str.replace(/(^|-)([a-z])/g, (match, a1, a2) => {
		return a2.toUpperCase();
	})
}

function parseArgumentsIntoOptions(rawArgs) {
	const args = arg(
		{
			'--name': String,
		},
		{
			argv: rawArgs.slice(2),
		}
	);
	return {
		name: args['--name'] || 'demo-input',
	};
}
