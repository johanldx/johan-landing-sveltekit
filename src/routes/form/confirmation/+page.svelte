<script lang="ts">
  import { onMount } from 'svelte';
  onMount(() => {
    setTimeout(() => {
      window.location.href = '/';
    }, 5000);
  });
</script>

<div class="container mx-auto text-center mt-32 px-4">
  <h1 class="text-3xl font-bold text-white mb-6">Merci pour votre message !</h1>
  <p class="text-lg text-gray-300 mb-4">Votre message a bien été envoyé.<br>Je vous répondrai dès que possible.</p>
  <p class="text-sm text-gray-400">Redirection vers la page d'accueil dans 5 secondes...</p>
</div> 