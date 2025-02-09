
## FRONT NEXT.JS
## BACK NODE.JS
## TYPESCRIPT

```
meu-projeto/
├── backend/         # Pasta para o backend (Node.js)
│   ├── src/
│   │   ├── index.ts       # Ponto de entrada do servidor
│   │   ├── routes/
│   │   │   ├── auth.ts   # Rotas de autenticação (login, registro, etc.)
│   │   │   └── ...       # Outras rotas
│   │   ├── models/
│   │   │   └── User.ts   # Modelo do usuário (Mongoose)
│   │   ├── services/
│   │   │   └── auth.ts    # Lógica de autenticação (funções de login, registro, etc.)
│   │   ├── config/      # Configurações (variáveis de ambiente, conexão com o banco de dados, etc.)
│   │   │   ├── db.ts
│   │   │   └── jwt.ts    # Configuração do JWT
│   │   └── middleware/ # (Opcional) Middleware personalizado (autenticação, validação, etc.)
│   │       └── authMiddleware.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env          # Variáveis de ambiente
├── frontend/        # Pasta para o frontend (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   │    └── page.tsx
│   │   │   ├── register/
│   │   │   │    └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx  # Exemplo de página protegida
│   │   │   └── api/
│   │   │         └── auth/
│   │   │             └── [proxy]/route.ts # Proxy para as rotas do backend (IMPORTANTE)
│   │   ├── components/
│   │   │    └── ...
│   │   ├── contexts/
│   │   │    └── AuthContext.tsx
│   │   ├── lib/        # Funções utilitárias
│   │   │    └── apiClient.ts   # Cliente API para fazer requisições ao backend
│   │   └── styles/
│   │        └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
└── README.md
```