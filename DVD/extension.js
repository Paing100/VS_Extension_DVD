
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand('DVDBouncer.runDVDBouncer',
		() => {
			vscode.window.registerWebviewViewProvider(
				'dvdView', 
				new DVDViewProvider(context)
			)
		}
	)
	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}


class DVDViewProvider {
	constructor(context) {
		this.context = context;		
		this.images = ['dvd_logo_red.png', 'dvd_logo_purple.png', 'dvd_logo_blue.png'];
	}

	resolveWebviewView(webviewView, context, token) {

		const webview = webviewView.webview;

		const imageUris = this.images.map(image => (
			webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'assets/' + image)).toString()
		));

		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'dvdScript.js')).toString();

		webview.options = {
			enableScripts: true, 
			localResourceRoots: [this.context.extensionUri],

		};
		webview.html = getWebViewContent(imageUris, scriptUri);
	}
}

function getWebViewContent(imageUris, scriptUri) {
	const currentImage = imageUris[0];
	const jsImageArray = JSON.stringify(imageUris);
	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<style>
					html, body {
						height: 100%;
						width: 100%;
						margin: 0;
						padding: 0;
						border: 1px solid white;
						box-sizing: border-box;
					}
					img {
						position: absolute;
					}
				</style>
			</head>
			<body>
				<img id="logo" height="20" width="25" src="${currentImage}"></img>
				<script>
					window.images = ${jsImageArray}
				</script>
				<script src="${scriptUri}"></script>
			</body>
		</html>
	`;
}