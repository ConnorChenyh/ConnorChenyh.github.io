/* One local, lockfile-pinned runtime; only included on pages containing diagrams. */
mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'default' });
mermaid.run({ querySelector: '.mermaid' }).catch(error => {
  console.error('Diagram rendering failed', error);
});
