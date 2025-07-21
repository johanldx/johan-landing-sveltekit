<script lang="ts">
  export let error;
  export let status;
</script>

<svelte:head>
  <title>Page non trouvée | Theed</title>
</svelte:head>

<div class="h-full w-full flex flex-col justify-center items-center px-4 mt-20">
  <h1 class="text-6xl font-extrabold text-white mb-4">404</h1>
  <h2 class="text-2xl font-bold text-white mb-2">Page non trouvée</h2>
  <p class="text-gray-400 mb-8 text-center max-w-md">Oups, la page que vous cherchez n'existe pas ou a été déplacée.<br>Retournez à l'accueil pour continuer la navigation.</p>
  <a href="/" class="px-6 py-3 bg-white text-gray-900 border-2 border-white rounded-lg font-semibold hover:bg-transparent hover:text-white hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900">
    Retour à l'accueil
  </a>
  {#if error && status !== 404}
    <div class="mt-8 text-sm text-gray-500">
      <p><strong>{status}</strong> {error.message}</p>
    </div>
  {/if}
</div> 