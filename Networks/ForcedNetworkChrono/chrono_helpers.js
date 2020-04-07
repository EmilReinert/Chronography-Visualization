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

function impulse(strength) {
    // sends force impulse to simulation
    simulation.alpha(strength).restart();
}

function resetSimulation() {

}

function resetRadiuses() {
    // gives all items a radius element or set it to r
    // r -> initial defined radius 
    for (i = 0; i < table_length; i++) {
        chrono_data.items[i]["r"] = r;
    }
}

function resetClickLinks() {
    if (click_content != null) click_content.style.color = 'black';
    simulation.force("link").links(link_container);
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
    for ( i = 0; i < table_length; i++) {
        if (chrono_data.items[i][category] == undefined) {
            alert("category dont exist");
        }
        // look if substring content is contained
        // alert("does "+ chrono_data.items[i][category] + " include " + content);
        if (included(chrono_data.items[i][category],content)) {
            numbers.push(chrono_data.items[i].Nummer);
        }
    }
    return numbers;
}

function searchAllItems(content) {
    // iteraties over all categories 
    // and returns 'Nummer' of element
    num = [];
    for (i = 0; i < table_length; i++) {
        for (c = 0; c < attributes.length; c++) {
            if (chrono_data.items[i][attributes[c]] == undefined) {
                alert("category dont exist");
            }
            // look if substring content is contained
            // alert("does "+ chrono_data.items[i][category] + " include " + content);
            if (included(chrono_data.items[i][attributes[c]],content)) {
                num.push(chrono_data.items[i].Nummer);
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
    c.x = d3.mouse(document.getElementById("network"))[0];
    c.y = d3.mouse(document.getElementById("network"))[1];
    return c;

}

//  Math
function getDistance(a, b) {
    //determines distance between two points with x and y value
    return Math.sqrt(Math.pow(b.x - a.x,2) + Math.pow(b.y - a.y,2));
}

// DRAG EVENTS
draggable = true;
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
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    if (!draggable) return;
    if (d3.event.active)
        if (forcing)
            simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x = d3.event.x;
    d3.event.subject.fy = d3.event.subject.y = d3.event.y;
    update();
}

function dragended() {
    if (!draggable) return;
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
        d3.event.subject.fy = null;
    
}

