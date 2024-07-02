$(document).ready(function(){  
  $('#cpf').mask('000.000.000-00', {reverse: true});
  $('#cep').mask('000000-000', {reverse: true});
});

/*
  --------------------------------------------------------------------------------------
  Função para preencher os campos que serão editados
  --------------------------------------------------------------------------------------
*/

// Obter o índice do usuário a partir dos parâmetros de consulta
var params = getQueryParams();    
if (params.index) {
  $('#btnCadastrar').hide();
  $('#btnAtualizar').show();      

  var user = JSON.parse(localStorage.getItem('usuarioParaEditar'));
  // Preenche o formulário com os dados do usuário
  $('#nome').val(user.nome);
  $('#cpf').val(user.cpf);
  $('#email').val(user.email);
  $('#cep').val(user.cep);
  $('#rua').val(user.rua);
  $('#numero').val(user.numero);
  $('#complemento').val(user.complemento);
  $('#cidade').val(user.cidade);
  $('#estado').val(user.estado);
  
  // Limpa o localStorage
  localStorage.removeItem('usuarioParaEditar');
}

/*
  --------------------------------------------------------------------------------------
  Ações dos Botões
  --------------------------------------------------------------------------------------
*/

$('#btnAtualizar').click(function() {      
  excluirUsuario(params.index);
  atualizaUsuario();    
});   

$('#btnCadastrar').click(function() {
  adiconaUsuario();
});

$('#btnVoltar').click(function() {
    window.location.href = 'index.html';
});

$('#btnVerUsuarios').click(function() {
    window.location.href = 'usuarios.html';
});

/*
  --------------------------------------------------------------------------------------
  Função para obter os dados do CEP, via requisição GET
  --------------------------------------------------------------------------------------
*/

$('#cep').on('blur', function() {
  const cep = $(this).val().replace(/\D/g, '');
  const url = `https://viacep.com.br/ws/${cep}/json/?callback=?`;

  if (cep) {
    const validacep = /^[0-9]{8}$/;

    if (validacep.test(cep)) {
      buscarDadosCep(url);
    } else {
      mostrarAlerta("warning", "Formato de CEP inválido.");
    }
  }
});

function buscarDadosCep(url) {
  $.getJSON(url, function(dados) {
    if (!("erro" in dados)) {
      preencherCamposEndereco(dados);
    } else {
      mostrarAlerta("error", "CEP não encontrado.");
    }
  });
}

function preencherCamposEndereco(dados) {
  $("#rua").val(dados.logradouro);
  $("#cidade").val(dados.localidade);
  $("#estado").val(dados.uf);
}

function mostrarAlerta(icon, title) {
  Swal.fire({
    icon: icon,
    title: title,
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para validar CPF informado
  --------------------------------------------------------------------------------------
*/

$('#cpf').on('blur', function() {
  const cpf = $('#cpf').val().replace(/\D/g, '');
  if (validarCPF(cpf)) {
      $('#cpf-error').text('');      
  } else {
    $('#btnAtualizar').prop('disabled', true);    
    $('#btnCadastrar').prop('disabled', true);
      $('#cpf-error').text('inválido.');
  }  
});

function validarCPF(cpf) {
  if (cpf.length !== 11 || /^(\d)\1*$/.test(cpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i-1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto == 10 || resto == 11) resto = 0;
  if (resto != parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i-1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto == 10 || resto == 11) resto = 0;
  if (resto != parseInt(cpf[10])) return false;

  return true;
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar novo usuário, via requisição POST
  --------------------------------------------------------------------------------------
*/

function adiconaUsuario(){
  // Captura os valores do formulário
  var formData = $('#formCadastro').serializeArray(); 
  console.log("formData", formData)       
  var user = {};
  formData.forEach(function(item) {            
      user[item.name] = item.value;
  });         
  
  if(validarCamposExcetoComplemento(formData)){
    // Salva o usuário no localStorage
    var users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    Swal.fire({
      title: "Cadastro realizado com sucesso!",            
      icon: "success"
    });

    //alert('Usuário cadastrado com sucesso!');
    $('#formCadastro')[0].reset(); // Limpa o formulário

  }
  else{
    Swal.fire({
      icon: "warning",
      title: "Por favor, preencher todos os campos.",                       
    });  
  }   
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar os dados do usuário, via requisição PUT
  --------------------------------------------------------------------------------------
*/

function atualizaUsuario(){
  // Captura os valores do formulário
  var formData = $('#formCadastro').serializeArray(); 
  console.log("formData", formData)       
  var user = {};
  formData.forEach(function(item) {            
      user[item.name] = item.value;
  });         
  
  if(validarCamposExcetoComplemento(formData)){
    // Salva o usuário no localStorage
    var users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    Swal.fire({
      title: "Cadastro atualizado com sucesso!",            
      icon: "success"
    });

    //alert('Usuário cadastrado com sucesso!');
    $('#formCadastro')[0].reset(); // Limpa o formulário

  }
  else{
    Swal.fire({
      icon: "warning",
      title: "Por favor, preencher todos os campos.",                       
    });  
  }   
}

/*
  --------------------------------------------------------------------------------------
  Função para excluir usuário em edição do Local Storage
  --------------------------------------------------------------------------------------
*/

function excluirUsuario(index){
  var users = JSON.parse(localStorage.getItem('users')) || [];
  // Remover usuário do array pelo índice
  users.splice(index, 1);

  // Atualizar localStorage
  localStorage.setItem('users', JSON.stringify(users));
}

/*
  --------------------------------------------------------------------------------------
  Função validar os campos preenchidos
  --------------------------------------------------------------------------------------
*/


function validarCamposExcetoComplemento(formData) {
  let todosPreenchidos = true;
  $.each(formData, function(index, item) {      
      if (item.name !== 'complemento' && item.value.trim() === '') {
          todosPreenchidos = false;
          return false;
      }
  });
  return todosPreenchidos;
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