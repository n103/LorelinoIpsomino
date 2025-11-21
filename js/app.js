(() => {
  'use strict';

  // Simple seeded RNG (Mulberry32)
  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  const WORDS = {
    interj: [
      'raga', 'fra', 'bro', 'amo', 'zi', 'oh', 'oddio', 'no vabbè', 'giuro', 'boh',
      'cioè', 'pls', 'help', 'ok', 'ma dai', 'allora', 'no perché', 'pov:'
    ],
    nouns: [
      'crush', 'ex', 'bestie', 'vibe', 'trend', 'drip', 'fit', 'mood', 'brainrot', 'skibidi',
      'sigma', 'gyatt', 'side eye', 'npc', 'riz', 'iphone', 'dupe', 'filtri', 'cap', 'meme',
      'spam', 'feed', 'storia', 'stories', 'dm', 'bio', 'boomer', 'gen z', 'gen alpha', 'per te',
      'playlist', 'aesthetic', 'vlog', 'chat', 'team', 'streak', 'prof', 'verifica', 'compito',
      'algoritmo', 'ick', 'red flag', 'green flag', 'fomo', 'skin', 'cuffie'
    ],
    verbs: [
      'gasa', 'flexa', 'posta', 'spamma', 'droppa', 'crusha', 'ghosta', 'skippa', 'leaka',
      'tagga', 'shifta', 'streama', 'binga', 'clippa', 'vibra', 'tilta', 'chilla',
      'sclera', 'sbrocca', 'cringia', 'triggera', 'shippa', 'screenshotta', 'unfollowa', 'muta',
      'spoila', 'stalkera', 'urlo', 'piango', 'svengo', 'delivera', 'posta', 'reposta'
    ],
    adjectives: [
      'basato', 'basatissimo', 'peak', 'cringe', 'trash', 'iconico', 'random', 'turbo',
      'chad', 'cozy', 'lowkey', 'highkey', 'fire', 'clean', 'yass', 'basic', 'extra',
      'virale', 'drippy', 'sleek', 'soft', 'cute', 'assurdo', 'top', 'max', 'wild'
    ],
    connectors: ['tipo', 'cioè', 'onestamente', 'comunque', 'poi', 'letteralmente', 'no perché', 'giuro', 'boh'],
    hashtags: [
      'fyp', 'perte', 'pertepage', 'tiktokitalia', 'italianbrainrot', 'xyzbca', 'virale', 'cap', 'nocap',
      'brainrot', 'sigma', 'skibidi', 'mood', 'relatable', 'weoutside', 'drip', 'storia', 'algoritmo'
    ],
    emojis: [
      '🔥', '💀', '😭', '✨', '😮‍💨', '🫠', '🫡', '🧠', '📱', '💅', '🫣', '🫨', '😵‍💫', '🫶', '🙏', '😤', '🤌', '🤳', '💫'
    ]
  };

  // Micro-templates for stronger Italian brainrot vibes
  const TEMPLATES = [
    'pov: io che {V} {N}',
    'io che {V} {N}',
    'no vabbè {C} {N} {V}',
    'non ce la faccio {C} {N} {V}',
    'giuro {C} {A} {N}',
    'boh {C} {V} {N}',
    'oddio {A} {N}',
    'raga {C} {N} è {A}'
  ];

  function sample(arr, rng) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function sentence(rng, opts) {
    // 60% chance to use a brainrot template, otherwise fall back to chunked pattern
    if (rng() < 0.6) {
      const tpl = sample(TEMPLATES, rng);
      let s = tpl
        .replace('{V}', sample(WORDS.verbs, rng))
        .replace('{V}', sample(WORDS.verbs, rng)) // in case template has two {V}
        .replace('{N}', sample(WORDS.nouns, rng))
        .replace('{N}', sample(WORDS.nouns, rng))
        .replace('{A}', sample(WORDS.adjectives, rng))
        .replace('{C}', sample(WORDS.connectors, rng));
      s = s.replace(/\s+/g, ' ').trim();
      // Add emojis inline randomly
      if (opts.emojis && rng() < 0.6) s += ' ' + sample(WORDS.emojis, rng);
      // Ensure punctuation: keep colon if template starts with 'pov:' etc.
      if (!s.endsWith(':')) s += endPunct(rng);
      if (opts.hashtags) {
        const count = 1 + Math.floor(rng() * 3);
        const tags = new Set();
        while (tags.size < count) tags.add('#' + sample(WORDS.hashtags, rng));
        s += ' ' + Array.from(tags).join(' ');
      }
      if (opts.caps) s = s.toUpperCase();
      // Capitalize unless already has pov: at start
      if (!opts.caps && !/^pov:/i.test(s)) s = capitalize(s);
      return s;
    }

    // Original chunked construction
    const parts = [];
    const opener = sample(WORDS.interj, rng);
    parts.push(capitalize(opener));
    const chunks = 3 + Math.floor(rng() * 4); // 3..6 chunks
    for (let i = 0; i < chunks; i++) {
      const pattern = Math.floor(rng() * 3);
      if (pattern === 0) {
        parts.push(
          sample(WORDS.connectors, rng) + ' ' +
          sample(WORDS.nouns, rng) + ' ' +
          sample(WORDS.verbs, rng)
        );
      } else if (pattern === 1) {
        parts.push(
          sample(WORDS.connectors, rng) + ' ' +
          sample(WORDS.adjectives, rng) + ' ' +
          sample(WORDS.nouns, rng)
        );
      } else {
        parts.push(
          sample(WORDS.connectors, rng) + ' ' +
          sample(WORDS.verbs, rng) + ' ' +
          sample(WORDS.nouns, rng)
        );
      }

      if (opts.emojis && rng() < 0.5) parts.push(sample(WORDS.emojis, rng));
    }

    let s = parts.join(' ').replace(/\s+/g, ' ').trim();
    s = s + endPunct(rng);
    if (opts.hashtags) {
      const count = 1 + Math.floor(rng() * 3);
      const tags = new Set();
      while (tags.size < count) tags.add('#' + sample(WORDS.hashtags, rng));
      s += ' ' + Array.from(tags).join(' ');
    }
    if (opts.caps) s = s.toUpperCase();
    return s;
  }

  function endPunct(rng) {
    const r = rng();
    if (r < 0.6) return '.';
    if (r < 0.8) return '!';
    return '…';
  }

  function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function generateText(seed, paragraphs, sentencesPer, opts) {
    const rng = mulberry32(typeof seed === 'number' ? seed : hashString(String(seed)));
    const paras = [];
    for (let p = 0; p < paragraphs; p++) {
      const lines = [];
      for (let s = 0; s < sentencesPer; s++) {
        lines.push(sentence(rng, opts));
      }
      paras.push(lines.join(' '));
    }
    return paras;
  }

  function $(id) {
    return document.getElementById(id);
  }

  function showToast(msg) {
    const el = $('toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    setTimeout(() => (el.hidden = true), 1500);
  }

  function readControls() {
    const paragraphs = clamp(parseInt($('paragraphs').value || '3', 10), 1, 10);
    const sentences = clamp(parseInt($('sentences').value || '4', 10), 2, 8);
    const emojis = $('emojis').checked;
    const hashtags = $('hashtags').checked;
    const caps = $('caps').checked;
    const seedRaw = $('seed').value.trim();
    const seed = seedRaw === '' ? Math.floor(Math.random() * 2 ** 32) : seedRaw;
    return { seed, paragraphs, sentences, emojis, hashtags, caps };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, isNaN(n) ? min : n));
  }

  function applyOutput(paras) {
    const result = $('result');
    result.innerHTML = '';
    for (const p of paras) {
      const el = document.createElement('p');
      el.textContent = p;
      result.appendChild(el);
    }
  }

  function toQuery(params) {
    const url = new URL(location.href);
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, String(v));
    }
    return url.toString();
  }

  function fromQuery() {
    const sp = new URLSearchParams(location.search);
    const getBool = (k, d) => (sp.has(k) ? sp.get(k) === 'true' : d);
    const getNum = (k, d, min, max) => clamp(parseInt(sp.get(k) || String(d), 10), min, max);
    const seed = sp.get('seed') || '';
    return {
      seed,
      paragraphs: getNum('p', 3, 1, 10),
      sentences: getNum('s', 4, 2, 8),
      emojis: getBool('e', true),
      hashtags: getBool('h', false),
      caps: getBool('c', false)
    };
  }

  function syncControls(state) {
    $('paragraphs').value = String(state.paragraphs);
    $('sentences').value = String(state.sentences);
    $('emojis').checked = !!state.emojis;
    $('hashtags').checked = !!state.hashtags;
    $('caps').checked = !!state.caps;
    $('seed').value = state.seed === '' ? '' : String(state.seed);
  }

  function stateToParams(state) {
    return {
      seed: state.seed,
      p: state.paragraphs,
      s: state.sentences,
      e: state.emojis,
      h: state.hashtags,
      c: state.caps
    };
  }

  function init() {
    // Load from URL or defaults
    const initial = fromQuery();
    syncControls(initial);
    const paras = generateText(
      initial.seed === '' ? Math.floor(Math.random() * 2 ** 32) : initial.seed,
      initial.paragraphs,
      initial.sentences,
      { emojis: initial.emojis, hashtags: initial.hashtags, caps: initial.caps }
    );
    applyOutput(paras);

    $('generate').addEventListener('click', () => {
      const st = readControls();
      syncControls(st);
      applyOutput(
        generateText(st.seed, st.paragraphs, st.sentences, {
          emojis: st.emojis,
          hashtags: st.hashtags,
          caps: st.caps
        })
      );
    });

    $('copy').addEventListener('click', async () => {
      const text = Array.from($('result').querySelectorAll('p'))
        .map((p) => p.textContent)
        .join('\n\n');
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copiato!');
      } catch (e) {
        showToast('Impossibile copiare');
      }
    });

    $('permalink').addEventListener('click', async () => {
      const st = readControls();
      const url = toQuery(stateToParams(st));
      try {
        await navigator.clipboard.writeText(url);
        history.replaceState(null, '', url);
        showToast('Permalink copiato');
      } catch {
        showToast('Permalink pronto');
      }
    });

    $('randomize').addEventListener('click', () => {
      $('seed').value = '';
      showToast('Seed casuale');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
