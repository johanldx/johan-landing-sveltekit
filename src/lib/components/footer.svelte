<script lang="ts">
    const links = [
        { text: "CGU", href: "/legal/gcu" },
        { text: "Mentions légales", href: "/legal" }
    ];
</script>

<footer class="mt-2">
    <div class="container mx-auto px-4 py-6">
        <hr class="border-gray-800 my-10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <!-- Logo et moto à gauche -->
            <div class="flex items-center gap-3">
                <a href="https://theed.fr?utm_source=johan.theed.fr&utm_medium=referral" target="_blank" rel="noopener noreferrer">
                    <img src="/logo.png" alt="Logo Johan Ledoux" class="h-8 w-auto">
                </a>
            </div>
            
            <!-- Liens à droite -->
            <div class="flex flex-wrap gap-6">
                {#each links as link}
                    <a 
                        href={link.href} 
                        class="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        {link.text}
                    </a>
                {/each}
            </div>
        </div>
    </div>
</footer> 