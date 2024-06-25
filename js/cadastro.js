$(document).ready(function() 
{ 
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
  
  $('#btnAtualizar').click(function() {  
    console.log("params.index", params.index)
    excluirUsuario(params.index);
    atualizaUsuario();    
  });    
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

$('#cep').on('blur', function() {
    var cep = $(this).val().replace(/\D/g, '');

    if (cep != "") {
      var validacep = /^[0-9]{8}$/;

      if(validacep.test(cep)) {
        $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {

          if (!("erro" in dados)) {
            $("#rua").val(dados.logradouro);
            $("#cidade").val(dados.localidade);
            $("#estado").val(dados.uf);
          } else {
            Swal.fire({
              icon: "Error",
              title: "CEP não encontrado.",                
            });              
          }
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Formato de CEP inválido.",                
        });          
      }
    }
});  

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
      title: "Por favor, digite um CEP.",                       
    });  
  }   
}

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
      title: "Por favor, digite um CEP.",                       
    });  
  }   
}

function excluirUsuario(index){
  var users = JSON.parse(localStorage.getItem('users')) || [];
  // Remover usuário do array pelo índice
  users.splice(index, 1);

  // Atualizar localStorage
  localStorage.setItem('users', JSON.stringify(users));
}

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

function getQueryParams() {
  var params = {};
  window.location.search.substring(1).split("&").forEach(function(param) {
      var parts = param.split("=");
      params[parts[0]] = decodeURIComponent(parts[1]);
  });
  return params;
}