<script lang="ts">
    import { onMount } from "svelte";

    interface Album {
        title: string;
        artist: string;
        tracks: number;
        cover_xl: string;
        link: string;
        artist_picture: string;
    }

    interface DeezerResponse {
        data: Array<{
            title: string;
            artist: { name: string; picture_medium: string };
            nb_tracks: number;
            cover_xl: string;
            link: string;
        }>;
    }

    let searchTxt = "";
    let albumsList: Album[] = [];
    let selectedAlbum: Album | null = null;
    let isLoading = false;
    let isPageLoading = true;
    let hasSearched = false;
    let stylesLoaded = false;

    function search() {
        if (!searchTxt.trim()) return;
        
        isLoading = true;
        albumsList = [];
        hasSearched = true;

        (window as any).DZ.api("/search/album?q=" + searchTxt, function(response: DeezerResponse) {
            searchTxt = "";
            albumsList = [];

            for (let i = 0; i < response.data.length; i++) {
                albumsList.push({
                    title: response.data[i].title,
                    artist: response.data[i].artist.name,
                    tracks: response.data[i].nb_tracks,
                    cover_xl: response.data[i].cover_xl,
                    link: response.data[i].link,
                    artist_picture: response.data[i].artist.picture_medium
                });

                console.log(response.data[i]);
            }
            
            if (albumsList.length > 0) {
                selectedAlbum = albumsList[0];
            }
            
            isLoading = false;
            isPageLoading = false;
        });
    }

    function updateData(index: number) {
        selectedAlbum = albumsList[index];
    }

    async function download() {
        if (!selectedAlbum) return;

        try {
            const response = await fetch(selectedAlbum.cover_xl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = `${selectedAlbum.title} - ${selectedAlbum.artist}.jpeg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            alert("Échec du téléchargement du fichier!");
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.code === "Enter") {
            search();
        }
    }

    onMount(() => {
        setTimeout(() => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        stylesLoaded = true;
                    }, 100);
                });
            } else {
                setTimeout(() => {
                    stylesLoaded = true;
                }, 100);
            }
        }, 50);
    });
</script>

<svelte:head>
    <script src="https://e-cdn-files.dzcdn.net/js/min/dz.js"></script>
  <title>Mujika | Johan Ledoux | Theed</title>
  <meta name="description" content="Téléchargez des pochettes d'albums en haute qualité gratuitement" />
</svelte:head>

<div id="dz-root"></div>

<div class="">
    <div class="container mx-auto px-4 py-12 max-w-7xl overflow-x-hidden">
        {#if stylesLoaded}
        <div class="text-center mb-16">
            <h1 class="text-5xl font-extrabold text-white mb-6">Album Cover Downloader</h1>
            <p class="text-xl text-gray-300 max-w-2xl mx-auto">Téléchargez des pochettes d'albums en haute qualité gratuitement</p>
        </div>
        <div class="max-w-3xl mx-auto mb-12 w-full">
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 w-full max-w-full">
                <div class="flex gap-4 flex-col sm:flex-row w-full max-w-full">
                    <input 
                        type="text" 
                        bind:value={searchTxt}
                        on:keydown={handleKeydown}
                        placeholder="Rechercher un album ou un artiste..." 
                        class="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 w-full max-w-full"
                    >
                    <button 
                        on:click={search}
                        disabled={isLoading}
                        class="px-8 py-4 bg-white text-gray-900 border-2 border-white rounded-xl font-semibold hover:bg-transparent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto mt-4 sm:mt-0"
                    >
                        {isLoading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div class="xl:col-span-1">
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-auto lg:h-[500px] flex flex-col">
                    <h2 class="text-2xl font-bold text-white mb-6">Albums trouvés ({albumsList.length})</h2>
                    <div class="space-y-3 flex-1 lg:overflow-y-auto pr-2">
                        {#if isLoading}
                            {#each Array.from({length: 6}) as _, i}
                                <div class="w-full p-4 bg-white/5 rounded-xl border border-white/5 animate-pulse">
                                    <div class="h-4 bg-white/10 rounded mb-2"></div>
                                    <div class="h-3 bg-white/10 rounded w-2/3"></div>
                                </div>
                            {/each}
                        {:else if albumsList.length === 0}
                            <div class="text-center py-8">
                                <p class="text-gray-400">
                                    {#if !hasSearched}
                                        Aucun album trouvé
                                    {:else}
                                        Aucun résultat pour cette recherche
                                    {/if}
                                </p>
                            </div>
                        {:else}
                            {#each albumsList as album, index}
                                <button 
                                    on:click={() => updateData(index)}
                                    class="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 border border-white/5 hover:border-white/20"
                                >
                                    <div class="font-medium">{album.title}</div>
                                    <div class="text-sm text-gray-400">{album.artist}</div>
                                </button>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <div class="xl:col-span-2">
                <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-auto lg:h-[500px] overflow-hidden">
                    {#if isLoading}
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full lg:h-full items-start">
                            <div class="space-y-6">
                                <div>
                                    <div class="h-3 bg-white/10 rounded w-16 mb-2 animate-pulse"></div>
                                    <div class="h-8 bg-white/10 rounded w-3/4 animate-pulse"></div>
                                </div>
                                <div>
                                    <div class="h-3 bg-white/10 rounded w-20 mb-2 animate-pulse"></div>
                                    <div class="h-6 bg-white/10 rounded w-1/2 animate-pulse"></div>
                                </div>
                                <div class="grid grid-cols-2 gap-6">
                                    <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div class="h-3 bg-white/10 rounded w-16 mb-3 animate-pulse"></div>
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
                                            <div class="h-5 bg-white/10 rounded w-20 animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <div class="h-3 bg-white/10 rounded w-16 mb-3 animate-pulse"></div>
                                        <div class="h-8 bg-white/10 rounded w-12 animate-pulse"></div>
                                    </div>
                                </div>
                                <div class="flex gap-4">
                                    <div class="flex-1 h-12 bg-white/10 rounded-xl animate-pulse"></div>
                                    <div class="w-24 h-12 bg-white/10 rounded-xl animate-pulse"></div>
                                </div>
                            </div>
                            <div class="flex justify-center items-start">
                                <div class="w-full max-w-80 aspect-square bg-white/10 rounded-2xl animate-pulse"></div>
                            </div>
                        </div>
                    {:else if selectedAlbum && hasSearched}
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full lg:h-full items-start">
                            <div class="space-y-6">
                                <div>
                                    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Album</h3>
                                    <p class="text-3xl font-bold text-white">{selectedAlbum.title}</p>
                                </div>

                                <div>
                                    <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Artiste</h3>
                                    <p class="text-2xl text-white">{selectedAlbum.artist}</p>
                                </div>

                                <div class="grid grid-cols-2 gap-6">
                                    <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Artiste</h3>
                                        <div class="flex items-center gap-3">
                                            <img 
                                                src={selectedAlbum.artist_picture} 
                                                alt={`Photo de ${selectedAlbum.artist}`}
                                                class="w-8 h-8 rounded-full object-cover"
                                            >
                                            <p class="text-lg font-semibold text-white">{selectedAlbum.artist}</p>
                                        </div>
                                    </div>
                                    <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                                        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Titres</h3>
                                        <p class="text-2xl font-bold text-white">{selectedAlbum.tracks}</p>
                                    </div>
                                </div>

                                <div class="flex gap-4">
                                    <button 
                                        on:click={download}
                                        class="flex-1 px-4 py-3 bg-white text-gray-900 border-2 border-white rounded-xl font-semibold hover:bg-transparent hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 text-sm"
                                    >
                                        Télécharger
                                    </button>
                                    
                                    <a 
                                        href={selectedAlbum.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        class="px-4 py-3 bg-blue-600 text-white border-2 border-blue-600 rounded-xl font-semibold hover:bg-transparent hover:text-blue-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 text-sm"
                                    >
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                                        </svg>
                                        Deezer
                                    </a>
                                </div>
                            </div>

                            <div class="flex justify-center items-start">
                                <div class="relative group w-full max-w-80">
                                    <img 
                                        src={selectedAlbum.cover_xl} 
                                        alt={`Pochette de ${selectedAlbum.title}`}
                                        class="w-full h-auto max-h-80 aspect-square object-cover rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                    >
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="text-center py-12 h-full flex items-center justify-center">
                            <div>
                                <div class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
                                    </svg>
                                </div>
                                <p class="text-gray-400 text-lg">
                                    {#if !hasSearched}
                                        Effectuez une recherche pour voir les résultats
                                    {:else}
                                        Lancer une recherche
                                    {/if}
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
        {:else}
        <div style="height: 100vh; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
                <div style="width: 60px; height: 60px; border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <p style="color: rgba(255,255,255,0.7); font-size: 1rem; margin: 0;">Chargement...</p>
            </div>
        </div>

        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        {/if}
    </div>
</div>

