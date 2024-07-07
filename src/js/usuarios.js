import URLS from "./config.js";
import Validacao from "./validacao.js";

// Chama a função para obter os usuários quando a página carregar
$(document).ready(function() {
    buscarUsuarios(); 
    Validacao.init();       
});

/*
  --------------------------------------------------------------------------------------
  Função que busca os usuários cadastrados e adiciona na tabela
  --------------------------------------------------------------------------------------
*/

function buscarUsuarios() {
    limparTabelaUsuarios();
    $.ajax({
        url: URLS.BUSCAR_USUARIOS,
        method: 'GET',
        contentType: 'application/json',
        success: function(data) {
            if (data && Array.isArray(data.usuarios)) { // Verifica se data.usuarios é um array
                data.usuarios.forEach(function(usuario) {
                    adicionarUsuarioNaTabela(usuario);
                });
            } else {
                console.error('Formato inesperado da resposta da API:', data);
            }
        },
        error: function(error) {            
            Swal.fire({
                title: "Erro ao obter usuários:",
                text: error.responseText,
                icon: "error"
            });
        }
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para excluir usuário, via requisição DELETE
  --------------------------------------------------------------------------------------
*/

window.excluirUsuario = function (id) {
    Swal.fire({
        title: "Você tem certeza que deseja excluir este usuário?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
        cancelButtonText: "Não, cancelar!"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `${URLS.EXCLUIR_USUARIO}?id=${encodeURIComponent(id)}`,
                type: 'DELETE',
                success: function(response) {
                    Swal.fire({
                        title: "Usuário excluído!",
                        icon: "success"
                    }).then(() => {
                        buscarUsuarios(); // Atualiza a lista de usuários após a exclusão
                    });
                },
                error: function(xhr, status, error) {
                    Swal.fire({
                        title: "Erro ao excluir usuário",
                        text: xhr.responseText,
                        icon: "error"
                    });
                }
            });
        }
    });
}

/*
  --------------------------------------------------------------------------------------
  Funções de filtros
  --------------------------------------------------------------------------------------
*/

function filtrarUsuariosPorNome() {
    const nomeFiltro = $('#nome').val().toLowerCase();
    $.ajax({
        url: `${URLS.BUSCAR_USUARIO_POR_NOME}?nome=${encodeURIComponent(nomeFiltro)}`,
        type: 'GET',
        success: function(data) {
            limparTabelaUsuarios();
            if (data && Array.isArray(data.usuarios)) { // Verifica se data.usuarios é um array
                data.usuarios.forEach(usuario => {
                    adicionarUsuarioNaTabela(usuario);
                });
            } else {
                $('#usuariosTableBody').append('<tr><td colspan="10">Usuário não encontrado</td></tr>');
            }
        },
        error: function() {
            limparTabelaUsuarios();
            $('#usuariosTableBody').append('<tr><td colspan="10">Erro ao buscar usuários</td></tr>');
        }
    });
}

function filtrarUsuariosPorCpf() {
    const cpfFiltro = $('#cpf').val().replace(/\D/g, '');

    if (cpfFiltro.length === 11) {
        $.ajax({
            url: `${URLS.BUSCAR_USUARIO_POR_CPF}?cpf=${encodeURIComponent(cpfFiltro)}`,
            type: 'GET',
            success: function(usuario) {
                limparTabelaUsuarios();
                if (usuario) {
                    adicionarUsuarioNaTabela(usuario);
                } else {
                    $('#usuariosTableBody').append('<tr><td colspan="10">Usuário não encontrado</td></tr>');
                }
            },
            error: function() {
                limparTabelaUsuarios();
                $('#usuariosTableBody').append('<tr><td colspan="10">Usuário não encontrado</td></tr>');
            }
        });
    } else if (cpfFiltro.length === 0) {
        buscarUsuarios();
    }
}


function filtrarUsuariosPorId(id) {    
    $.ajax({
        url: `${URLS.BUSCAR_USUARIO_POR_ID}?id=${encodeURIComponent(id)}`,
        type: 'GET',
        success: function(data) {
            limparTabelaUsuarios();
            if (data && Array.isArray(data.usuarios)) { // Verifica se data.usuarios é um array
                data.usuarios.forEach(usuario => {
                    adicionarUsuarioNaTabela(usuario);
                });
            } else {
                $('#usuariosTableBody').append('<tr><td colspan="10">Usuário não encontrado</td></tr>');
            }
        },
        error: function() {
            limparTabelaUsuarios();
            $('#usuariosTableBody').append('<tr><td colspan="10">Erro ao buscar usuário</td></tr>');
        }
    });
}

// Adiciona evento de input aos campos de filtro
$('#nome').on('input', filtrarUsuariosPorNome);
$('#cpf').on('change', filtrarUsuariosPorCpf);

/*
  --------------------------------------------------------------------------------------
  Função que adiciona usuários na Tabela
  --------------------------------------------------------------------------------------
*/

function adicionarUsuarioNaTabela(usuario) {    
    $('#usuariosTableBody').append(`
        <tr>
            <td class="nome-column">${usuario.nome}</td>
            <td>${mascararCPF(usuario.cpf)}</td>
            <td class="email-column">${usuario.email}</td>
            <td>${usuario.rua}</td>
            <td>${usuario.numero}</td>
            <td>${usuario.complemento}</td>
            <td>${usuario.cidade}</td>
            <td>${usuario.estado}</td>
            <td>${mascararCEP(usuario.cep)}</td>
            <td>                
                <button class="btn btn-sm btn-edit" style="color:#ffffff;background:#ff6600" onclick="window.location.href='../app/cadastro.html?id=${usuario.id}'"><i class="fas fa-edit"></i> Editar</button>
                <button class="btn btn-danger btn-sm btn-delete" onclick="excluirUsuario(${usuario.id})"><i class="fas fa-trash"></i> Excluir</button>
            </td>
        </tr>
    `);

    Validacao.init();
}

/*
  --------------------------------------------------------------------------------------
  Função para limpar tabela de Usuários
  --------------------------------------------------------------------------------------
*/

function limparTabelaUsuarios() {
    $('#usuariosTableBody').empty();
}

function mascararCPF(cpf) {    
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function mascararCEP(cep) {   
    console.log("te amo, bb Raiane", cep) 
    return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}