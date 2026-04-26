// Node.js v25 throws an uncaught exception when a GET/HEAD request arrives
// with a body (invalid HTTP, but common from bot scanners). SvelteKit's
// adapter doesn't catch it, so we intercept it here before it crashes the process.
process.on('uncaughtException', (err) => {
    if (err?.message?.includes('GET/HEAD method cannot have body')) return;
    console.error('Uncaught exception:', err);
    process.exit(1);
});

import('./build/index.js');
