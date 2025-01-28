import { HOOK_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { message } = await request.json();

	let data = {
		content: "You've got mail!",
		embeds: [
			{
				title: 'Hookbox',
				color: 5814783,
				timestamp: new Date().toISOString(),
				fields: [
					{
						name: 'Message',
						value: message
					}
				],
				footer: {
					text: 'hookbox'
				}
			}
		],
		attachments: []
	};

	let result = await fetch(HOOK_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	});

	// standards compliant? probably not!
	// do i care? absolutely not!

	if (!result.ok) {
		return json({ error: 'Failed to send message' }, { status: 500 });
	}

	return json({ sent: message }, { status: 200 });
};
