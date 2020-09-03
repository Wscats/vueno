const vscode = require('vscode');
const {
	compileInlineStyle,
	createHtml,
	createVue,
	readFile,
	fileType,
} = require('./libs');

function activate(context) {
	console.log('Congratulations, your extension "vueno" is now active!');
	let disposable = vscode.commands.registerCommand('vueno.helloVueno', function (document) {
		vscode.window.showInformationMessage('Hello World!');
	});
	context.subscriptions.push(disposable);

	vscode.workspace.onDidSaveTextDocument(async (document) => {
		const {
			fileName
		} = document
		console.log(fileType(fileName));
		const type = fileType(fileName);
		switch (type) {
			case '.html':
				const fileConfig = await readFile(fileName);
				const styleConfig = await compileInlineStyle({
					...fileConfig,
					path: fileName
				});
				createHtml(styleConfig)
				createVue(styleConfig)
				console.log(fileConfig, styleConfig);
				break;
		}
	});
}

exports.activate = activate;
function deactivate() { }
module.exports = {
	activate,
	deactivate
}
