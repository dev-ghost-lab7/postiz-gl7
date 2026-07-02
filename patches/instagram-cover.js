// GL7 patch: Instagram Reel cover_url (upstream issue #1572).
// Repassa m.thumbnail (capa escolhida pelo usuario) como cover_url na criacao
// do container do Reel single-video. Mantem thumb_offset como fallback (Meta da
// precedencia ao cover_url quando os dois vem juntos).
// Idempotente + tolerante a versao (string-match, nao line-number). Roda no build
// da imagem (Dockerfile) E serve como runtime patch (node - via stdin) se preciso.
const fs = require('fs');

const FILES = [
  '/app/apps/backend/dist/libraries/nestjs-libraries/src/integrations/social/instagram.provider.js',
  '/app/apps/orchestrator/dist/libraries/nestjs-libraries/src/integrations/social/instagram.provider.js',
];

// OLD = fim do template REELS (inclui backtick de fechamento). 'media_type=REELS'
// desambigua do branch VIDEO (carousel), que termina identico.
const OLD = "media_type=REELS&thumb_offset=${m?.thumbnailTimestamp || 0}`";
const NEW = "media_type=REELS&thumb_offset=${m?.thumbnailTimestamp || 0}${m?.thumbnail ? `&cover_url=${encodeURIComponent(m.thumbnail)}` : ''}`";

let patched = 0;
for (const f of FILES) {
  let src;
  try { src = fs.readFileSync(f, 'utf8'); }
  catch (e) { console.log('SKIP (nao existe): ' + f); continue; }

  if (src.includes('cover_url=${encodeURIComponent(m.thumbnail)}')) {
    console.log('JA-PATCHED: ' + f);
    patched++;
    continue;
  }
  const count = src.split(OLD).length - 1;
  if (count !== 1) {
    console.log('ABORT (' + count + ' matches, esperado 1): ' + f);
    continue;
  }
  fs.writeFileSync(f, src.replace(OLD, NEW));
  console.log('PATCHED: ' + f);
  patched++;
}

if (patched < FILES.length) {
  console.error('FALHA: patch nao aplicado em todos os arquivos (' + patched + '/' + FILES.length + ')');
  process.exit(1);
}
console.log('OK: ' + patched + '/' + FILES.length + ' arquivos com cover_url.');
