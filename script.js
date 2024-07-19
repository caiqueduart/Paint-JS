/*
Estou recuperando os elemento do HTML e colocando nas
constantes abaixo, para usar nas arrow functions que serão 
acionadas por eventos realizados pelo usuário.
*/
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const color = document.querySelector(".color");
const tools = document.querySelectorAll(".tool-button");
const sizeButtons = document.querySelectorAll(".button-size");

/*
Abaixo estou declarando e inicializando as variáveis globais,
para serem usandas nas arrow functions.
*/
let brushSize = 20;
let isPainting = false;
let tool = "brush"

/*
Função que é acionada quando o usuário mudar a cor no paint, certificando
que aqui também seja alterada.
*/
color.addEventListener("change", ({target}) => {
    ctx.fillStyle = target.value;
})

/*
Função que é acionada sempre que o usuário clica em algum botão do mouse,
mudando o valor de "isPainting" para "true", permitindo assim a pintura.
*/
canvas.addEventListener("mousedown", ({clientX, clientY}) => {
    isPainting = true;

    if(tool == "brush") {
        draw(clientX, clientY);
    }

    if(tool == "eraser") {
        eraser(clientX, clientY)
    }
})

/*
Função para detectar se o usuário está movendo o mouse,
para garantir que a pintura continue nas coordenadas
em que o cursor se encontra, (chamadas seguidas a função draw()).
*/
canvas.addEventListener("mousemove", (event) => {
    const {clientX, clientY} = event;
    if(isPainting && tool == "brush") {
        draw(clientX, clientY);
    }

    if(isPainting && tool == "eraser") {
        eraser(clientX, clientY);
    }

    if(tool == "clear") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
})

/*
Função para detectar se o usuário tirou o dedo do mouse, mudando assim o estado
do isPainting para false.
*/
canvas.addEventListener("mouseup", () => {
    isPainting = false;
})

/*
Função para realizar a pintura na tela, é colocado círculos dentro da área 
ocupada pela tag canvas, para simular traços.
*/
const draw = (x, y) => {
    ctx.globalCompositeOperation = "source-over";
    ctx.beginPath();
    ctx.arc(
        x - canvas.offsetLeft, 
        y - canvas.offsetTop, 
        brushSize/2, 
        0, 
        90
    ); 

    ctx.fill();
}

/*
Função para apagar o que foi pintado. Comportamento similiar a função draw(),
porém ela remove a pintura na região em que o mouse passar.
*/
const eraser = (x, y) => {

    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath();
    ctx.arc(
        x - canvas.offsetLeft, 
        y - canvas.offsetTop, 
        brushSize/2, 
        0, 
        90
    ); 

    ctx.fill();
}

/* 
Função para selecionar a ferramenta que será utilizada.
Através de um evento, ela recupera o valor do atributo especial "data-action" 
dentro das tags HTML, para definir a ferramenta que será usada.
*/
const selectTool = ({target}) => {
    const selectTool = target.closest("button");
    const action = selectTool.getAttribute("data-action");

    if(action) {
        tools.forEach((tool) => tool.classList.remove("active"));
        tool = action;
        selectTool.classList.add("active");
    }
}

/*
Função para selecionar o tamanho do pincel, comportamento similar
a função selectTool().
*/
const selectSize = ({target}) => {
    const selectedSize = target.closest("button");
    const size = selectedSize.getAttribute("data-size");

    sizeButtons.forEach((tool) => tool.classList.remove("active"));
    selectedSize.classList.add("active");
    brushSize = size;
}

/*
As duas funções abaixo são para detectar o clique do usuário, e chamar as funções
selectTool() ou selectSize(), para determinar qual a ferramenta ou qual tamanho usuário clicou.
*/
tools.forEach((tool) => {
    tool.addEventListener("click", selectTool);
})

sizeButtons.forEach((button) => {
    button.addEventListener("click", selectSize);
})