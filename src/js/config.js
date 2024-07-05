const API_BASE_URL = 'http://localhost:5000';

const URLS = {
    ADICIONA_USUARIO: `${API_BASE_URL}/adiciona_usuario`,
    BUSCAR_USUARIOS: `${API_BASE_URL}/buscar_usuarios`,
    BUSCAR_USUARIO_POR_ID: `${API_BASE_URL}/buscar_usuario_por_id`,
    BUSCAR_USUARIO_POR_NOME: `${API_BASE_URL}/buscar_usuario_por_nome`,
    BUSCAR_USUARIO_POR_CPF: `${API_BASE_URL}/buscar_usuario_por_cpf`,
    ATUALIZAR_USUARIO: `${API_BASE_URL}/atualizar_usuario`,
    EXCLUIR_USUARIO: `${API_BASE_URL}/excluir_usuario`,    
};

export default URLS;