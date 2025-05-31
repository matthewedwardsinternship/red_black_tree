//the compareTo function can compare both strings and numbers
const compareTo = (a, b) => {
	if ( typeof a === "number" && typeof b === "number" ) {
		return Math.sign(a - b);
	}
	a = String(a);
	b = String(b);
	if ( a < b ) {
		return -1;
	}
	if ( a === b ) {
		return 0;
	}
	return 1;
};
class BSTNode {
	constructor(data){
		this.data = data;
		this.up = null;
		this.left = null;
		this.right = null;
	}
	getData(){
		return this.data;
	}
	getLeft(){
		return this.left;
	}
	getRight(){ 
		return this.right;
	}
	getUp(){
		return this.up;
	}
	setData(newParent){
		this.up = newParent;
	}
	setLeft(newLeftChild){
		this.left = newLeftChild;
	}
	setRight(newRightChild){
		this.right = newRightChild;
	}
	setUp(up){
		this.up = up;
	}
	isRightChild(){
		return this.getUp() !== null && this.getUp().getRight() === this;
	}
	toString(){
        return this.data.toString();
    }
	//my UI code for displaying a red black tree relies on the level order so this will be good to refrence
	toLevelOrderString(){
		const nodeList = [];
		const peek = () => nodeList[0];
		nodeList.push(this);
		let str = "";
		str += "[ ";
		while ( nodeList.length !== 0 ) {
			if ( peek().getLeft() !== null ) {
				nodeList.push(peek().getLeft());
			}
			if ( peek().getRight() !== null ) {
				nodeList.push(peek().getRight());
			}
			//either this is pop or shift (try it both ways I guess)
			str += nodeList.shift().toString();
			if ( nodeList.length === 0 ) {
				str += " ]";
			} else {
				str += ", ";
			}
		}
		return str;
	}
};
class RBTNode extends BSTNode {
	#isRed = true;
	constructor(data){
		super(data);
	}
	isRed(){
		return this.#isRed;
	}
	flipColor(){
		this.#isRed = !this.#isRed;
	}
	toString(){
        return this.data.toString() + ( this.isRed() ? "(r)" : "(b)" );
    }
};
class BinarySearchTree {
	constructor(){
		this.root = null;
	}
	insertHelper(newNode, subtree){
		if ( subtree === null ) {
			return;
		}
		const newData = newNode.getData();
		const subtreeData = subtree.getData();
		switch ( compareTo(newData, subtreeData) ) {
			case -1:
				{
					const left = subtree.getLeft();
					if ( left === null ) {
						subtree.setLeft(newNode);
						newNode.setUp(subtree);
					} else {
						this.insertHelper(newNode, left);
					}
				}
				break;
			case 1:
				{
					const right = subtree.getRight();
					if ( right === null ) {
						subtree.setRight(newNode);
						newNode.setUp(subtree);
					} else {
						this.insertHelper(newNode, right);
					}
				}
				break;
			case 0:
				throw "Duplicate values are not supported.";
		}
	}
	recursiveInsert(data){
		if ( data === null ) {
			throw "Data can't be null.";
		}
		const newNode = new BSTNode(data);
		if ( this.root === null ) {
			this.root = newNode;
		} else {
			this.insertHelper(newNode, this.root);
		}
	}
	insert(data){
		this.recursiveInsert(data);
	}
	getNode(data){
		if ( data === null ) {
			throw "Data can't be null.";
		}
		if ( this.isEmpty() ) {
			//nothing is in the tree so data is not in the tree
			return null;
		}
		let currentNode = this.root;
		//a negative integer, zero, or a positive integer as this object is less than, equal to, or greater than the specified object.
		while ( true ) {
			const nodeData = currentNode.getData();
			switch ( compareTo(data, nodeData) ) {
				case -1:
					//data > nodeData (left subtree)
					{
						const left = currentNode.getLeft();
						if ( left === null ) {
							return null;
						} else {
							currentNode = left;
						}
					}
					break;
				case 1:
					//data < nodeData (right subtree)
					{
						const right = currentNode.getRight();
						if ( right === null ) {
							return null;
						} else {
							currentNode = right;
						}
					}
					break;
				case 0:
					//the value was found because data === nodeData
					return currentNode;
			}
		}
		//no return statement here because it would be unreachable
	}
	contains(data){
		return this.getNode(data) !== null;
	}
	size(){
		if ( this.isEmpty() ) {
			return 0;
		}
		const stack = [];
		let ret = 0;
		stack.push(this.root);
		while ( stack.length !== 0 ) {
			const node = stack.pop();
			ret++;
			const left = node.getLeft();
			const right = node.getRight();
			if ( left !== null ) {
				stack.push(left);
			}
			if ( right !== null ) {
				stack.push(right);
			}
		}
		return ret;
	}
	isEmpty(){
		return this.root === null;
	}
	clear(){
		this.root = null;
	}
};
class BSTRotation extends BinarySearchTree {
	constructor(){
		super();
	}
	rotate(child, parent){
    	if ( child === null || parent === null ) {
			throw "Parent and child arguments can't be null.";
    	}
    	if ( parent.getLeft() === child ) {
			//right rotate
			const b = child.getRight();
			parent.setLeft(b);
			child.setRight(parent);
			if ( this.root === parent ) {
				//if the root is the parent, then change the root to the child
				this.root = child;
				child.setUp(null);
			} else {
				//get the parent of the parent in order to swap the two nodes
				const parentParent = parent.getUp();
				if ( parentParent.getLeft() === parent ) {
					parentParent.setLeft(child);
				} else {
					parentParent.setRight(child);
				}
				child.setUp(parentParent);
			}
    	} else if ( parent.getRight() === child ) {
			//left rotate
			const b = child.getLeft();
			parent.setRight(b);
			child.setLeft(parent);
			if ( this.root === parent ) {
				//if the root is the parent, then change the root to the child
				this.root = child;
				child.setUp(null);
			} else {
				//get the parent of the parent in order to swap the two nodes
				const parentParent = parent.getUp();
				if ( parentParent.getLeft() === parent ) {
					parentParent.setLeft(child);
				} else {
					parentParent.setRight(child);
				}
				child.setUp(parentParent);
			}
    	} else {
			throw "The child node must be a child of the parent node.";
    	}
    	parent.setUp(child);
    }
};
class RedBlackTree extends BSTRotation {
	constructor(){
		super();
		this.root = null;
	}
	#getParent(node){
		if ( node === null ) {
			return null;
		}
		return node.getUp();
	}
	#getGrandparent(node){
		if ( node === null ) {
			return null;
		}
		const parent = this.#getParent(node);
		if ( parent === null ) {
			return null;
		}
		const grandParent = parent.getUp();
		if ( grandParent === null ) {
			return null;
		}
		return grandParent;
	}
	#getAunt(node) {
		if ( node === null ) {
			return null;
		}
		const parent = this.#getParent(node);
		if ( parent === null ) {
			return null;
		}
		const grandParent = parent.getUp();
		if ( grandParent === null ) {
			return null;
		}
		let aunt;
		if ( grandParent.getLeft() === parent ) {
			aunt = grandParent.getRight();
		} else {
			aunt = grandParent.getLeft();
		}
		if ( aunt === null ) {
			return null;
		}
		return aunt;
	}
	#getParentIsRed(node) {
		if ( node === null ) {
			return false;
		}
		const aunt = this.#getParent(node);
		return aunt === null ? false : aunt.isRed();
	}
	#getAuntIsRed(node) {
		if ( node === null ) {
			return false;
		}
		const aunt = this.#getAunt(node);
		return aunt === null ? false : aunt.isRed();
	}
	#turnRed(node){
		if ( node !== null && node.isRed() === false ) {
			node.flipColor();
		}
	}
	#turnBlack(node){
		if ( node !== null && node.isRed() ) {
			node.flipColor();
		}
	}
	#shortRotate(node, rightRotate){
		this.rotate(rightRotate ? node.getLeft() : node.getRight(), node);
	}
	#isRightChild(node){
		const parent = this.#getParent(node);
        const isRightChild = parent.getRight() === node;
		return isRightChild;
	}
	#ensureRedProperty(newRedNode) {
		if ( this.root !== newRedNode && this.#getGrandparent(newRedNode) !== null ) {
			while ( this.#getParentIsRed(newRedNode) ) {
				if ( this.#getAuntIsRed(newRedNode) ) {
					this.#turnBlack(this.#getParent(newRedNode));
					this.#turnBlack(this.#getAunt(newRedNode));
					this.#turnRed(this.#getGrandparent(newRedNode));
					newRedNode = this.#getGrandparent(newRedNode);
					continue;
				}
				const parentIsRight = this.#isRightChild(this.#getParent(newRedNode));
				if ( this.#isRightChild(newRedNode) !== parentIsRight ) {
					newRedNode = this.#getParent(newRedNode);
					if ( newRedNode === this.root ) break;
					this.#shortRotate(newRedNode, parentIsRight);
				}
				this.#turnBlack(this.#getParent(newRedNode));
				this.#turnRed(this.#getGrandparent(newRedNode));
				this.#shortRotate(this.#getGrandparent(newRedNode), !parentIsRight);
			}
		}
		//the root must be black
		this.#turnBlack(this.root);
	}
	insert(data){
		if ( data === null ) {
			throw "Data can't be null.";
		}
		const newNode = new RBTNode(data);
		if ( this.root === null ) {
			this.root = newNode;
		} else {
			this.insertHelper(newNode, this.root);
		}
		this.#ensureRedProperty(newNode);
	}
}