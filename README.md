# 📅 AgendaFacil

Uma aplicação moderna e intuitiva para gerenciamento de agendamentos e consultas, construída com React, TypeScript, Express.js e PostgreSQL.

## ✨ Funcionalidades

- 🗓️ **Sistema de Agendamentos** - Crie e gerencie consultas facilmente
- 👥 **Gestão de Usuários** - Sistema completo de autenticação e perfis
- 📧 **Notificações por Email** - Confirmações automáticas via SendGrid
- 📱 **Interface Responsiva** - Design moderno com Tailwind CSS
- 🔐 **Autenticação Segura** - JWT e sessões seguras
- 📊 **Dashboard Intuitivo** - Visão geral dos agendamentos
- 🎨 **Tema Escuro/Claro** - Suporte a múltiplos temas
- 📱 **Mobile First** - Otimizado para dispositivos móveis

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **React Hook Form** - Gerenciamento de formulários
- **TanStack Query** - Gerenciamento de estado do servidor

### Backend
- **Express.js** - Framework web para Node.js
- **TypeScript** - Tipagem estática para Node.js
- **Drizzle ORM** - ORM moderno e type-safe
- **PostgreSQL** - Banco de dados relacional
- **Passport.js** - Autenticação e autorização
- **SendGrid** - Serviço de email transacional

### DevOps
- **Vite** - Build tool rápida para desenvolvimento
- **ESBuild** - Bundler ultra-rápido para produção
- **Vercel** - Deploy e hospedagem

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**
- **PostgreSQL** 12+
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/agendafacil.git
cd agendafacil
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/agendafacil

# Configurações do SendGrid
SENDGRID_API_KEY=sua_chave_api_aqui
FROM_EMAIL=noreply@seudominio.com

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
SESSION_SECRET=seu_session_secret_aqui

# Configurações do Servidor
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### 4. Configure o Banco de Dados

#### Opção 1: PostgreSQL Local
```bash
# Crie o banco de dados
createdb agendafacil

# Execute as migrações
npm run db:push:postgres
```

#### Opção 2: SQLite (Desenvolvimento)
```bash
# Execute as migrações para SQLite
npm run db:push
```

### 5. Inicie o Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:5000`

### 6. Acesse a Aplicação

Abra seu navegador e acesse:
- **Frontend**: `http://localhost:3000` (se configurado)
- **API Backend**: `http://localhost:5000`

## 📁 Estrutura do Projeto

```
agendafacil/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Hooks customizados
│   │   └── lib/           # Utilitários e configurações
│   └── index.html
├── server/                 # Backend Express
│   ├── routes/            # Rotas da API
│   ├── auth.ts            # Autenticação
│   ├── db.ts              # Configuração do banco
│   └── index.ts           # Servidor principal
├── shared/                 # Código compartilhado
│   └── schema.ts          # Esquemas do banco
├── drizzle.config.ts       # Configuração do Drizzle
└── package.json
```

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run check            # Verifica tipos TypeScript

# Build
npm run build            # Build completo (cliente + servidor)
npm run build:client     # Build apenas do cliente
npm run build:server     # Build apenas do servidor

# Banco de Dados
npm run db:push          # Executa migrações SQLite
npm run db:push:postgres # Executa migrações PostgreSQL
npm run db:generate      # Gera novas migrações

# Produção
npm run start            # Inicia servidor de produção
```

## 🌐 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

```bash
# Build para produção
npm run build:all

# Iniciar servidor
npm run start
```

## 🔧 Configurações Adicionais

### Banco de Dados

O projeto suporta tanto **PostgreSQL** quanto **SQLite**:

- **PostgreSQL**: Para produção e desenvolvimento avançado
- **SQLite**: Para desenvolvimento rápido e testes

### Email

Configure o SendGrid para envio de emails:
1. Crie uma conta no [SendGrid](https://sendgrid.com)
2. Gere uma API Key
3. Configure no arquivo `.env`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


## 🙏 Agradecimentos

- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Drizzle ORM](https://orm.drizzle.team/) pelo ORM moderno
- [Vercel](https://vercel.com/) pela hospedagem e deploy

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
