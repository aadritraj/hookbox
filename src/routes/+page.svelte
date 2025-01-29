<script lang="ts">
	import { relativeTime } from "svelte-relative-time";

	let message = $state("");
	let status = $state("all good");
	let lastUpdate = $state(new Date());
	// this is enforced in the api,
	// if you were to change this change that there too
	let maxLength = 280;

	const dispatchMessage = async () => {
		lastUpdate = new Date();

		if (message.length == 0) {
			status = "message is empty";
			return;
		}

		if (message.length > maxLength) {
			status = "message is too long";
			return;
		}

		try {
			let response = await fetch("/api/messages", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ message: message })
			});

			if (!response.ok) {
				throw new Error("failed to send message");
			}

			let { statusText } = await response.json();

			message = "";

			status == statusText;
		} catch (error) {
			status = "last request failed!";
			console.error(error);
		}
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
			<span use:relativeTime={{ date: lastUpdate, locale: "en" }}></span>
		</p>
		<textarea
			class="textarea textarea-primary prose w-[66%] max-w-72 max-h-72 min-h-24 rounded-btn font-mono"
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
				<a
					class="link-hover link link-primary"
					href="https://github.com/aadritraj/hookbox/"
					target="_blank">here</a
				>
			</p>
		</aside>
	</footer>
</div>
