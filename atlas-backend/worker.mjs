import { onRequest } from './avaliacoes.mjs';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const prefix = '/api/avaliacoes/';
    if (url.pathname.startsWith(prefix)) {
      const path = url.pathname.slice(prefix.length).split('/').filter(Boolean);
      return onRequest({request, env, params: {path}});
    }
    if (url.pathname === '/api/avaliacoes') {
      return Response.json({error:'Rota de avaliações incompleta.'}, {status:404,headers:{'Cache-Control':'no-store'}});
    }
    return env.ASSETS.fetch(request);
  }
};
