/**
 * Vueno - VSCode extension entry point.
 * Watches for HTML file saves and converts them to Vue SFC + clean HTML.
 */
import * as vscode from 'vscode';
import { compileInlineStyle, createHtml, createVue, readFile, fileType } from './libs';

/** Activate the extension. */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Congratulations, your extension "vueno" is now active!');

  const disposable = vscode.commands.registerCommand('vueno.helloVueno', () => {
	vscode.window.showInformationMessage('Hello World!');
  });
  context.subscriptions.push(disposable);

  vscode.workspace.onDidSaveTextDocument(async (document: vscode.TextDocument) => {
	const { fileName } = document;
	const type = fileType(fileName);

	switch (type) {
	  case '.html': {
		const fileConfig = await readFile(fileName);
		const styleConfig = await compileInlineStyle({
		  ...fileConfig,
		  path: fileName,
		});
		createHtml(styleConfig);
		createVue(styleConfig);
		console.log(fileConfig, styleConfig);
		break;
	  }
	}
  });
}

/** Deactivate the extension. */
export function deactivate(): void {
  // Cleanup handled by VSCode disposables
}
