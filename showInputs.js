$(document).ready(function () {
  // Função para verificar o tipo de cifra selecionada
  function checkCipher() {
    var cipher = $('#cipher').val();
    if (cipher === 'rsa') {
      $('#key').parent().hide();
      $('#pubkey').parent().show();
      $('#privkey').parent().show();
    } else {
      $('#key').parent().show();
      $('#pubkey').parent().hide();
      $('#privkey').parent().hide();
    }
  }

  // Chamando a função ao carregar a página
  checkCipher();

  // Adicionando evento de mudança ao campo de seleção
  $('#cipher').change(checkCipher);

  // ...resto do seu código
});