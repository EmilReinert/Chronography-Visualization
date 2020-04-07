// DRAWING FUNCTIONS and ANIMATIONS

// general c = context
function drawCircle(c, x,y , color ) {
    c.beginPath();
    c.fillStyle = color;
    c.globalAlpha = 1;
    c.moveTo(x, y);
    c.arc(x, y, r, 0, 2 * Math.PI);
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

function drawNode(d, color, radius =r) {
    //drawing iterated abbildung

    drawHighlight(d, color,radius);
    drawNodeImageRound(d,radius);

}

function drawPin(d, color) {
    var e = r*1.1 * Math.sqrt(2) / 2; // distance of radius vector
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + e, d.y + e);
    ctx.lineTo(d.x, d.y + 2 * e);
    ctx.lineTo(d.x - e, d.y + e);
    ctx.fill();
    drawHighlight(d, color);
    drawNodeImageRound(d);
}

function drawHighlight(d, color, radius =r) {
    // draws circle with bigger radius 
    // if drawn before actual conent we have a cicular highlight
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 1;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, radius * 1.1, 0, 2 * Math.PI);
    ctx.fill();
}


function drawSideName(d, color) {
    drawRect(d, color);
}



function drawNodeImageRound(d, radius =r,) {
    // draws circle image

    ctx.save();
    ctx.beginPath();
    ctx.arc(d.x, d.y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(nodeImages[parseInt(d.Nummer) - 1], d.x - radius, d.y - radius, 2 * radius, 2 * radius);

    ctx.beginPath();
    ctx.arc(d.x, d.y, radius, 0, Math.PI * 2, true);
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

// simple text for linear moving animatino to lower right
function myMove() {
    var elem = document.getElementById("title");
    var pos = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (pos == 350) {
            clearInterval(id);
        } else {
            pos++;
            elem.style.top = pos + 'px';
            elem.style.left = pos + 'px';
        }
    }
}

function openInfo() {
    info_box.style.transform = "scaleY(0)";
    var sY = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (sY >=1) {
            clearInterval(id);
        } else {
            info_box.style.transform = "scaleY(" + sY + ")";
            sY += 0.1;
        }
    }
}

function slideInfo() {
    // slide info box from current to clicknode position
    info_box.style.display = "block";
    if (click_node.y < 300)
        endpos = 180 + click_node.y;
    else
        endpos = -200 + click_node.y;
    var pos = parseInt(info_box.getBoundingClientRect().top, 10); // start position

    if (mode == "time")
        endpos = 450;
    var fs = (endpos - pos) * 0.05; console.log(fs);
    if (Math.abs(fs) < 1) {
        clearInterval(id);
        info_box.style.top = endpos + "px";
        return;
    }
    var id = setInterval(frame, 1);
    function frame() {
        if ((Math.sign(fs) == 1 && pos >= endpos) || (Math.sign(fs) == -1 && pos <= endpos)) {
            clearInterval(id);
            info_box.style.top = endpos+"px";
        } else {
            info_box.style.top = pos+"px";
            pos = pos+fs;
        }
    }
}

function slideOutInfo() {
    var pos = parseInt(info_box.getBoundingClientRect().top, 10);// start position
    var endpos = 2 * height; 
    var fs = (endpos - pos) * 0.05;
    if (Math.abs(fs) < 1) {
        clearInterval(id);
        info_box.style.display = "none";
        return;
    }
    var id = setInterval(frame, 1);
    function frame() {
        if (pos >= endpos) {
            clearInterval(id);
            info_box.style.display = "none";
        } else {
            info_box.style.top = pos + "px";
            pos = pos+fs;
        }
    }
}

function nodePop(d) {
    if (click_node == null) { // unclick animation
        update(); return;
    }
    //click animation
    // radius from 1 to 1.5
    var radius = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (radius >= 1.5) {
            clearInterval(id);
            drawNode(d, highlightcolor, 1.5 * r);
            update();
        } else {
            drawNode(d, highlightcolor, r * radius);
            radius += 0.1;
        }
    }
}

function zoomMap() {
    var zoom = 1;
    x = getMouseCanvasPos().x;
    y = getMouseCanvasPos().y;
    var id = setInterval(frame, 10);
    function frame() {
        if (zoom >= 1.05) {
            clearInterval(id);
            console.log("zoomed");
            loadMapNodes();
            changeMode("network");
            r = 30;
            simulation
                .force("collide", d3.forceCollide(r * collisionFactor))
        } else {
            ctx.translate(-x * 0.05, -y * 0.05);
            ctx.scale(1.05, 1.05);
            zoom += 0.001;
            r = r-0.15*zoom;
            update();
            drawCircle(ctx, x, y, "red");
        }
    }


}