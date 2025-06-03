window.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("demonstration-controls");
	form.addEventListener("submit", e => {
		e.preventDefault();
	});
	const {
		input,
		add,
		clear,
		download,
		zoom
	} = form.elements;
	const rbt = new RedBlackTree;
	while ( rbt.size() !== 4 ) {
		try {
			//duplicates will cause errors (expected behavior)
			const n = Math.floor(100 * Math.random());
			if ( n !== 30 ) {
				//the placeholder says "Example: 30"
				//there should be a 100% probability that the example works with the randomly generated sample tree
				rbt.insert(n);
			}
		}
		catch ( err ) {
			//
		}
	}
	const output = document.getElementById("main-content");
	const update = () => {
		//maxHeight is the depth of the tree
		let maxHeight = 0;
		{
			//traversal order does not matter here
			const stack = [];
			if ( rbt.root !== null ) {
				stack.push([rbt.root, 1]);
			}
			while ( stack.length !== 0 ) {
				const [node, height] = stack.pop();
				if ( height > maxHeight ) {
					maxHeight = height;
				}
				if ( node.getLeft() !== null ) {
					stack.push([node.getLeft(), height + 1]);
				}
				if ( node.getRight() !== null ) {
					stack.push([node.getRight(), height + 1]);
				}
			}
		}
		//array contains a list of pairs (node, level) in level-order
		const array = [];
		{
			const nodeList = [];
			const peek = () => nodeList[0];
			if ( rbt.root !== null ) {
				nodeList.push([rbt.root, 1]);
			}
			while ( nodeList.length !== 0 ) {
				if ( peek()[1] !== maxHeight ) {
					if ( peek()[0] !== null && peek()[0].getLeft() !== null ) {
						nodeList.push([peek()[0].getLeft(), peek()[1] + 1]);
					} else {
						nodeList.push([null, peek()[1] + 1]);
					}
					if ( peek()[0] !== null && peek()[0].getRight() !== null ) {
						nodeList.push([peek()[0].getRight(), peek()[1] + 1]);
					} else {
						nodeList.push([null, peek()[1] + 1]);
					}
				}
				array.push(nodeList.shift());
			}
		}
		//levels contains the data from the RBT in a format that can be read by my UI code
		const levels = [];
		{
			for ( let i = 0; i < maxHeight; i++ ) {
				levels[i] = [];
			}
			for ( const [node, height] of array ) {
				let obj;
				if ( node === null ) {
					obj = null;
				} else {
					obj = {
						isRed: node.isRed(),
						//will show quotes around string nodes (and escape quotes if the string contains quotes)
						value: JSON.stringify(node.getData())
					};
				}
				levels[height - 1].push(obj);
			}
		}
		//clear out the output and add in the new tree
		{
			output.innerHTML = "";
			output.appendChild(drawTree(levels));
		}
	};
	update();
	add.addEventListener("click", () => {
		let value = input.value.trim();
		const n = Number(value);
		if ( isNaN(n) === false ) {
			value = n;
		}
		if ( value.length === 0 ) {
			alert("Input must not be an empty string.");
		} else {
			try {
				rbt.insert(value);
			}
			catch ( err ) {
				alert("Duplicate values are not allowed.");
			}
			input.value = "";
			update();
		}
	});
	clear.addEventListener("click", () => {
		rbt.clear();
		update();
	});
	download.addEventListener("click", () => {
		const canvas = output.querySelector("canvas");
		canvas.toBlob(blob => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.download = "My Red Black Tree.png";
			a.href = url;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}, "image/png");
	});
	const mainContentScale = document.getElementById("main-content-scale");
	const mainContentScrollWrapper = document.getElementById("main-content-scroll-wrapper");
	const updateRange = () => {
		const {value} = zoom;
		const zoomDecimal = value / 1000;
		const {scrollWidth, scrollHeight} = mainContentScrollWrapper;
		mainContentScale.style.transform = `scale(${zoomDecimal})`;
		mainContentScale.style.width = `${100 / Math.max(1, zoomDecimal)}%`;
		mainContentScrollWrapper.scrollLeft += 0.5 * (mainContentScrollWrapper.scrollWidth - scrollWidth);
		mainContentScrollWrapper.scrollTop += 0.5 * (mainContentScrollWrapper.scrollHeight - scrollHeight);
	};
	zoom.addEventListener("input", () => {
		updateRange();
	});
	zoom.addEventListener("dblclick", () => {
		zoom.value = 1000;
		updateRange();
	});
});