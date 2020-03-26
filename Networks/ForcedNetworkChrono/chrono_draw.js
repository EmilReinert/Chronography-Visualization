// DRAWING FUNCTIONS and ANIMATIONS


function drawCircle(d) {
    ctx.beginPath();
    ctx.fillStyle = color(d.color);
    ctx.globalAlpha = 1;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawHighlight(d, c) {
    // draws circle with bigger radius 
    // if drawn before actual conent we have a cicular highlight
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.globalAlpha = 1;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, d.r * 1.1, 0, 2 * Math.PI);
    ctx.fill();
}

function drawNode(d, c) {
    // draws circle with label inside
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.globalAlpha = 1;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawName(d) {
    //text
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; // set relative text position
    ctx.fillStyle = 'black';
    ctx.fillText(d.Bezeichnung, d.x, d.y);
    ctx.textAlign = "start"; ctx.textBaseline = "top"; // default relative text position
}

function drawNodeImageRound(d, i) {
    // draws circle with label inside
    //drawHighlight(d, 'blue');
    if (nodeImages[i] == null || nodeImages[i].alt == "na") {
        drawNode(d, testcolor);
        return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(nodeImages[i], d.x - d.r, d.y - d.r, 2 * d.r, 2 * d.r);

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
}

function drawNodeImage(d, i) {
    //drawing iterated abbildung

    ctx.drawImage(nodeImages[i], d.x - r * 2, d.y - r * 2, 4 * r, 4 * r);

    ctx.moveTo(d.x, d.y);
}

function drawLink(l, color = "#aaa") {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
    ctx.stroke();
}



//// Animations 

