// HELPERS 

//custom

function getAttributes() {
    // iterates over content of first item node to extract attribute class names
    attr = [];
    for (i = 0; i < Object.keys(chrono_data.items[0]).length; i++) {
       attr.push(Object.keys(chrono_data.items[0])[i]);
    }
    return attr;
}

function defineImages(amount, path) {
    //Ansicht data defined in document
    if (amount > table_length) {
        alert("You can't create more images than sources you have");
        return;
    }

    var images = [];
    var src, alt;
    for (var i = 0; i < amount; i++) {
        if (chrono_data.items[i].Ansicht.length < 2) {// not defined
            images.push(testImage);
        }
        else {
            alt = chrono_data.items[i].Ansicht;
            src = path + "/Abbildungen/" + alt + ".jpg";0
            images.push(makeImage(src, 100, 100, alt));
        }
        //alert(name);
    }
    return images;
}

function  updateNodes(new_nodes) {
    simulation
        .nodes(new_nodes);
    active_items = new_nodes;
}

function impulse(strength) {
    // sends force impulse to simulation
    simulation.alpha(strength).restart();
}


function resetClickLinks() {
    if (click_content != null) click_content.style.color = 'black';
    simulation.force("link").links(active_links);
    search_nodes = [];
    search_links = [];
}


// search functions

function included(a, b) {
    // returns if b is concluded in a
    // IGNORING UPPER AND LOWER CASE
    if (a.toUpperCase().includes(b.toUpperCase()))
        return true;
    else
        return false;
}

function searchItems(content, category) {
    // searches all given items for specific content of given category
    // and returns 'Number' array of matching items
    numbers = [];
    for (j = 0; j < active_items.length; j++) {
        if (active_items[j][category] == undefined) {
            alert("category dont exist");
        }
        // look if substring content is contained
        // alert("does "+ chrono_data.items[i][category] + " include " + content);
        if (included(active_items[j][category],content)) {
            numbers.push(active_items[j].Nummer);
        }
    }
    return numbers;
}

function searchAllItems(content) {
    // iteraties over all categories 
    // and returns 'Nummer' of element
    num = [];
    for (i = 0; i < active_items.length; i++) {
        for (c = 0; c < attributes.length; c++) {
            if (active_items[i][attributes[c]] == undefined) {
                alert("category dont exist");
            }
            // look if substring content is contained
            // alert("does "+ chrono_data.items[i][category] + " include " + content);
            if (included(active_items[i][attributes[c]],content)) {
                num.push(active_items[i].Nummer);
            }
        }
    }
    return num;
}

function makeSearchLinks(numbers) { // not in use
    // searches all given data for same content and returns as links
    links = [];
    // makes links out of all numbers with same content 
    for (i = 0; i < numbers.length; i++) {
        links.push(makeLink(click_node.Nummer, numbers[i]));
    }
    return links;
}


// GENERAL

function readTxt(path) {
    // reads txt file content from given file path
    var text = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", path, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                text += allText;
            }
        }
    }
    rawFile.send(null);
    return text;
}

function makeImage(src, w, h, alt) {
    // creates html img attribute
    var x = document.createElement("IMG");
    x.setAttribute("src", src);
    x.setAttribute("width", w);
    x.setAttribute("height", h);
    x.setAttribute("alt", alt);
    return x;
}


function loadInner(o, i) {
    // assigns specific inner html text i to object o
    if (i.length > 1) {
        o.innerHTML = i;
    }
    else o.innerHTML = "n/a";
}

function makeLink(t, s) {
    link = {
        "target": t,
        "source": s
    };
    return link;
}

function getMouseCanvasPos() {
    // returns position of mouse relative in canvas
    c = [];
    c.x = d3.mouse(network)[0];
    c.y = d3.mouse(network)[1];
    return c;

}

//  Math
function getDistance(a, b) {
    //determines distance between two points with x and y value
    return Math.sqrt(Math.pow(b.x - a.x,2) + Math.pow(b.y - a.y,2));
}

// DRAG EVENTS
draggable = true; // objects can be dragged but only when mouse clicked onto it
function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
}

function dragstarted() {
    //alert('"x":'+Math.floor(getMouseCanvasPos().x) + ',"y":' + Math.floor(getMouseCanvasPos().y)); // for position extraction in dev phase
    // Select clicked node
    if (getDistance(d3.event.subject, getMouseCanvasPos()) > r*1.2){
        draggable = false; drag_node = null;
        return;
    }
    else {
        draggable = true;
    }
    if (click_node == d3.event.subject) { drag_node = null; } //unselect click node when double click
    else { drag_node = d3.event.subject; }//select
    if (!drag) return;
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    if (!drag) return;
    if (!draggable) return;
    if (d3.event.active)
        if (forcing)
            simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x = d3.event.x;
    d3.event.subject.fy = d3.event.subject.y = d3.event.y;
    update();
}

function dragended() {
    if (!drag) return;
    if (!draggable) return;
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    
}


/// ZOOM

function zoomTime(direction) {
    //zoom in
    x = getMouseCanvasPos().x;
    y = getMouseCanvasPos().y;
    var span = temp_end - temp_start; 
    var zoom_strength = span /3;

    var relativeX = (x - offset) / (w - 2 * offset); //relative mouse value on timeline

    if (relativeX < 0) relativeX = 0;
    if (relativeX > 1) relativeX = 1;


    zoomyear = Math.round(temp_start + relativeX * span);
    end_holder = temp_end;
    start_holder = temp_start;
    if (direction == "down") { // zoom in
        temp_end -= (1-relativeX) * zoom_strength;
        temp_start += relativeX * zoom_strength;
    }
    //zoom out
    else {
        temp_end += (1 - relativeX) * 2*zoom_strength;
        temp_start -= relativeX * 2*zoom_strength;
    }


    span = temp_end - temp_start;
    if (span <= 0.5 * (end - start)) {
        yearstep = 5;
        if (span <= 0.2 * (end - start))
            yearstep = 2;
        if (span <= 0.1 * (end - start))
            yearstep = 1;
    }
    else yearstep = 10;
    if (span <= 0.05 * (end - start)) {
        temp_end = end_holder;
        temp_start = start_holder;
    }
    initTimeline();
}


// Zoom Actions

function zoomMap() {
    var zoom = 1;
    x = getMouseCanvasPos().x;
    y = getMouseCanvasPos().y;
    var id = setInterval(frame, 10);
    function frame() {
        if (zoom >= 1.05) {
            clearInterval(id);
            loadMapNodes();
            changeMode("network");
            r = 30;
            simulation
                .force("collide", d3.forceCollide(r * collisionFactor))
        } else {
            ctx.translate(-x * 0.05, -y * 0.05);
            ctx.scale(1.05, 1.05);
            zoom += 0.001;
            r = r - 0.15 * zoom;
            update();
        }
    }
}
function unZoomMap() {
    var zoom = 1.05;
    changeMode("map");
    x = 600;
    y = 200;
    ctx.translate(-x * 2.5, -y * 2.5);
    ctx.scale(30, 30);
    var id = setInterval(frame, 10);
    function frame() {
        if (zoom <= 1) {
            clearInterval(id);
            changeMode("map");
        } else {
            ctx.scale(0.95, 0.95);
            ctx.translate(x * 0.05, y * 0.05);
            zoom -= 0.001;
            r = r - 0.15 * zoom;
            update();
        }
    }
}