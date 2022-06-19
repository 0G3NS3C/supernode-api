

module.exports = {
	objectRecursive: (root, child) => (rc(root, child)),
	arrayIndexing: (root, child) => {
		for (let e in child) root[e] = child[e];
		return root;
	},
	arrayPush: (root, child) => {
		for (let e in child) {
			root.push(child[e]);
		}
	},
	customRouterRecursive: (root, child) => {
		let rootName = root.map((e) => (e.name));
		let childName = child.map((e) => (e.name));
		childName.forEach((e, i) => {
			if (rootName.indexOf(e) === -1) {
				root.push(child[i]);
			}
			else {
				let rootRouterName = root[i].router.map((e) => (e.name));
				let childRouterName = child[i].router.map((e) => (e.name));
				child[i].router.forEach((r, j) => {
					if (rootRouterName.indexOf(r.name) > -1) {
						root[i].router[j] = r;
					}
					else {
						root[i].router.unshift(r);
					}
				})
			}
		})
		return root;
	}
}

function rc(root, child) {
	for (let e in child) {
	    if (Array.isArray(child[e])){
	    if (!root[e]) root[e] = [];
	    root[e] = root[e].concat(child[e]);
	  }
	  else if (['object'].indexOf(typeof(child[e])) > -1) {
	    if (!root[e]) root[e] = {};
	    root[e] = rc(root[e], child[e]);
	  }
	  else {
	    root[e] = child[e]
	  }
	}
	return root;	
}