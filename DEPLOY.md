# 🚀 Guia de Deploy - AgendaFácil

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Git](https://git-scm.com/)
- Conta no [Vercel](https://vercel.com/)
- Conta no [Railway](https://railway.app/) ou [Supabase](https://supabase.com/)
- Conta no [SendGrid](https://sendgrid.com/)

## 🔧 Configuração Local

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `env.example` para `.env` e configure:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/agendafacil
SENDGRID_API_KEY=sua_chave_api_aqui
FROM_EMAIL=noreply@seudominio.com
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
SESSION_SECRET=seu_session_secret_aqui
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

## 📧 Configurando SendGrid

### 1. Criar Conta no SendGrid
- Acesse [sendgrid.com](https://sendgrid.com/)
- Crie uma conta gratuita
- Verifique seu domínio de email

### 2. Obter API Key
- Vá em Settings > API Keys
- Crie uma nova API Key
- Copie a chave para `SENDGRID_API_KEY`

### 3. Configurar Email Remetente
- Vá em Settings > Sender Authentication
- Configure seu domínio ou email único
- Use o email verificado em `FROM_EMAIL`

## 🗄️ Configurando PostgreSQL

### Opção A: Railway (Recomendado para iniciantes)

1. **Criar conta no Railway**
   - Acesse [railway.app](https://railway.app/)
   - Conecte com GitHub

2. **Criar banco PostgreSQL**
   - New Project > Provision PostgreSQL
   - Copie a DATABASE_URL

3. **Executar migrações**
   ```bash
   npm run db:generate:postgres
   npm run db:push:postgres
   ```

### Opção B: Supabase

1. **Criar conta no Supabase**
   - Acesse [supabase.com](https://supabase.com/)
   - Crie um novo projeto

2. **Configurar banco**
   - Vá em Settings > Database
   - Copie a DATABASE_URL

3. **Executar migrações**
   ```bash
   npm run db:generate:postgres
   npm run db:push:postgres
   ```

## 🌐 Deploy no Vercel

### 1. Preparar Projeto

```bash
# Build do projeto
npm run build:all

# Verificar se build foi bem-sucedido
ls dist/
ls client/dist/
```

### 2. Conectar com Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login no Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Configurar Variáveis de Ambiente no Vercel

No dashboard do Vercel, vá em:
- Settings > Environment Variables
- Adicione todas as variáveis do `.env`

```env
NODE_ENV=production
DATABASE_URL=sua_url_postgresql_aqui
SENDGRID_API_KEY=sua_chave_sendgrid_aqui
FROM_EMAIL=noreply@seudominio.com
JWT_SECRET=seu_jwt_secret_aqui
SESSION_SECRET=seu_session_secret_aqui
CORS_ORIGIN=https://seudominio.com
```

### 4. Configurar Domínio

- Vá em Settings > Domains
- Adicione seu domínio personalizado
- Configure DNS conforme instruções

## 🔒 Configurações de Segurança

### 1. JWT Secret
```bash
# Gerar secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Session Secret
```bash
# Gerar secret seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. CORS
Configure apenas os domínios permitidos:
```env
CORS_ORIGIN=https://seudominio.com,https://www.seudominio.com
```

## 📊 Monitoramento

### 1. Logs
- Vercel: Dashboard > Functions > Logs
- Railway: Dashboard > Deployments > Logs

### 2. Métricas
- Vercel Analytics
- Railway Metrics

### 3. Uptime
- [UptimeRobot](https://uptimerobot.com/) (gratuito)
- [Pingdom](https://pingdom.com/)

## 🚨 Troubleshooting

### Erro de Conexão com Banco
- Verificar DATABASE_URL
- Verificar se banco está ativo
- Verificar firewall/SSL

### Erro de Email
- Verificar SENDGRID_API_KEY
- Verificar FROM_EMAIL
- Verificar limites da conta

### Erro de Build
- Verificar Node.js version
- Limpar cache: `npm run clean`
- Verificar dependências

## 📱 Pós-Deploy

### 1. Testar Funcionalidades
- [ ] Registro de usuário
- [ ] Verificação de email
- [ ] Login/logout
- [ ] Criação de perfil
- [ ] Agendamentos

### 2. Configurar Backup
- Backup automático do banco
- Backup dos arquivos

### 3. Monitoramento Contínuo
- Logs de erro
- Performance
- Uptime

## 🎯 Próximos Passos

1. **Domínio personalizado**
2. **SSL/HTTPS** (automático no Vercel)
3. **CDN** para assets
4. **Cache** para performance
5. **Analytics** para métricas

## 📞 Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/docs](https://railway.app/docs)
- **SendGrid**: [sendgrid.com/support](https://sendgrid.com/support)

---

**🎉 Parabéns! Seu AgendaFácil está no ar!**
