const socket = io();
let symbol, turn;
const a0 = document.querySelector("#a0");
const a1 = document.querySelector("#a1");
const a2 = document.querySelector("#a2");
const b0 = document.querySelector("#b0");
const b1 = document.querySelector("#b1");
const b2 = document.querySelector("#b2");
const c0 = document.querySelector("#c0");
const c1 = document.querySelector("#c1");
const c2 = document.querySelector("#c2");
const $messages = document.querySelector("#messages");
//function to check board is full or not
function gameTied(){
  const a=a0.innerText;
  const b=a1.innerText;
  const c=a2.innerText;
  const d=b0.innerText;
  const e=b1.innerText;
  const f=b2.innerText;
  const g=c0.innerText;
  const h=c1.innerText;
  const i=c2.innerText;
  return (a+b+c+d+e+f+g+h+i).length===9;
}
//function to check weather there isa winner till now or not iff there is a winner the ther must be game over
function gameOver(){
  const a=a0.innerText;
  const b=a1.innerText;
  const c=a2.innerText;
  const d=b0.innerText;
  const e=b1.innerText;
  const f=b2.innerText;
  const g=c0.innerText;
  const h=c1.innerText;
  const i=c2.innerText;
  //checking horizontally
  if(a+b+c==="000" || a+b+c=="XXX" || d+e+f==="000" ||d+e+f==="XXX" || g+h+i==="000" || g+h+i==="XXX") return true;
  //checking vertically
  if(a+d+g==="000" || a+d+g==="XXX" || b+e+h==="000" || b+e+h==="XXX" || c+f+i==='000' || c+f+i==="XXX")
  return true;
  // checking diagonally
  if(a+e+i==="000" || a+e+i==="XXX" || c+e+g==="000" || c+e+g==="XXX") 
  return true;
  return false;
}
//function to make the buttons disable is there is turn of another player or when game is over
function makeDisbled() {
  a0.setAttribute("disabled", "disabled");
  a1.setAttribute("disabled", "disabled");
  a2.setAttribute("disabled", "disabled");
  b0.setAttribute("disabled", "disabled");
  b1.setAttribute("disabled", "disabled");
  b2.setAttribute("disabled", "disabled");
  c0.setAttribute("disabled", "disabled");
  c1.setAttribute("disabled", "disabled");
  c2.setAttribute("disabled", "disabled");
}
//function to enable buttons
function removeDisbled() {
  a0.removeAttribute("disabled");
  a1.removeAttribute("disabled");
  a2.removeAttribute("disabled");
  b0.removeAttribute("disabled");
  b1.removeAttribute("disabled");
  b2.removeAttribute("disabled");
  c0.removeAttribute("disabled");
  c1.removeAttribute("disabled");
  c2.removeAttribute("disabled");
}

//function to provide message according to current situation
function renderMessage() {
  if (!turn) {
    $messages.innerText = "Your Opponents Turn!";
    makeDisbled();
  } else {
    $messages.innerText = "Your turn!";
    removeDisbled();
  }
}

//this function is called when a valid player clicks a button
function makeMove(e) {
  if (!turn || e.target.innerText) return;
  socket.emit("makeMove", { symbol, position: e.target.id });
}
socket.on("gameBegin", (Symbol) => {
  symbol = Symbol;
  //for toggling state turn variable
  turn = symbol === "X";
  renderMessage();
});
socket.on('moveMade',(data)=>{
  
  document.getElementById(data.position.toString()).innerText=data.symbol;
  //for toggling state of turn variable
  turn=data.symbol!==symbol;
  if(!gameOver()){
    if(gameTied()){
       $messages.innerText='Game Draw!';
       makeDisbled();
    }else{
      renderMessage();
    }
  }else{
   if(turn){
     $messages.innerText='Game over you lose.';
   }else{
     $messages.innerText='Cheers! you won';
   }
   makeDisbled();
  }
})
a0.addEventListener("click", makeMove);
a1.addEventListener("click", makeMove);
a2.addEventListener("click", makeMove);
b0.addEventListener("click", makeMove);
b1.addEventListener("click", makeMove);
b2.addEventListener("click", makeMove);
c0.addEventListener("click", makeMove);
c1.addEventListener("click", makeMove);
c2.addEventListener("click", makeMove);
