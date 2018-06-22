module.exports = function stringGenerator (length, withSpaces) {
	var chars = 'abcdefghijklmnopqrstuvwxyz';
	if (withSpaces) {
		chars += ' ';
	}
	return new Array(parseInt(length)).fill(0).map(function() {
		return chars.charAt(Math.floor(Math.random() * chars.length));
	}).join('');
};
