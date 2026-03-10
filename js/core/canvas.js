const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resize() {

    const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;

    canvas.width = vw;
    canvas.height = vh;

}

resize();

window.addEventListener("resize", resize);

if (!canvas) {
    throw new Error("Canvas element #gameCanvas not found");
}