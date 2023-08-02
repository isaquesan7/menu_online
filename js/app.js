$(document).ready(function(){

    cardapio.eventos.init();

})

//Variáveis
var cardapio = {};

var MEU_CARRINHO = [];

var VALOR_CARRINHO = 0;

var VALOR_ENTREGA = 5;

var MEU_ENDERECO = null;

var phone = '5571992105621';

var insta = 'dev.outs';

var fb = 'isaquess7';

var totalProdutos = 72;

var minProdutos = 8;

//Eventos de iniciação do site
cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarReserva();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarRedes();
    }

}

//Configuração geral do site
cardapio.metodos = {

    //obtém a lista de itens do cardápio.
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {

        var filtro = MENU[categoria];

        if(!vermais){
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) =>{

            let temp = cardapio.templates.item
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id);

            //botão ver mais foi clicado (total itens)
            if(vermais && i >= minProdutos && i < totalProdutos){
                $("#itensCardapio").append(temp)
            }

            //pagina inicial (8 itens)
            if(!vermais && i < minProdutos){
                $("#itensCardapio").append(temp)
            }

        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active');

    },

    //clique no botão ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
    
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');

    },

    //diminuir quantidade do item no cardápio
    diminuirQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0){
            $("#qntd-" + id).text(qntdAtual - 1);
        }

    },

    //aumentar quantidade do item no cardápio
    aumentarQuantidade: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        $("#qntd-" + id).text(qntdAtual + 1);

    },

    //adicionar ao carrinho o item no cardápio
    adicionarAoCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0){
            
            //obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem a lista de itens
            let filtro = MENU[categoria];

            //obter o item
            let item = $.grep(filtro, (e, i) => {return e.id == id});

            if(item.length > 0){

                //validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => {return elem.id == id});

                //caso exista so altera a quantidade
                if(existe.length > 0){

                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                }
                //caso não exista, adiciona
                else{

                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])

                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

            }

        }

    },

    //atualiza o badge total dos botões do carrinho
    atualizarBadgeTotal: () =>{

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) =>{
            total += e.qntd
        })

        if(total > 0){
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }else{
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    //abrir o carrinho
    abrirCarrinho: (abrir) =>{

        if(abrir){

            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
            $(".header").addClass('hidden');
            $(".banner").addClass('hidden');
            $(".servicos").addClass('hidden');
            $(".cardapio").addClass('hidden');
            $(".depoimentos").addClass('hidden');
            $(".reserva").addClass('hidden');

        }else{

            $("#modalCarrinho").addClass('hidden');
            $(".header").removeClass('hidden');
            $(".banner").removeClass('hidden');
            $(".servicos").removeClass('hidden');
            $(".cardapio").removeClass('hidden');
            $(".depoimentos").removeClass('hidden');
            $(".reserva").removeClass('hidden');
            window.location.href = "#cardapio";

        }

    },

    //carrega as etapas do carrinho
    carregarEtapas: (etapa) =>{

        if(etapa == 1){
            $("#lblTituloEtapa").text('Meu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

        }else if(etapa == 2){
            $("#lblTituloEtapa").text('Endereço de Entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }else if(etapa ==3){
            $("#lblTituloEtapa").text('Resumo do Pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');

        }

    },

    //voltar etapa no carrinho
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapas(etapa -1);

    },

    //carrega a lista de itens no carrinho
    carregarCarrinho: () =>{

        cardapio.metodos.carregarEtapas(1);

        if(MEU_CARRINHO.length > 0){

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) =>{

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd);

                $("#itensCarrinho").append(temp);

                //último item
                if((i + 1) == MEU_CARRINHO.length){
                    cardapio.metodos.carregarValores();
                }

            })

        }else{
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu Carrinho esta vazio!</p>');
            cardapio.metodos.carregarValores();
        }

    },

    //diminui a quantidade de itens no carrinho
    diminuirQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1){
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }else{
            cardapio.metodos.removerItensCarrinho(id);
        }

    },

    //aumenta a quantidade de itens no carrinho
    aumentarQuantidadeCarrinho: (id) =>{

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual >= 1){
            $("#qntd-carrinho-" + id).text(qntdAtual + 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);
        }else{
            cardapio.metodos.removerItensCarrinho(id);
        }

    },

    //remove itens do carrinho
    removerItensCarrinho: (id) =>{

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) =>{return e.id != id});
        cardapio.metodos.carregarCarrinho();

        //atualiza o botão carrinho com a quantidade atual de itens
        cardapio.metodos.atualizarBadgeTotal();

    },

    //atualiza a quantidade de itens no carrinho
    atualizarCarrinho: (id, qntd) =>{

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão carrinho com a quantidade atual de itens
        cardapio.metodos.atualizarBadgeTotal();

        //atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    //carrega os valores de subtotal, entrega e total
    carregarValores:()=>{

        VALOR_CARRINHO = 0;

        $("#lblSubTotal").text('R$ 0,00');
        $("#lblValorEntrega").text('+ R$ 0,00');
        $("#lblValorTotal").text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) =>{

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) == MEU_CARRINHO.length){
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.' , ',')}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.' , ',')}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.' , ',')}`);
            }

        })

    },

    //carregar etapa de endereço
    carregarEndereco: ()=>{

        if(MEU_CARRINHO.length <= 0){

            cardapio.metodos.mensagem('Seu carrinho está vazio.')
            return;

        }

        cardapio.metodos.carregarEtapas(2);

    },

    //API ViaCEP
    buscarCEP: ()=>{

        //cria a variável com o valor do CEP
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        if(cep != ""){

            //expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if(validacep.test(cep)){

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados){

                    if(!("erro" in dados)){
                        //Atualiza os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();


                    }else{
                        cardapio.metodos.mensagem('CEP não encontrado.');
                        $("#txtCEP").focus();

                    }

                });

            }else{
                cardapio.metodos.mensagem('Formato do CEP inválido.');
                $("#txtCEP").focus();
            }

        }else{
            cardapio.metodos.mensagem('Informe o CEP.');
            $("#txtCEP").focus();
        }

    },

    //validação antes de seguir para a etapa de resumo do pedido
    resumoPedido: ()=>{

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();
        let nome = $("#txtNome").val().trim();
        let telefone = $("#txtTelefone").val().trim();

        if(nome.length <= 0){
            cardapio.metodos.mensagem('Informe o seu Nome.');
            $("#txtNome").focus();
            return;
        }

        if(telefone.length <= 0){
            cardapio.metodos.mensagem('Informe o seu Telefone.');
            $("#txtTelefone").focus();
            return;
        }

        if(cep.length <= 0){
            cardapio.metodos.mensagem('Informe o CEP.');
            $("#txtCEP").focus();
            return;
        }

        if(endereco.length <= 0){
            cardapio.metodos.mensagem('Informe o Endereço.');
            $("#txtEndereco").focus();
            return;
        }

        if(bairro.length <= 0){
            cardapio.metodos.mensagem('Informe o Bairro.');
            $("#txtBairro").focus();
            return;
        }

        if(cidade.length <= 0){
            cardapio.metodos.mensagem('Informe a Cidade.');
            $("#txtCidade").focus();
            return;
        }

        if(uf == "-1"){
            cardapio.metodos.mensagem('Informe o Estado.');
            $("#ddlUf").focus();
            return;
        }

        if(numero.length <= 0){
            cardapio.metodos.mensagem('Informe o Numero da moradia.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento,
            nome: nome,
            telefone: telefone
        }

        cardapio.metodos.carregarEtapas(3);
        cardapio.metodos.carregarResumo();

    },

    //carrega a ultima etapa do pedido
    carregarResumo: () =>{

        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) =>{

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${qntd}/g, e.qntd);

            $("#listaItensResumo").append(temp);

        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} - ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep} &nbsp; ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();

    },

    //Envia pedido para o WhatsApp do estabelecimento 
    finalizarPedido:() =>{

        if(MEU_CARRINHO.length > 0 && MEU_ENDERECO != null){

            var texto = 'Olá! Gostaria de fazer um pedido:';
            texto += `\n\n*Itens do pedido:*\n\n\${itens}`;
            texto += `\n*Valor da Entrega: R$ ${VALOR_ENTREGA.toFixed(2).replace('.' , ',')}*`
            texto += `\n\n*Endereço de Entrega:*`;
            texto += `\n\n${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero} - ${MEU_ENDERECO.bairro}`;
            texto += `\n${MEU_ENDERECO.cidade} - ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`;
            texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.' , ',')}*`;
            texto += `\n\n\n*Nome: ${MEU_ENDERECO.nome}*`;
            texto += `\n*Telefone: ${MEU_ENDERECO.telefone}*`;

            var itens = '';

            $.each(MEU_CARRINHO, (i, e) =>{

                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.' , ',')} \n`;

                if((i + 1) == MEU_CARRINHO.length){

                    texto = texto.replace(/\${itens}/g, itens);

                    //converter a URL
                    let encode = encodeURI(texto);
                    let URL = `http://wa.me/${phone}?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);

                }

            })

        }

    },

    //carrega o link para realizar reserva
    carregarReserva: () =>{

        var texto = 'Olá! Gostaria de realizar uma *reserva*';

        //converter a URL
        let encode = encodeURI(texto);
        let URL = `http://wa.me/${phone}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    //carrega o link para realizar ligação
    carregarBotaoLigar: ()=>{
        $("#fazerLigacao").attr('href' , `tel:${phone}`);
    },

    //alterna entre depoimentos
    abrirDepoimento: (depoimento)=>{

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    //carrega as paginas das redes sociais
    carregarRedes: ()=>{

        $(".rede-1").attr('href' , `https://www.instagram.com/${insta}`);
        $(".rede-2").attr('href' , `https://www.facebook.com/${fb}`);
        $(".rede-3").attr('href' , `http://wa.me/${phone}`);

    },

    //executa a pesquisa de produto
    search: () => {

        let input = document.getElementById('txtPesquisar').value;
        input=input.toLowerCase();
        let x = document.getElementsByClassName('produto');
      
        for (i = 0; i < x.length; i++) {
            if (!x[i].innerHTML.toLowerCase().includes(input)) {
                x[i].style.display="none";
            }else{
                x[i].style.display="flex";               
            }
        }

        if(i >= minProdutos && i < totalProdutos){
            cardapio.metodos.obterItensCardapio('todos');
            cardapio.metodos.verMais();
        }

        if(!input){
            cardapio.metodos.obterItensCardapio();
        }


    },

    //mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) =>{

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() =>{
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() =>{
                $("#msg-" + id).remove();
            }, 800);
        }, tempo);

    },

}

//Formatar campo "Telefone" na pagina 2 do carrinho
const formatarTelefone = {

    numeroTelefone (value) {
  
      return value
  
        .replace(/\D/g, '')
  
        .replace(/(\d{2})(\d)/, '($1)$2')
  
        .replace(/(\d{4})(\d)/, '$1-$2')
  
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
  
        .replace(/(-\d{4})\d+?$/, '$1')
  
    }
  
}

//Continuação do "Formatar Telefone"
document.querySelectorAll("input[type='tel']").forEach(($input) => {
  
        const field = $input.dataset.js
  
        $input.addEventListener("input", (e) => {
  
            e.target.value = formatarTelefone[field](e.target.value)
  
        }, false)
  
})

//Templates dos produtos
cardapio.templates = {

    item:
        `

                    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeIn produto">

                        <div class="card card-item" id="\${id}">

                            <div class="img-produto">
                                <img src="\${img}">
                            </div>

                            <p class="title-produto text-center mt-4">
                                <b>\${name}</b>
                            </p>

                            <p class="price-produto text-center">
                                <b>R$ \${price}</b>
                            </p>

                            <div class="add-carrinho">
                                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                            </div>

                        </div>

                    </div>

        `,

    itemCarrinho:
        `
                    <div class="col-12 item-carrinho">

                        <div class="img-produto">
                            <img src="\${img}">
                        </div>

                        <div class="dados-produto">
                            <p class="title-produto"><b>\${name}</b></p>
                            <p class="price-produto"><b>R$ \${price}</b></p>
                        </div>

                        <div class="add-carrinho">
                            <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                            <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                            <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                            <span class="btn btn-remove" onclick="cardapio.metodos.removerItensCarrinho('\${id}')"><i class="fas fa-times"></i></span>
                        </div>

                    </div>

        `,
    itemResumo:
        `
                    <div class="col-12 item-carrinho resumo">
                        <div class="img-produto-resumo">
                            <img src="\${img}">
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto-resumo"><b>\${name}</b></p>
                            <p class="price-produto-resumo"><b>R$ \${price}</b></p>
                        </div>
                        <p class="quantidade-produto-resumo">x <b>\${qntd}</b></p>
                    </div>

        `

}