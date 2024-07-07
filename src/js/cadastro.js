import URLS from "./config.js";
import Validacao from "./validacao.js";

// Inicialize a máscara dos campos
Validacao.init();

/*
  --------------------------------------------------------------------------------------
  Função para preencher os dados nos campos do formulário que serão editados
  --------------------------------------------------------------------------------------
*/

// Obter o índice do usuário a partir dos parâmetros de consulta
var params = getQueryParams();
if (params.id) {
  $('#btnCadastrar').hide();
  $('#btnAtualizar').show();      
  var id = params.id;
  // Fazer a requisição para buscar os dados do usuário
  $.ajax({
    url: `${URLS.BUSCAR_USUARIO_POR_ID}?id=${encodeURIComponent(id)}`,    
    type: 'GET',
    success: function(response) {
        // Preenche o formulário com os dados do usuário
        preencheFormulario(response)
    },
    error: function(xhr, status, error) {
        Swal.fire({
            title: "Erro ao buscar usuário",
            text: xhr.responseText,
            icon: "error"
        });
    }
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para obter os dados do CEP, via requisição GET
  --------------------------------------------------------------------------------------
*/

$('#cep').on('blur', function() {
  const cep = $(this).val().replace(/\D/g, '');
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  if (cep) {
      const validacep = /^[0-9]{8}$/;

      if (validacep.test(cep)) {
          buscarDadosCep(url);
      } else {
          mostrarAlerta("warning", "Formato de CEP inválido.");
      }
  }
});

// Função para buscar dados do CEP
function buscarDadosCep(url) {
  $.ajax({
      url: url,
      dataType: 'json',
      success: function(dados) {
          if (!("erro" in dados)) {
              preencherCamposEndereco(dados);
          } else {
              mostrarAlerta("error", "CEP não encontrado.");
          }
      },
      error: function() {
          mostrarAlerta("error", "Erro ao buscar o CEP.");
      }
  });
}

// Função para preencher campos de endereço
function preencherCamposEndereco(dados) {
  $("#rua").val(dados.logradouro);
  $("#cidade").val(dados.localidade);
  $("#estado").val(dados.uf);
}

// Função para mostrar alertas
function mostrarAlerta(icon, title) {
  Swal.fire({
      icon: icon,
      title: title,
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar novo usuário, via requisição POST
  --------------------------------------------------------------------------------------
*/

window.adiconaUsuario = function () {
  if (Validacao.validarCamposExcetoComplemento()) {
    var formData = obtemFormData();

    console.log("formData", formData)



    $.ajax({
        url: URLS.ADICIONA_USUARIO,          
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            Swal.fire({
                title: "Cadastro realizado com sucesso!",
                icon: "success"
            });

            // Limpa o formulário
            $('#formCadastro')[0].reset();
        },
        error: function(jqXHR) {
            var errorMsg = "Erro ao cadastrar usuário";
            if (jqXHR.status === 409) {
                errorMsg = "Usuário de mesmo CPF já salvo na base :/";
            } else if (jqXHR.status === 400) {
                errorMsg = "Não foi possível salvar novo usuário :/";
            }
            Swal.fire({
                icon: "error",
                title: errorMsg
            });
        }
    });
  } else {
      Swal.fire({
          icon: "warning",
          title: "Por favor, preencher todos os campos."
      });
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar os dados do usuário, via requisição PUT
  --------------------------------------------------------------------------------------
*/

window.atualizaUsuario = function () {  
  if (Validacao.validarCamposExcetoComplemento()) {
    var formData = obtemFormData();     
    formData.append('id', params.id);
    $.ajax({
        url: URLS.ATUALIZAR_USUARIO,
        method: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {              
            Swal.fire({
                title: "Cadastro atualizado com sucesso!",
                icon: "success"
            });
            
            limparFormulario();          
        },
        error: function (xhr, status, error) {              
            Swal.fire({
                icon: "error",
                title: "Erro ao atualizar o cadastro.",
                text: xhr.responseJSON ? xhr.responseJSON.detail : error
            });
        }
    });
  } else {      
      Swal.fire({
          icon: "warning",
          title: "Por favor, preencher todos os campos."
      });
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter o parâmetro enviado via URL para editar os dados do usuário
  --------------------------------------------------------------------------------------
*/

function getQueryParams() {
  var params = {};
  window.location.search.substring(1).split("&").forEach(function(param) {
      var parts = param.split("=");
      params[parts[0]] = decodeURIComponent(parts[1]);
  });
  return params;
}

function preencheFormulario(usuario){
  $('#nome').val(usuario.nome);
  $('#cpf').val(usuario.cpf);
  $('#email').val(usuario.email);
  $('#cep').val(usuario.cep);
  $('#rua').val(usuario.rua);
  $('#numero').val(usuario.numero);
  $('#complemento').val(usuario.complemento);
  $('#cidade').val(usuario.cidade);
  $('#estado').val(usuario.estado);
}


function obtemFormData() {
  const form = document.getElementById('formCadastro');
  const formData = new FormData(form);

  ['cpf', 'cep'].forEach(campo => {
      const valor = formData.get(campo);
      if (valor) {
          formData.set(campo, removeMascara(valor));
      }
  });

  // Adiciona um valor para o campo 'complemento' se não estiver presente
  if (!formData.has('complemento')) {
      formData.append('complemento', '');
  }

  return formData;
}

function removeMascara(valor) {
  return valor.replace(/\D/g, '');
}

function limparFormulario() {
  $('#formCadastro').find('input:text, input:password, input:file, textarea, select').val('');
  $('#formCadastro').find('input:radio, input:checkbox').prop('checked', false);
  $('#formCadastro').find('select').prop('selectedIndex', 0);
}