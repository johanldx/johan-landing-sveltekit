<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { page } from '$app/stores';

const x = writable(0);
const y = writable(0);
const hovered = writable(false);
const onButton = writable(false);
const clicked = writable(false);
const middleClick = writable(false);

let cursorEl: HTMLDivElement;
let middleStartY = 0;
let lastScrollY = 0;
let anchorY = 0;
let anchorX = 0;
let mouseY = 0;
let mouseX = 0;
let scrollRAF: number | null = null;
let isMobile = false;

function handleMouseMove(e: MouseEvent) {
  if (typeof document === 'undefined') return;
  x.set(e.clientX);
  y.set(e.clientY);
  mouseY = e.clientY;
  mouseX = e.clientX;
  const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
  if ($page.url.pathname.includes('/projects/')) {
    if (el && (el.closest('button, [role="button"]') || el.closest('a'))) {
      onButton.set(false);
      hovered.set(true);
    } else {
      onButton.set(false);
      hovered.set(false);
    }
    return;
  }
  if (el && el.closest('a')) {
    const a = el.closest('a');
    if (a && (a.querySelector('img') || a.querySelector('svg'))) {
      onButton.set(false);
      hovered.set(true);
    } else {
      onButton.set(true);
      hovered.set(false);
    }
  } else if (el && el.closest('button, [role="button"]')) {
    onButton.set(true);
    hovered.set(false);
  } else {
    onButton.set(false);
    hovered.set(false);
  }
}

function handleMouseEnter(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest('button, a, [role="button"]')) {
    onButton.set(true);
  }
}

function handleMouseLeave(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest('button, a, [role="button"]')) {
    onButton.set(false);
  }
}

function handleMouseOver(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest('a:not([role="button"]), [data-cursor-hover]')) {
    hovered.set(true);
  }
}

function handleMouseOut(e: MouseEvent) {
  const target = e.target as HTMLElement;
  if (target.closest('a:not([role="button"]), [data-cursor-hover]')) {
    hovered.set(false);
  }
}

function handleMouseDown(e?: MouseEvent) {
  if (isMobile) return;
  if (e && (e.button === 0 || e.button === 2) && $middleClick) {
    middleClick.set(false);
    return;
  }
  if (e && e.button === 0) {
    clicked.set(true);
  }
  if (e && e.button === 1) {
    e.preventDefault();
    if (!$middleClick) {
      anchorY = e.clientY;
      anchorX = e.clientX;
      mouseY = e.clientY;
      mouseX = e.clientX;
      lastScrollY = window.scrollY;
      lastScrollX = window.scrollX;
      middleClick.set(true);
      startCustomScroll();
    } else {
      middleClick.set(false);
      stopCustomScroll();
    }
  }
}
function handleMouseUp(e?: MouseEvent) {
  if (isMobile) return;
  if (!e || e.button === 0) {
    clicked.set(false);
  }
}

let lastScrollX = 0;
function startCustomScroll() {
  function step() {
    if ($middleClick) {
      const speedY = (mouseY - anchorY) * 0.2;
      const speedX = (mouseX - anchorX) * 0.2;
      window.scrollTo({
        top: window.scrollY + speedY,
        left: window.scrollX + speedX,
        behavior: 'auto'
      });
      scrollRAF = requestAnimationFrame(step);
    }
  }
  scrollRAF = requestAnimationFrame(step);
}
function stopCustomScroll() {
  if (scrollRAF) {
    cancelAnimationFrame(scrollRAF);
    scrollRAF = null;
  }
}

onMount(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  isMobile = window.innerWidth <= 768;
  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
  });
  if (isMobile) return;
  document.body.style.cursor = 'none';
  const style = document.createElement('style');
  style.id = 'custom-cursor-hide';
  style.innerHTML = `
    * { cursor: none !important; }
  `;
  document.head.appendChild(style);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseover', handleMouseOver);
  window.addEventListener('mouseout', handleMouseOut);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mousedown', (e) => { if (e.button === 1) e.preventDefault(); });
});

onDestroy(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (!isMobile) {
    document.body.style.cursor = '';
    const style = document.getElementById('custom-cursor-hide');
    if (style) style.remove();
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseover', handleMouseOver);
    window.removeEventListener('mouseout', handleMouseOut);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
    stopCustomScroll();
  }
});

$: if ($page) {
  hovered.set(false);
  clicked.set(false);
}
</script>

<style>
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 2px solid #bbb;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(1);
  transition: background 0.2s, border 0.2s, transform 0.15s cubic-bezier(.22,1,.36,1), opacity 0.15s;
  z-index: 2147483647;
  opacity: 1;
}
.cursor.hovered,
.cursor.clicked {
  background: rgba(255,255,255,0.1);
  border-color: #fff;
  transform: translate(-50%, -50%) scale(1.5);
  transition: background 0.25s cubic-bezier(.22,1,.36,1), border 0.2s, transform 0.18s cubic-bezier(.22,1,.36,1), opacity 0.15s;
}
.cursor.onButton {
  opacity: 0;
  pointer-events: none;
}
.cursor.middleClick {
  background: rgba(255,255,255,0.1);
  border-color: #fff;
  transform: translate(-50%, -50%) scale(1.7);
  transition: background 0.25s cubic-bezier(.22,1,.36,1), border 0.2s, transform 0.18s cubic-bezier(.22,1,.36,1), opacity 0.15s;
}
.gear {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: spin 1s linear infinite;
  z-index: 2147483647;
}
@keyframes spin {
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>

<svelte:window />

{#if typeof window !== 'undefined' && !isMobile}
  <div
    bind:this={cursorEl}
    class="cursor"
    class:hovered={$hovered}
    class:clicked={$clicked}
    class:onButton={$onButton}
    class:middleClick={$middleClick}
    style="left: {$x}px; top: {$y}px;"
  >
    {#if $middleClick}
      <svg class="gear" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.01c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.01 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.01 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.01c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.01-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.01-2.572c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.01z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    {/if}
  </div>
{/if} 