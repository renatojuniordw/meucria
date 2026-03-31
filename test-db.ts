import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function test() {
  console.log('--- Testando Conexão Supabase ---')
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' })
  
  if (error) {
    console.error('❌ Erro na conexão:', error.message)
  } else {
    console.log('✅ Conexão bem sucedida!')
    console.log('Tabela profiles acessada com sucesso.')
  }
}

test()
