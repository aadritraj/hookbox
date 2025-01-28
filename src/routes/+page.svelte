<script lang="ts">
	import { relativeTime } from 'svelte-relative-time';

	let message = $state('');
	let status = $state('all good');
	let lastUpdate = $state(new Date());
	let maxLength = 280;

	let rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

	const dispatchMessage = async () => {
		let response = await fetch('/api/messages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message: message })
		});

		message = '';
		lastUpdate = new Date();

		response.status == 200
			? (status = 'previous message sent')
			: (status = 'previous message failed to send');
	};
</script>

<svelte:head>
	<title>hookbox</title>
	<meta name="description" content="sends your messages to a webhook" />
</svelte:head>

<div class="flex h-screen flex-col justify-between">
	<div class="flex flex-col items-center space-y-2">
		<h1 class="text-center text-2xl font-semibold">hookbox</h1>
		<p class="text-center">
			sends your messages to a webhook<br />the current character limit is {maxLength}
		</p>
		<p class="text-center">
			status: {status}<br />last update:
			<span use:relativeTime={{ date: lastUpdate, locale: 'en' }}></span>
		</p>
		<textarea
			class="prose w-[66%] max-w-72 rounded-btn font-mono"
			placeholder="what will you send?"
			maxlength={maxLength}
			bind:value={message}
		></textarea>
		<button onclick={dispatchMessage} class="btn btn-primary w-[66%] max-w-72">send</button>
	</div>

	<footer class="footer footer-center bg-base-300 p-4 text-base-content">
		<aside>
			<p>
				Copyright © {new Date().getFullYear()} - aadritraj. Source-available under MIT
				<a class="link-hover link link-primary" href="https://github.com/aadritraj/hookbox/" target="_blank">here</a>
			</p>
		</aside>
	</footer>
</div>
