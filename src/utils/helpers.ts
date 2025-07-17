export function getLocalDateTimeString() {
	const now = new Date();

	return new Date(Date.now() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export function formatReadableDate(datetime: string): string {
	const date = new Date(datetime);

	const time = date.toLocaleTimeString(undefined, {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	}).replace(/\s/g, '').toUpperCase();

	const datePart = date.toLocaleDateString(undefined, {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	}).replace(',', '');

	const [month, day, year] = datePart.split(' ');
	return `${time} | ${month}-${day}, ${year}`;
}