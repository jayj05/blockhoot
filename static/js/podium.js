var socketio = io() 

socketio.emit("podiumData"); 

socketio.on("renderPodium", function (data){
    console.log("rendering podium"); 
    document.querySelector("h2").style = "color: white;"
    const winnerDisplay = document.getElementById("winner"); 
    const podium = document.getElementById("podium");

    const winnerName = data[0]['name']; 
    const winnerScore = data[0]['score']; 
    const winnerDiv = document.createElement("div"); 
    winnerDiv.style = "color: white; font-size: 36pt;";
    winnerDiv.innerHTML = winnerName + " WINS!"
    winnerDisplay.appendChild(winnerDiv); 
}); 

document.getElementById("homeButton").onclick = () =>{
    socketio.emit("refreshPage"); 
}

socketio.on("goHome", function(){
    window.location.href = "/"; 
})