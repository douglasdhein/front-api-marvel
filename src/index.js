import axios from 'axios';

class App {
    constructor() {
        this.urlBase = 'https://growdev-marvel.herokuapp.com/';
        
        this.buscarPersonagens();

        this.atribuirDom();

    }

    atribuirDom() {
        document.getElementById("pesquisar").onclick = (event) => this.pesquisar();
    }

    pesquisar() {
        const texto = document.getElementById("texto").value;
        
        this.buscarPersonagens(texto);
    }

    // Método para centraliza todas as chamadas a API
    consomeApi(url) {
        return axios.get(url);
    }

    // Buscar dados de personagens 
    buscarPersonagens(texto) {
        // monto a URL para a requisição
        let urlRequisicao = `${this.urlBase}personagens`;

        // se veio texto de pesquisa, colocar na URL
        if (texto) {
            // concateno o texto na url
            urlRequisicao += `?nome=${texto}`;
        }

        // Mostrar barra de carregando
        document.getElementById("carregando").style.display = "flex";
        // Esconder a listagem
        document.getElementById("lista-personagens").style.display = "none";
        
        // Envio a requisição para o Backend
        // this.consomeApi(`${this.urlBase}personagens`);
        this.consomeApi(urlRequisicao).then(response => {
            // Injetar os dados da lista em CARDS na tela
            let html = "";
            response.data.results.forEach(p => {
                html += this.cardPersonagem(p);
            });

            // insiro os cards no elemento div da tela
            document.getElementById("lista-personagens").innerHTML = html;

            // Esconder a barra de progresso
            document.getElementById("carregando").style.display = "none";
            // Mostrar a listagem
            document.getElementById("lista-personagens").style.display = "flex";

            // Atribuir evento ao click de todos botoes de detalhe
            document.querySelectorAll(".bt-detalhe").forEach((el) => {
                // Atribuo ao clique do evento a chamada do cliqueDetalhe
                el.onclick = (event) => this.cliqueDetalhe(event);
            });
        });
    }

    cliqueDetalhe(event) {
        const id = event.path[0].dataset.id;

        // monto a URL para a requisição
        let urlRequisicao = `${this.urlBase}personagens/${id}`;

        // Mostrar barra de carregando
        document.getElementById("carregando").style.display = "flex";
        // Esconder a listagem
        document.getElementById("lista-personagens").style.display = "none";


        // Envio a requisição para o Backend
        // this.consomeApi(`${this.urlBase}personagens/111111`);
        this.consomeApi(urlRequisicao).then(response => {
            // resposta da API em algum momento
            let html = `<h1>${response.data.results[0].name}</h1>
            <h3>${response.data.results[0].description}</h3>
            <br>
            <br>
            <a class="btn btn-secondary bt-voltar" role="button">Voltar</a>
            `;

            // injetar o layout na página
            document.getElementById("detalhes").innerHTML = html;

            // Esconder o progressor
            document.getElementById("carregando").style.display = "none";

            // mostrar os detalhes no HTML
            document.getElementById("detalhes").style.display = "flex";

            // interceptar o clique do voltar
            document.querySelector(".bt-voltar").onclick = (event) => {
                // escondendo detalhes
                document.getElementById("detalhes").style.display = "none";
                // exibindo os personagens novamente
                document.getElementById("lista-personagens").style.display = "flex";
            };
        });
    }

    cardPersonagem(personagem) {
        return `
        <div class="col-lg-4">
            <img 
                src="${personagem.thumbnail.path}.${personagem.thumbnail.extension}"
                class="bd-placeholder-img rounded-circle" width="140" height="140"
            >

            <h2>${personagem.name}</h2>
            <p>${personagem.description || "Sem informações"}</p>
            <p><a data-id="${personagem.id}" class="btn btn-secondary bt-detalhe" role="button">View details &raquo;</a></p>
        </div>
        `;
    }
}

new App();
