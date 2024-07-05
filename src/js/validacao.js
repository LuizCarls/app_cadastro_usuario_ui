export default class Validacao {

    /*
    --------------------------------------------------------------------------------------
    Função para inicializar a máscara dos campos e validar o CPF
    --------------------------------------------------------------------------------------
    */
    static init() {
        $(document).ready(function() {  
            $('#cpf').mask('000.000.000-00', {reverse: true});
            $('#cep').mask('00000-000', {reverse: true});
            $('.cpf-column').mask('000.000.000-00', {reverse: true});
            $('.cep-column').mask('00000-000', {reverse: true});            
        });
    
        $('#cpf').on('blur', function() {
            const cpf = $('#cpf').val().replace(/\D/g, '');
            if (Validacao.validarCPF(cpf)) {
                $('#cpf-error').text('');
                $('#btnAtualizar').prop('disabled', false);    
                $('#btnCadastrar').prop('disabled', false);
            } else {
                $('#btnAtualizar').prop('disabled', true);    
                $('#btnCadastrar').prop('disabled', true);
                $('#cpf-error').text('CPF inválido.');
            }
        });
    }
    
    /*
    --------------------------------------------------------------------------------------
    Função para validar CPF informado
    --------------------------------------------------------------------------------------
    */
    static validarCPF(cpf) {
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
    Função para validar se todos os campos exceto o 'complemento' estão preenchidos
    --------------------------------------------------------------------------------------
    */
    static validarCamposExcetoComplemento() {
        let todosPreenchidos = true;
        var formData = $('#formCadastro').serializeArray();  

        // Itera sobre cada item no array de objetos formData
        formData.forEach(item => {      
            if (item.name !== 'complemento' && item.value.trim() === '') {
                todosPreenchidos = false;
                return false;  // Interrompe o loop
            }
        });

        return todosPreenchidos;
    }
}
