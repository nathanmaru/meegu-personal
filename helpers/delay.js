export default function delay(time, action) {
	let timer;
	const waitTime = time;

	// Clear timer
	clearTimeout(timer);

	// Wait for X ms and then process the request
	timer = setTimeout(() => {
		action();
	}, waitTime);
}
