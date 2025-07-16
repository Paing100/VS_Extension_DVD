
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
		this.images = ['dvd_logo_red.png', 'dvd_logo_purple.png', 'dvd_logo_blue.png'];
	}

	resolveWebviewView(webviewView, context, token) {

		const webview = webviewView.webview;

		const imageUris = this.images.map(image => (
			webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, image)).toString()
		));

		webview.options = {
			enableScripts: true, 
			localResourceRoots: [this.context.extensionUri],
		};
		webview.html = getWebViewContent(imageUris);
	}
}

function getWebViewContent(imageUris) {
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
					const images = ${jsImageArray};
					const logo = document.getElementById('logo');
					let x = 10;
					let y = 10;
					let dx = 100;
					let dy = 100;
					let index = 0;
					let lastTimestamp = null;

					function move(timestamp) {
						if(!lastTimestamp) {
							lastTimestamp = timestamp;
							requestAnimationFrame(move);
							return;
						}

						const delta = (timestamp - lastTimestamp) / 1000;
						lastTimestamp = timestamp;

						// Getting the boundries of the logo
						const logoWidth = logo.offsetWidth;
						const logoHeight = logo.offsetHeight;

						// Getting the boundries of the window (i.e. webview)
						const maxX = window.innerWidth - logoWidth;
						const maxY = window.innerHeight - logoHeight;
						let bounce = false;

						x += dx * delta;
						y += dy * delta;

						if (x <= 0) {
							x = 0; // if it hits left edge, put 0							
							dx *= -1;
							bounce = true;
						} else if (x >= maxX) {
							x = maxX; // if it hits right edge, put maxX
							dx *= -1;
							bounce = true;						
						}

						if (y <= 0) {
							y = 0;
							dy *= -1;
							bounce = true;
						} else if (y >= maxY) {
							y = maxY;
							dy *= -1;
							bounce = true;
						}

						if (bounce) {
							index = (index + 1) % 3; 
							logo.src = images[index];
						}

						logo.style.left = x + 'px';
						logo.style.top = y + 'px';

						requestAnimationFrame(move); 
					}
					requestAnimationFrame(move); 
				</script>
			</body>
		</html>
	`;
}