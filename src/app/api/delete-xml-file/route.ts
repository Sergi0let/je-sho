import { promises as fs } from 'fs';
import path from 'path';

export async function DELETE(req: Request) {
	try {
		const { productSlug } = await req.json();
		console.log('Delete Rout: ', productSlug);

		if (!productSlug) {
			return Response.json(
				{ error: 'Product slug is required' },
				{ status: 400 }
			);
		}

		const filePath = path.join(
			process.cwd(),
			'public',
			'data',
			`${productSlug}.json`
		);
		console.log('FielePath: ', filePath);
		// Перевіряємо існування файлу перед видаленням
		try {
			await fs.access(filePath);
		} catch {
			return Response.json({ error: 'File not found' }, { status: 404 });
		}

		await fs.unlink(filePath);

		return Response.json(
			{ message: 'File deleted successfully' },
			{ status: 200 }
		);
	} catch (error) {
		console.error('Error in DELETE route');
		return new Response(`Webhook error: ${error}`, { status: 400 });
	}
}
