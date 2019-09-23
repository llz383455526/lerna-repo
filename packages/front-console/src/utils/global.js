export function $delete(form) {
	Object.keys(form).forEach((item) => {
		if (item.indexOf('$') === 0) {
			delete form[item]
		}
	})
}

export function $add(list) {
	list.map((item) => {
		Object.keys(item).forEach((item2) => {
			if (item[item2] === '' || item[item2] === null) {
				item[item2] = '-'
			}
		})
		return item
	})
}