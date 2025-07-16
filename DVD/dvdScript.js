(function () {
          const images = window.images;
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
})();