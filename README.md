# postiz-gl7

Imagem derivada fina do [Postiz](https://github.com/gitroomhq/postiz-app) (AGPL-3.0) com os patches da Ghost Lab7 aplicados no build. Usada no self-host GL7 (`social.ghostlab77.com.br`) via EasyPanel na VPS Master7 Ops.

## Por que existe

O Postiz **bloqueia contribuicao externa** (aplicacao gated + CLA em contribute.postiz.com), entao PRs de fix (ex: cover_url de Reel, issue [#1572](https://github.com/gitroomhq/postiz-app/issues/1572)) sao auto-fechadas. A gente precisa carregar os patches no proprio deploy.

Em vez de forkar o monorepo inteiro (build pesado), esta imagem parte da **imagem oficial ja construida** e aplica os patches nos JS compilados no build. Vantagens:

- Sobrevive a redeploy (diferente do runtime patch via `docker exec`).
- Trivial de manter: os patches sao **string-match tolerante a versao**, nao dependem de numero de linha.
- Consolida todos os patches GL7 num lugar (hoje: cover_url Reel; futuro: LinkedIn scopes, etc).

## Patches

| Arquivo | O que faz | Upstream |
|---|---|---|
| `patches/instagram-cover.js` | Repassa `m.thumbnail` (capa escolhida) como `cover_url` ao criar o container do Reel single-video no Instagram. Mantem `thumb_offset` como fallback. | issue #1572 (PRs #1573/#1600 fechadas por gating) |

## Como usar (EasyPanel)

1. Rodar o workflow `build-postiz-gl7` (Actions -> Run workflow) -> publica `ghcr.io/dev-ghost-lab7/postiz-gl7:latest`.
2. No servico `postiz` do projeto `gl7-apps`, trocar a imagem de `ghcr.io/gitroomhq/postiz-app:latest` para `ghcr.io/dev-ghost-lab7/postiz-gl7:latest`.
3. Deploy + `pm2 restart backend orchestrator` (drift #5 da skill postiz7-gl7).

Todas as env vars, Temporal, storage R2 etc continuam identicos (a skill `postiz7-gl7` e a fonte).

## Atualizar quando o Postiz lancar versao nova

Rebuildar (Run workflow). Se um patch der `ABORT` no build, o Postiz mudou o trecho patchado -> revisar o `patches/*.js`.

## AGPL-3.0

Este repo distribui uma obra modificada do Postiz (AGPL-3.0). O "source" da modificacao sao o `Dockerfile` + `patches/` deste repo, sobre a base publica `gitroomhq/postiz-app`.
