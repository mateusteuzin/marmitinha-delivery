# Painel da cozinha

Acesse /admin. A senha e a chave da sessão ficam somente nas variáveis protegidas do servidor.

## Vercel

Variáveis: ADMIN_PASSWORD, ADMIN_SESSION_SECRET (valor aleatório com pelo menos 32 caracteres), APP_ORIGIN (origem HTTPS exata do site), BLOB_READ_WRITE_TOKEN (armazenamento Vercel Blob privado conectado ao projeto).

Não exponha essas variáveis com prefixo NEXT_PUBLIC_. Não publique .env.local ou .local-data.

O painel salva os registros em um arquivo privado com controle de concorrência por ETag. Leituras administrativas ignoram o cache. Em desenvolvimento, sem credenciais de armazenamento, os dados ficam em .local-data/store.json. Na Vercel, a ausência do armazenamento gera erro explícito.

## Rotina

Pedidos enviados pelo botão do WhatsApp entram como A conferir; isso não comprova envio da mensagem ou venda. Compare os códigos com as conversas, ajuste o frete e conclua somente as vendas efetivas. O resumo usa a data de criação do pedido no fuso de Fortaleza e inclui apenas os concluídos. Fretes fazem parte do total vendido. Cancelados não entram nos totais.

Preços e disponibilidade valem para os próximos pedidos. Valores de pedidos anteriores são preservados. Na edição de pedido, preço unitário inclui os adicionais escolhidos. Retirada sempre tem frete zero. Para evitar perda de atualizações, um pedido editado em outro aparelho deve ser recarregado antes de salvar.

Hoje mostra o dia selecionado; Semana inclui esse dia e os seis anteriores; Mês inclui do primeiro dia até a data selecionada.

