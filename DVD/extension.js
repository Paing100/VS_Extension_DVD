
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'dvdView', 
			new DVDViewProvider(context)
		)
	);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}


class DVDViewProvider {
	constructor(context) {
		this.context = context;
	}

	resolveWebviewView(webviewView, context, token) {
		webviewView.webview.options = {
			enableScripts: true, 
		};
		webviewView.webview.html = getWebViewContent();
	}
}

function getWebViewContent() {
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body>
    		<p>HELLO!</p>
			</body>
		</html>
	`;
}