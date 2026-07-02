# GL7 · imagem derivada fina do Postiz.
# Estrategia: NAO forka o monorepo (build pesado). Parte da imagem oficial ja
# construida e aplica patches nos JS compilados no build -> sobrevive a redeploy.
#
# Para atualizar quando o upstream lancar versao nova: rebuildar (o patch e
# tolerante a versao, string-match). Se um patch der ABORT no build, o Postiz
# mudou o codigo -> revisar patches/.
FROM ghcr.io/gitroomhq/postiz-app:latest

COPY patches/ /gl7-patches/

# Aplica todos os patches GL7. Falha o build se algum patch nao casar (fail-fast).
RUN for p in /gl7-patches/*.js; do echo "== $p =="; node "$p"; done

# Metadados
LABEL org.opencontainers.image.source="https://github.com/dev-ghost-lab7/postiz-gl7"
LABEL gl7.base="ghcr.io/gitroomhq/postiz-app:latest"
LABEL gl7.patches="instagram-cover(cover_url Reel #1572)"
