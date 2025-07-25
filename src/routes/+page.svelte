<script lang="ts">
    import parcoursData from "$lib/data/parcours.json";
    import projectsData from "$lib/data/projects.json";
    import { getPositionedExperiences } from "$lib/data/timeline-utils";
    import { animate } from 'motion';
    import { onMount } from 'svelte';
    import avisData from "$lib/data/avis.json";
    import { avisExpanded } from '$lib/stores/avisExpanded';
    import technosData from "$lib/data/technos.json";

    const timelineData = getPositionedExperiences(parcoursData.experiences);

    let sectionHero: HTMLDivElement;
    let sectionParcours: HTMLDivElement;
    let sectionProjets: HTMLDivElement;
    let sectionContact: HTMLDivElement;
    let sectionAvis: HTMLElement;
    let sectionTechnos: HTMLElement;
    let avisRefs: (HTMLElement | null)[] = [];
    let technoRefs: (HTMLElement | null)[] = [];
    let avisExpandedIndex: number | null = null;

    const technos = [
      { icon: "/icons/svelte-svgrepo-com.svg", label: "Svelte" },
      { icon: "/icons/typescript-svgrepo-com.svg", label: "TypeScript" },
      { icon: "/icons/nodejs-svgrepo-com.svg", label: "Node.js" },
      { icon: "/icons/tailwind-svgrepo-com.svg", label: "TailwindCSS" },
    ];

    onMount(() => {
      const initial: Record<string, boolean> = {};
      for (const avis of avisData) {
        const key = avis.nom + '|' + avis.fonction;
        initial[key] = false;
      }
      avisExpanded.set(initial);
      animate(sectionHero, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 0, duration: 0.9, ease: 'easeOut' });
      animate(sectionParcours, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 0.6, duration: 0.9, ease: 'easeOut' });
      animate(sectionProjets, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 0.8, duration: 0.9, ease: 'easeOut' });
      animate(sectionContact, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 1, duration: 0.9, ease: 'easeOut' });
      animate(sectionAvis, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 1.2, duration: 0.9, ease: 'easeOut' });
      animate(sectionTechnos, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 1.7, duration: 0.9, ease: 'easeOut' });

      avisRefs.forEach((el, i) => {
        if (el) {
          animate(el as HTMLDivElement, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 1.2 + i * 0.15, duration: 0.7, ease: 'easeOut' });
        }
      });
      technoRefs.forEach((el, i) => {
        if (el) {
          animate(el as HTMLDivElement, { opacity: [0, 1], transform: ['translateY(40px)', 'translateY(0px)'] } as any, { delay: 1.7 + i * 0.1, duration: 0.6, ease: 'easeOut' });
        }
      });
    });

    let name = '';
    let email = '';
    let message = '';
    let errors = { name: '', email: '', message: '' };
    let formEl: HTMLFormElement;

    function validateEmail(email: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateForm() {
        errors = { name: '', email: '', message: '' };
        let valid = true;
        if (!name.trim()) {
            errors.name = 'Le nom est requis.';
            valid = false;
        }
        if (!email.trim()) {
            errors.email = 'L\'email est requis.';
            valid = false;
        } else if (!validateEmail(email)) {
            errors.email = 'L\'email n\'est pas valide.';
            valid = false;
        }
        if (!message.trim()) {
            errors.message = 'Le message est requis.';
            valid = false;
        }
        return valid;
    }

    function handleSubmit(e: Event) {
        if (!validateForm()) {
            e.preventDefault();
            // Focus sur le premier champ en erreur
            if (errors.name) (formEl.querySelector('#name') as HTMLInputElement)?.focus();
            else if (errors.email) (formEl.querySelector('#email') as HTMLInputElement)?.focus();
            else if (errors.message) (formEl.querySelector('#message') as HTMLTextAreaElement)?.focus();
        }
    }
</script>

<svelte:head>
  <title>Johan Ledoux | Theed</title>
  <meta name="description" content="Développeur Full-Stack et entrepreneur, orienté produit." />
</svelte:head>

<div class="container mx-auto text-center mt-20 px-4" bind:this={sectionHero} style="opacity:0;transform:translateY(40px);">
    <h1 class="text-4xl max-w-2xl mx-auto font-extrabold">Développeur Full-Stack et entrepreneur, orienté produit.</h1>
    <h2 class="mt-5 text-2xl max-w-2xl mx-auto font-bold text-[#BCBCBC]">Johan Ledoux</h2>
    <div class="flex flex-col items-center gap-4 mt-6">
        <button
            class="px-6 py-3 bg-white text-gray-900 border-2 border-white rounded-lg font-semibold hover:bg-transparent hover:text-white hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            on:click={() => {
                const contactSection = document.querySelector('form');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }}
        >
            Me contacter
        </button>
        <div class="flex space-x-4 mt-2">
            <a href="https://github.com/johanldx" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-200 transition-colors" aria-label="Profil GitHub">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
            <a href="https://www.linkedin.com/in/johanldx/" target="_blank" rel="noopener noreferrer" class="text-white hover:text-gray-200 transition-colors" aria-label="Profil LinkedIn">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            </a>
        </div>
    </div>
