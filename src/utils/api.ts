export async function loadXMLData() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_SITE_URL}/api/get-xml-data`
	);

	if (!response.ok) {
		console.error('Failed to fetch XML data');
		return;
	}

	const text = await response.text();
	console.log(text);
	return text;
}
