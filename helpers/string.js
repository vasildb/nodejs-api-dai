/*
	Takes a Big Number and decimal count
	Returns it in readable format
	Note: it doesn't consider the case if the number has less than 18 digits
*/
function numberReadable(n, decimals = 18) {
	if (n === "0" || n === "0.") return "0";

	const position = n.length - decimals;
	// add the decimal point
	n = n.substring(0, position) + "." + n.substring(position);
	// remove zeros from the end
	n = n.replace(/0+$/, "");
	// add 0 if it starts with a dot
	if (n[0] === ".") n = "0" + n;
	// remove dot if it's last
	if (n[n.length - 1] === ".") n = n.slice(0, -1);

	return n;
}

module.exports = { numberReadable };