</div>

<div class="container mx-auto mt-16 px-4" bind:this={sectionParcours} style="opacity:0;transform:translateY(40px);">
    <h3 class="text-2xl font-bold text-white text-center mb-10">Parcours</h3>
    <div class="max-w-6xl mx-auto">
        <div class="duration-timeline relative flex py-8 md:flex-row flex-col">
            <div class="years-axis relative w-20 mr-8 flex-shrink-0 hidden md:block">
                {#each Array.from({length: timelineData.yearRange.maxYear - timelineData.yearRange.minYear + 1}, (_, i) => timelineData.yearRange.maxYear - i) as year}
                    <div class="year-line relative h-[100px] flex items-center border-b border-gray-700 last:border-b-0">
                        <span class="year-label text-gray-400 text-sm font-medium absolute left-0 top-1/2 -translate-y-1/2">{year}</span>
                    </div>
                {/each}
            </div>
            <!-- Desktop timeline -->
            <div class="experiences-zone relative flex-1 bg-[#1f29371a] rounded-lg p-2 overflow-hidden min-w-[320px] md:min-w-[400px] md:min-w-0 hidden md:block" style="height: {(timelineData.yearRange.maxYear - timelineData.yearRange.minYear + 1) * 100}px;">
                {#each timelineData.positioned as positionedExp}
                    <div 
                        class="experience-card absolute rounded-lg p-4 text-white transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-md hover:scale-102 hover:shadow-2xl hover:z-10"
                        style="
                            top: {positionedExp.top}px;
                            height: {positionedExp.height}px;
                            left: {positionedExp.left}%;
                            width: {positionedExp.width}%;
                            background: {positionedExp.experience.color};
                            --card-color: {positionedExp.experience.color};
                        "
                    >
                        <div class="card-content h-full flex flex-col justify-center p-4">
                            <h4 class="card-title text-sm font-semibold mb-2 leading-tight">{positionedExp.experience.title}</h4>
                            <p class="card-subtitle text-xs mb-2 opacity-90 leading-tight">{positionedExp.experience.subtitle}</p>
                            <p class="card-period text-xs mb-2 opacity-80 font-medium">{positionedExp.experience.startYear} - {positionedExp.experience.endYear}</p>
                            {#if positionedExp.experience.tags}
                                <div class="card-tags flex flex-wrap gap-1 mb-2">
                                    {#each positionedExp.experience.tags as tag}
                                        <span class="tag bg-white text-transparent bg-clip-text px-2 py-0.5 rounded text-[0.6rem] font-medium border border-white whitespace-nowrap">{tag}</span>
                                    {/each}
                                </div>
                            {/if}
                            {#if positionedExp.experience.ongoing}
                                <span class="ongoing-badge bg-white/20 text-white px-2 py-0.5 rounded text-xs font-semibold inline-block self-start">En cours</span>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
            <!-- Mobile version : expériences en colonne -->
            <div class="flex flex-col gap-4 w-full md:hidden">
              {#each parcoursData.experiences as exp}
                <div class="rounded-lg p-4 text-white shadow-lg backdrop-blur-md" style="background: {exp.color};">
                  <h4 class="text-base font-semibold mb-1">{exp.title}</h4>
                  <p class="text-xs mb-1 opacity-90">{exp.subtitle}</p>
                  <p class="text-xs mb-2 opacity-80 font-medium">{exp.startYear} - {exp.endYear}</p>
                  {#if exp.tags}
                    <div class="flex flex-wrap gap-1 mb-2">
                      {#each exp.tags as tag}
                        <span class="tag bg-white text-transparent bg-clip-text px-2 py-0.5 rounded text-[0.6rem] font-medium border border-white whitespace-nowrap">{tag}</span>
                      {/each}
                    </div>
                  {/if}
                  {#if exp.ongoing}
                    <span class="bg-white/20 text-white px-2 py-0.5 rounded text-xs font-semibold inline-block self-start">En cours</span>
                  {/if}
                </div>
              {/each}
            </div>
        </div>
    </div>
</div>

<div class="container mx-auto mt-10 px-4" bind:this={sectionProjets} style="opacity:0;transform:translateY(40px);">
    <h3 class="text-2xl font-bold text-white text-center mb-10">Projets</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {#if projectsData?.projects}
            {#each projectsData.projects as post}
                <div class="post-it {post.color} col-span-1 row-span-1 md:{post.size} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col min-h-[200px] hover:z-10 hover:scale-102">
                    <div class="flex-grow">
                        <h3 class="text-xl font-bold text-white mb-2">{post.title}</h3>
                        <p class="text-sm text-white/80 mb-3">{post.date}</p>
                        <p class="text-white/90 leading-relaxed">{post.description}</p>
                    </div>
                    {#if post.buttons}
                        <div class="mt-4 flex flex-wrap gap-2">
                            {#each post.buttons as button}
                                {#if button.href && button.href.startsWith('http')}
                                    <a href={button.href} rel="noopener noreferrer" target="_blank" class="px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 {button.style === 'primary' ? 'bg-white text-gray-700 border-2 border-white hover:bg-transparent hover:text-white' : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-700'}">
                                        {button.text}
                                    </a>
                                {:else}
                                    <a href={button.href} class="px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 {button.style === 'primary' ? 'bg-white text-gray-700 border-2 border-white hover:bg-transparent hover:text-white' : 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-gray-700'}">
                                        {button.text}
                                    </a>
                                {/if}
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        {/if}
    </div>
</div>

<!-- SECTION AVIS -->
<section class="container mx-auto mt-16 px-4" bind:this={sectionAvis} style="opacity:0;transform:translateY(40px);">
  <h3 class="text-2xl font-bold text-white text-center mb-10">Ils m'ont fait confiance</h3>
  <div class="flex flex-col md:flex-row gap-6 justify-center">
    {#each avisData as avis, i}
      <div class="bg-[#1b1b1b] border border-white/10 rounded-xl p-6 max-w-sm mx-auto relative" bind:this={avisRefs[i]}>
        <div class="avis-wrapper" class:open={avisExpandedIndex === i}>
          <p class="text-white mb-4 leading-relaxed text-base max-w-xl whitespace-pre-line">
            “{avis.texte}”
          </p>
          {#if avisExpandedIndex !== i && avis.texte.length > 300}
            <div class="pointer-events-none absolute left-0 right-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#18181b]"></div>
          {/if}
        </div>
        {#if avis.texte.length > 300}
          <button
            class="text-xs text-gray-400 hover:text-white underline focus:outline-none mt-1"
            on:click={() => avisExpandedIndex = avisExpandedIndex === i ? null : i}
            type="button"
          >
            {avisExpandedIndex === i ? 'Voir moins' : 'Voir plus'}
          </button>
        {/if}
        <div class="flex items-center gap-3 mt-4">
          <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(avis.nom || '')}&backgroundType=gradientLinear&fontWeight=700`} alt={"Avatar de " + avis.nom} class="w-10 h-10 rounded-full bg-white/20" />
          <div>
            <div class="text-white font-semibold text-sm">{avis.nom}</div>
            <div class="text-gray-400 text-xs">{avis.fonction}</div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>

<!-- SECTION TECHNOS -->
<section class="container mx-auto mt-16 px-4" bind:this={sectionTechnos} style="opacity:0;transform:translateY(40px);">
  <h3 class="text-2xl font-bold text-white text-center mb-10">Technos</h3>
  <div class="flex flex-wrap justify-center gap-4">
    {#each technosData as techno}
      <span class="text-sm font-semibold px-4 py-2 rounded-full shadow border border-white/10 hover:scale-105 transition-all cursor-default select-none"
        style="background:{techno.bgColor};color:{techno.textColor}"
      >
        {techno.label}
      </span>
    {/each}
  </div>
</section>

<div class="container mx-auto mt-16 px-4" bind:this={sectionContact} style="opacity:0;transform:translateY(40px);">
    <h3 class="text-2xl font-bold text-white text-center mb-10">Contact</h3>
    <div class="max-w-xl mx-auto">
        <form
            class="space-y-6 bg-[#1b1b1b] border border-white/10 rounded-xl shadow-lg p-8"
            action="https://formsubmit.co/9a707e0c3cc5e99240d025fd60b2bc0a"
            method="POST"
            bind:this={formEl}
            novalidate
            on:submit={handleSubmit}
        >
            <input type="hidden" name="_captcha" value="false">
            <input type="hidden" name="_next" value="https://johan.theed.fr/form/confirmation">
            <input type="hidden" name="_subject" value="Nouveau message de contact">
            <input type="text" name="_honey" style="display:none">
            <div>
                <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
                    placeholder="Votre nom"
                    bind:value={name}
                >
                {#if errors.name}
                    <p class="text-red-400 text-xs mt-1">{errors.name}</p>
                {/if}
            </div>
            <div>
                <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors"
                    placeholder="votre@email.com"
                    bind:value={email}
                >
                {#if errors.email}
                    <p class="text-red-400 text-xs mt-1">{errors.email}</p>
                {/if}
            </div>
            <div>
                <label for="message" class="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea 
                    id="message" 
                    name="message" 
                    rows="4" 
                    class="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-colors resize-vertical"
                    placeholder="Votre message..."
                    bind:value={message}
                ></textarea>
                {#if errors.message}
                    <p class="text-red-400 text-xs mt-1">{errors.message}</p>
                {/if}
            </div>
            <button 
                type="submit" 
                class="w-full px-6 py-3 bg-white text-gray-900 border-2 border-white rounded-lg font-semibold hover:bg-transparent hover:text-white hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
            >
                Envoyer le message
            </button>
        </form>
    </div>
</div>

<style>
  .avis-wrapper {
    max-height: 8.5em;
    overflow: hidden;
    transition: max-height 0.4s cubic-bezier(.4,0,.2,1);
    position: relative;
  }
  .avis-wrapper.open {
    max-height: 1000px;
  }
  @media (max-width: 640px) {
  .duration-timeline {
    flex-direction: row;
    overflow-x: auto;
    min-width: 320px;
    max-width: 100vw;
  }
  .experiences-zone {
    min-width: 400px;
    max-width: 90vw;
  }
  .years-axis {
    position: sticky;
    left: 0;
    background: #18181b;
    z-index: 2;
  }
}
</style>