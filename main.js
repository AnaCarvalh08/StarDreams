const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
console.log(SpeechRecognition);
let reconhecimentoCompleto = "";
const cardsContainer = document.querySelector(".container-cards");

if (!SpeechRecognition) {
    alert("Seu navegador não suporta a API de comando de voz");
} else {
    console.log("Seu navegador suporta o comando de voz");
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = true;

    const btngravar = document.getElementById("gravar");

    btngravar.addEventListener("click", () => {
        reconhecimentoCompleto = " ";
        recognition.start();
        console.log('gravando');
    })

    const btnparar = document.getElementById("parar");
    btnparar.addEventListener("click", () => {
        recognition.stop();
        console.log('parou');
    })

    recognition.addEventListener('result', (event) => {
        console.log(event);
        //console.log(event.results[event.resultIndex][0].transcript);
        reconhecimentoCompleto += event.results[event.resultIndex][0].transcript;
    })

    recognition.addEventListener("end", () => {
        //   console.log("finalizou");

        //importante.
        if (reconhecimentoCompleto !== '') {
            salvarAnotacaoLocalStorage(reconhecimentoCompleto);
        }
        //console.log(reconhecimentoCompleto);
    })

    function salvarAnotacaoLocalStorage(texto) {
        //console.log(texto);
        
        const anotacoes = JSON.parse(localStorage.getItem('notas')) || [];
        

        
        anotacoes.push(texto);
        //console.log(anotacoes);

        
        //setItem = definir item.
        //stringify() : Aceita um objeto como um parâmetro e retorna o formato equivalente de string JSON.
        localStorage.setItem('notas', JSON.stringify(anotacoes));

        gerarCards()
    }

    function gerarCards() {
        const anotacoes = JSON.parse(localStorage.getItem('notas')) || [];
        cardsContainer.innerHTML = '';


        //forEach = para cada. 
        anotacoes.forEach((nota, index) => {
            console.log(nota)
            console.log(index)
            const card = document.createElement('div');
            card.classList.add('card');
            const p = document.createElement('p');
            p.textContent = nota;

            const divButton = document.createElement('div');
            divButton.classList.add('bt-card');

            const btEditar = document.createElement('button');
            btEditar.id = "editar";
            btEditar.textContent = "✏️";

            const btExcluir = document.createElement('button');
            btExcluir.id = "excluir";
            btExcluir.textContent = "🗑️";

            
            btEditar.addEventListener('click', () => {

                //prompt() faz mais do que alert() , solicitando ao usuário que insira dados e armazenando-os em uma variável após o usuário clicar em OK
                const textoEditado = prompt("Editar nota: ", nota);
                // console.log(textoEditado);
                if (textoEditado !== null) {
                    
                    anotacoes[index] = textoEditado;
                    
                    localStorage.setItem('notas', JSON.stringify(anotacoes));
                    
                    gerarCards()
                }
            })

            btExcluir.addEventListener('click', () => {
                anotacoes.splice(index, 1) //splice 1* argumento: posição do array. 2* argumento: quantidade para deletar.
                localStorage.setItem('notas', JSON.stringify(anotacoes));
                gerarCards()
            })

            cardsContainer.appendChild(card);
            card.appendChild(p);
            card.appendChild(divButton);
            divButton.appendChild(btEditar);
            divButton.appendChild(btExcluir);
        })
    }

    //O onload é um atributo que usamos quando queremos disparar um evento quando qualquer elemento tenha sido carregado. 
    window.onload = gerarCards;
}
