import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
	try {
		const directoryPath = path.join(process.cwd(), 'public', 'data');

		const files = await fs.readdir(directoryPath);

		const jsonFiles = files.filter((file) => file.endsWith('.json'));

		const fileData = await Promise.all(
			jsonFiles.map(async (file) => {
				const filePath = path.join(directoryPath, file);
				const content = await fs.readFile(filePath, 'utf-8');
				const json = JSON.parse(content);

				return {
					name: file.replace('.json', ''),
					updatedAt: json.updatedAt || '',
				};
			})
		);

		return new Response(JSON.stringify({ files: fileData }, null, 2), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error reading files:', error);
		return new Response('Failed to list files', { status: 500 });
	}
}
