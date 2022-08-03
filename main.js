const cvs = document.getElementById('screen');
const counta = document.getElementById('counta');
const countb = document.getElementById('countb');
const hash = parseInt(location.hash.replace('#',''))
const s = (hash > 0 ? hash : 64)
cvs.width = cvs.height = s;
let speed = 20;
const ctx = cvs.getContext('2d');

const pixels = Array(s).fill().map(() => Array(s).fill(0));

for (let y = 0; y < s; y ++) {
    for (let x = 0; x < s; x ++) {
        if (y >= s / 2) {
            pixels[x][y] = 1;
        }
    };   
};

const a = [
    [-1,0],
    [ 1,0],
    [0,-1],
    [0, 1]
]

let t = 0;
let over = false;

// render
ctx.fillStyle = 'red';
let red_pixels = 0;
for (let y = 0; y < s; y ++) {
    for (let x = 0; x < s; x ++) {
        if (pixels[x][y] === 1) {
            red_pixels ++;
            ctx.fillRect(x, y, 1, 1);
        };
    };   
};

function tick() {
    if (over) {
        return;
    }
    t ++;

    // fight
    let things_changed = 0;
    let nothing_happened = 0;
    while (things_changed < speed && nothing_happened < 10000) {
        const rx = Math.floor(Math.random() * (s - 2)) + 1;
        const ry = Math.floor(Math.random() * (s - 2)) + 1;
    
        const victim = pixels[rx][ry];
        let surv_chance = 0;
        for (let i = 0; i < 4; i ++) {
            if (pixels[rx + a[i][0]][ry + a[i][1]] === victim) {
                surv_chance += 0.25;
            }
        }
        if (Math.random() > surv_chance) {
            pixels[rx][ry] = (victim === 1 ? 0 : 1);
            if (victim === 1) {
                ctx.clearRect(rx, ry, 1, 1);
                red_pixels --;
            } else {
                ctx.fillRect(rx, ry, 1, 1);
                red_pixels ++;
            }
        } else {
            const d = a[Math.floor(Math.random() * 4)];
            const ex = rx + d[0];
            const ey = ry + d[1]
            if (pixels[ex][ey] !== victim) {
                pixels[ex][ey] = victim;
                if (victim === 0) {
                    ctx.clearRect(ex, ey, 1, 1);
                    red_pixels --;
                } else {
                    ctx.fillRect(ex, ey, 1, 1);
                    red_pixels ++;
                }
                things_changed ++;
                nothing_happened = 0;
            } else {
                nothing_happened ++;
            }
        }
    }
    if (nothing_happened == 10000) {
        over = true;
    }

    const percentage = Math.round(red_pixels / (s * s) * 100);
    counta.innerText = percentage + '%';
    countb.innerText = 100 - percentage + '%';

    window.requestAnimationFrame(tick);
}
window.requestAnimationFrame(tick);