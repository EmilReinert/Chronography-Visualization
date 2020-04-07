// DRAWING FUNCTIONS and ANIMATIONS

// general c = context
function drawCircle(c, d, color ) {
    c.beginPath();
    c.fillStyle = color;
    c.globalAlpha = 1;
    c.moveTo(d.x, d.y);
    c.arc(d.x, d.y, r, 0, 2 * Math.PI);
    c.fill();
}

function drawLine(c, x1, y1, x2, y2, color="black") {
    c.beginPath();
    c.strokeStyle = color;
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.stroke();
    c.closePath();
}

function drawRect(c, d, color) {
    c.beginPath();
    c.fillStyle = color;
    c.rect(d.x,d.y, 40, 40);
    c.fill();
}
function drawCoords(c, d) {
    //coords
    c.textAlign = "center"; ctx.textBaseline = "middle"; // set relative text position
    c.fillStyle = 'white';
    c.fillText(Math.floor(d.x) + ", " + Math.floor(d.y), d.x, d.y);
    c.textAlign = "start"; ctx.textBaseline = "top"; // default relative text position
}
function drawName(c, d) {
    //name <- bezeichnung
    c.textAlign = "center";
    c.textBaseline = "middle"; // set relative text position
    c.fillStyle = 'black';
    c.fillText(d.Bezeichnung, d.x, d.y);
    c.textAlign = "start";
    c.textBaseline = "top"; // default relative text position
}

function drawText(c,x,y,text) {
    //name <- bezeichnung
    c.textAlign = "center";
    c.textBaseline = "middle"; // set relative text position
    c.fillStyle = 'black';
    c.fillText(text, x,y);
    c.textAlign = "start";
    c.textBaseline = "top"; // default relative text position
}

//////////// for canvas

function drawNodeImage(d, i) {
    //drawing iterated abbildung

    ctx.drawImage(nodeImages[i], d.x - r * 2, d.y - r * 2, 4 * r, 4 * r);

    ctx.moveTo(d.x, d.y);
}

function drawPin(d, color, x = d.x, y = d.y) {
    var e = r*1.1 * Math.sqrt(2) / 2; // distance of radius vector
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x, y);
    ctx.lineTo(x + e, y + e);
    ctx.lineTo(x, y + 2 * e);
    ctx.lineTo(x - e, y + e);
    ctx.fill();
    drawHighlight(d, color);
}

function drawHighlight(d, color, x= d.x, y = d.y) {
    // draws circle with bigger radius 
    // if drawn before actual conent we have a cicular highlight
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    ctx.moveTo(x, y);
    ctx.arc(x, y, d.r * 1.1, 0, 2 * Math.PI);
    ctx.fill();
}


function drawSideName(d, color) {
    drawRect(d, color);
}



function drawNodeImageRound(d, i,x=d.x,y=d.y) {
    // draws circle image

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, d.r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(nodeImages[i], x - d.r, y - d.r, 2 * d.r, 2 * d.r);

    ctx.beginPath();
    ctx.arc(x, y, d.r, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
}

function drawLink(l, color = "#aaa") {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
    ctx.stroke();
}

function drawTimeLine(c) {
    //  1750 to 2020
    
    c.fillStyle = testcolor;
    c.rect(offset,h/4,w-2*offset, h/4);
    c.fill();
    
    drawLine(c, offset, h / 2, w - offset, h / 2)

    year = start;
    for (s = offset; s <= w; s += step) {
        drawLine(c, s, h / 2, s, 0);
        drawText(c, s, h / 2 + 20, year.toString());
        year += 10;
    }
}

//// Animations 

