import Database from 'better-sqlite3';

try {
  // Conectar ao banco de dados
  const db = new Database('dev.db');
  
  console.log('🔍 Verificando códigos de verificação no banco...\n');
  
  // Verificar tabela de códigos de verificação
  const verificationCodes = db.prepare('SELECT * FROM verification_codes ORDER BY created_at DESC LIMIT 5').all();
  
  console.log('📋 Códigos de verificação encontrados:');
  verificationCodes.forEach((code, index) => {
    console.log(`\n${index + 1}. Código: ${code.code}`);
    console.log(`   Email: ${code.email}`);
    console.log(`   Usuário ID: ${code.user_id}`);
    console.log(`   Expira em: ${new Date(code.expires_at).toLocaleString()}`);
    console.log(`   Usado: ${code.used ? 'Sim' : 'Não'}`);
    console.log(`   Criado em: ${new Date(code.created_at).toLocaleString()}`);
  });
  
  // Verificar usuários
  const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT 5').all();
  
  console.log('\n👥 Usuários encontrados:');
  users.forEach((user, index) => {
    console.log(`\n${index + 1}. Nome: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email verificado: ${user.email_verified ? 'Sim' : 'Não'}`);
    console.log(`   Criado em: ${new Date(user.created_at).toLocaleString()}`);
  });
  
  db.close();
  
} catch (error) {
  console.error('❌ Erro ao acessar banco de dados:', error.message);
}
