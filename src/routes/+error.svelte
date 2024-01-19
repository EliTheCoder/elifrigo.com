<script lang="ts">
	import { page } from "$app/stores";
</script>

<div class="container">
	<h1 class="status">{$page.status}</h1>
	{#if $page.error != null}
		<h2 class="message">{$page.error.message}</h2>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		text-align: center;
	}
	h1.status {
		font-size: 4em;
		margin-bottom: 0.1em;
	}
	h2.message {
		font-size: 2em;
		margin-top: 0em;
	}
</style>
