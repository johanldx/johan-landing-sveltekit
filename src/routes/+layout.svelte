<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import Cursor from '$lib/components/Cursor.svelte';

	$: hideFooter = $page.url.pathname === '/form/confirmation' || $page.status === 404;
</script>

<main class="flex flex-col min-h-screen">
	<Header />
	<div class="flex-1 flex flex-col">
		{#key $page.url.pathname}
			<div class="contents" transition:fade={{ duration: 350 }}>
				<slot />
			</div>
		{/key}
	</div>
	{#if !hideFooter}
		<Footer />
	{/if}
	<Cursor />
</main>