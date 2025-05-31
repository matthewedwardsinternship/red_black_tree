const drawNodes = (layers, withText, invertContrast) => {
	const canvas = document.createElement("canvas");
	canvas.className = "display-canvas";
	const ctx = canvas.getContext("2d");
	const layerHeight = Math.min(screen.width, screen.height) / layers.length;
	const size = canvas.width = canvas.height = layerHeight * Math.max(layers.length, layers[layers.length - 1].length);
	const radius = (1 / 3) * layerHeight;
	//first loop: draw lines between nodes
	const positionLayers = [];
	let offsetY = 0;
	for ( let i = 0, l = layers.length; i < l; i++ ) {
		const layer = layers[i];
		const layerWidth = layerHeight * layer.length;
		let offsetX = 0.5 * (size - layerWidth);
		const positionLayer = [];
		positionLayers.push(positionLayer);
		for ( let j = 0, l = layer.length; j < l; j++ ) {
			const node = layer[j];
			const x = offsetX + 0.5 * layerHeight;
			const y = offsetY + 0.5 * layerHeight;
			positionLayer.push({
				x,
				y
			});
			if ( node !== null && i !== 0 ) {
				const k = Math.floor(0.5 * j);
				ctx.strokeStyle = j % 2 === 0 ? "#0ff" : "#f00";
				ctx.lineWidth = 0.005 * size;
				ctx.beginPath();
				ctx.moveTo(positionLayers[i - 1][k].x, positionLayers[i - 1][k].y);
				ctx.lineTo(x, y);
				ctx.stroke();
			}
			offsetX += layerHeight;
		}
		offsetY += layerHeight;
	}
	for ( let i = 0, l = layers.length; i < l; i++ ) {
		const layer = layers[i];
		for ( let j = 0, l = layer.length; j < l; j++ ) {
			const node = layer[j];
			if ( node !== null ) {
				if ( node.isRed ) {
					ctx.fillStyle = "#f00";
				} else {
					ctx.fillStyle = "#000";
					ctx.strokeStyle = "rgb(200, 200, 200)";
					ctx.lineWidth = 0.005 * size;
				}
				ctx.beginPath();
				const {x, y} = positionLayers[i][j];
				ctx.arc(x, y, radius, 0, 2 * Math.PI);
				if ( node.isRed ) {
					ctx.fill();
				} else {
					ctx.fill();
					ctx.stroke();
				}
				if ( withText ) {
					ctx.fillStyle = node.isRed !== invertContrast ? "#000" : "rgb(200, 200, 200)";
					//red nodes are a little bit harder to see so make them a tiny bit larger
					ctx.font = `bold ${(node.isRed ? 0.6 : 0.5) * radius}px arial`;
					let text = node.value;
					if ( text.length > 10 ) {
						text = text.slice(0, 7) + "...";
					}
					const metrics = ctx.measureText(text);
					const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
					ctx.fillText(text, x - 0.5 * metrics.width, y + 0.5 * textHeight);
				}
			}
		}
	}
	return canvas;
};
const drawTree = layers => {
	const invertedCanvas = drawNodes(layers, true, true);
	const invertedCtx = invertedCanvas.getContext("2d");
	const normalCanvas = drawNodes(layers, true, false);
	const normalCtx = normalCanvas.getContext("2d");
	const mask = drawNodes(layers, false);
	invertedCtx.globalCompositeOperation = "destination-out";
	invertedCtx.drawImage(mask, 0, 0);
	normalCtx.drawImage(invertedCanvas, 0, 0);
	return normalCanvas;
};