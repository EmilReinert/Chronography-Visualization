// DRAWING FUNCTIONS and ANIMATIONS

// general c = context
function drawCircle(c, x,y , color,radius = r ) {
    c.beginPath();
    c.fillStyle = color;
    c.globalAlpha = 1;
    c.moveTo(x, y);
    c.arc(x, y, radius, 0, 2 * Math.PI);
    c.fill();
}

function drawLine(c, x1, y1, x2, y2, color = "black", font ="normal") {
    c.globalAlpha = 1;
    c.beginPath();
    c.strokeStyle = color;
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.stroke();
    c.closePath();
}

function drawRect(c, x,y,w,h, color, alpha) {
    c.beginPath();
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.rect(x,y, w, h);
    c.fill();
    c.globalAlpha = 1;
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

function drawText(c,x,y,text,color ="black",fon = "normal", size = 10  ) {
    //name <- bezeichnung
    c.textAlign = "center";
    c.textBaseline = "middle"; // set relative text position
    c.fillStyle = color;
    c.font = fon+" "+size + 'px arial';
    c.fillText(text, x,y);
    c.textAlign = "start";
    c.textBaseline = "top"; // default relative text position
}

//////////// for canvas

function drawNode(d, color, radius =r) {
    //drawing iterated abbildung

    drawHighlight(d, color,radius);
    drawNodeImageRound(d,color, radius);

}

function drawPin(d, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    var e = r*1.1 * Math.sqrt(2) / 2; // distance of radius vector
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + e, d.y + e);
    ctx.lineTo(d.x, d.y + 2 * e);
    ctx.lineTo(d.x - e, d.y + e);
    ctx.fill();
    drawHighlight(d, color,alpha);
    drawNodeImageRound(d, color, alpha);
    ctx.globalAlpha = 1;
}

function drawHighlight(d, color,alpha=1, radius =r) {
    // draws circle with bigger radius 
    // if drawn before actual conent we have a cicular highlight
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, radius * 1.1, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1;
}


function drawSideName(d, color) {
    drawRect(d.x,d.y,40,40, color);
}

function drawImage(d, color = "", alpha = 1, height = r, width = rw) {
    ctx.globalAlpha = alpha;
    ctx.drawImage(nodeImages[parseInt(d.Nummer) - 1], d.x - width, d.y - height, 2 * width, 2 * height);
    ctx.globalAlpha = 1;
}

function drawNodeImageRound(d, color = "", alpha = 1, radius =r) {
    // draws circle image
    ctx.globalAlpha = alpha;
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
    ctx.globalAlpha = 1;
}

function drawLink(l, color = "#aaa") {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = color;
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
    ctx.stroke();
}


var yearstep = 10;
function drawTimeLine(c) {
    // draw timeline dependend on defined temporary start and end times
    radius = h / 8-1;
    c.clearRect(0, 0, w, h);
    c.fillStyle = testcolor;
    c.rect(offset,h/4,w-2*offset, radius*2);
    c.fill();

    //round edges and base line
    drawCircle(c, offset - radius / 2, h / 4+radius, testcolor, radius);

    drawCircle(c, w - offset + radius / 2, h / 4 + radius, testcolor, radius);
    drawLine(c, offset, h / 2, w - offset, h / 2, 'white');

    var firstyear = Math.round(temp_start);
    while (firstyear % yearstep != 0) { //uneven start
        firstyear++;
        if (firstyear > end) { alert("badfirst"); return }
    }

    var lastyear = Math.round(temp_end);
    while (lastyear % yearstep != 0) { //uneven start
        lastyear--;
        if (lastyear <start){ alert("bad"); return }
    }

    var num_steps = Math.round((lastyear - firstyear) / yearstep); // amount of steps defined by yearstep


    var steplength = (w - 2 * offset) / num_steps; // steplength defined by amount of steps
    steplength *= (lastyear - firstyear) / (temp_end - temp_start);
    // distance to first year = offset plus relative step size
    var position = offset + steplength * ((firstyear-temp_start)/yearstep); 

    var year = firstyear;
    for (var i = 0; i <= num_steps; i++) {
        if (year % 10 == 0) {
            drawRect(c, position - 1.5, h / 4, 3,radius*2, 'white');
            drawText(c, position, h / 2 + 20, year.toString(), testcolor, "bold",12);
        }
        else {
            drawLine(c, position, h / 2, position, radius*2, 'white');
            drawText(c, position, h / 2 + 20, year.toString(),testcolor);
        }
        position += steplength;
        year += yearstep;
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

function slideInfo(endpos = 160 + click_node.y) {
    // slide info box from current to clicknode position
    info_box.style.display = "block";
    /*
    if (click_node.y < 340)
        endpos = 160 + click_node.y;
    else
        endpos = -230 + click_node.y;
        */
    if (endpos < window.innerHeight * 0.65&&endpos >10)
        endpos = window.innerHeight * 0.65;

    var pos = parseInt(info_box.getBoundingClientRect().top, 10); // start position
    
    var fs = (endpos - pos) * 0.01; 
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
    var endpos = 2* height; 
    var fs = (endpos - pos) * 0.01;
    if (Math.abs(fs) < 0.01) {
        clearInterval(id);
        info_box.style.display = "none";
        return;
    }
    var id = setInterval(frame, 1);
    function frame() {
        if (pos >= endpos) {
            clearInterval(id);
            info_box.style.top = endpos+"px";
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

function turnArrow(direction) { //direction -1 oder 1
    sY = direction;
    var id = setInterval(frame, 10);
    function frame() {
        if (sY >= -1*direction) {
            document.getElementById("infoarrow").style.transform = "scaleY(" + -1 * direction +")";
            clearInterval(id);
        } else {
            document.getElementById("infoarrow").style.transform = "scaleY(" + sY + ")";
            sY -= 0.1*(direction);
        }
    }
}
