    const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

document.body.appendChild(canvas)

canvas.style.position = "fixed"
canvas.style.top = 0
canvas.style.left = 0
canvas.style.zIndex = "-1"
canvas.style.pointerEvents = "none"

canvas.width = window.innerWidth
canvas.height = window.innerHeight

let mouse = {x:0,y:0}

document.addEventListener("mousemove", e=>{
    mouse.x = e.clientX
    mouse.y = e.clientY
})

let stars = []

for(let i=0;i<150;i++){
    stars.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*3 + 1,
        speed: Math.random()*0.3 + 0.1,
        twinkle: Math.random()*0.05
    })
}

function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height)

    stars.forEach(s=>{

        // движение
        s.y += s.speed
        s.x += Math.sin(s.y*0.02)*0.3

        // если вышла за экран
        if(s.y > canvas.height){
            s.y = 0
            s.x = Math.random()*canvas.width
        }

        // реакция на мышку
        let dx = s.x - mouse.x
        let dy = s.y - mouse.y
        let dist = Math.sqrt(dx*dx + dy*dy)

        if(dist < 120){
            s.x += dx * 0.02
            s.y += dy * 0.02
        }

        // мерцание
        let glow = Math.sin(Date.now()*s.twinkle) * 0.5

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r + glow, 0, Math.PI*2)

        ctx.shadowColor = "red"
        ctx.shadowBlur = 10

        ctx.fillStyle = "rgba(255,60,60,0.8)"
        ctx.fill()

    })

    requestAnimationFrame(draw)
}

draw()