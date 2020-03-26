var chrono_data = JSON.parse(chrono);


// HTML VARIABLES
var info_box = document.getElementById("infobox"); // main information box
var info_sub = document.getElementById("subtitles"); // subtitles is plain info list of data
var info_name = document.getElementById("infoname"),
    info_text = document.getElementById("text1"),
    info_s = document.getElementById("S"), // individual subtitles
    info_l = document.getElementById("L"),
    info_a = document.getElementById("A"),
    info_k = document.getElementById("K"),
    info_je = document.getElementById("JE"),
    info_jf = document.getElementById("JF");

var info_abb = document.getElementById("abb"),
    info_gru = document.getElementById("gru");

var canvas = d3.select("#network"); // D3 activated canvas = SVG
var infoItems = document.getElementById("infobox").rows.item(0).cells;

// Derived VARIABLES
var width = canvas.attr("width");
var height = canvas.attr("height");
var ctx = canvas.node().getContext("2d"); // 2D Context
var table_length = chrono_data.items.length; // number of all items
var attributes = getAttributes(); // number of attributes of each item

// Constants
var images_path = "../../Data/Images";
var text_path = "../../Data/Beschreibungstexte";
var r = 20;
var center_force = 180;
var collisionFactor = 1.2;
var color = d3.scaleOrdinal(d3.schemeCategory10);
// Variables
var testcolor = '#86d1b7';
var drag_node, click_node, click_content;
var link_container = []; // init from html
var click_links = []; // init from html
var drawImages = true, drawNames = true;
var S = false, // booleans for all Linked Attributes
    L = false,
    A = false,
    K = false,
    JE = false,
    JF = false;


//// DATA PREPARATION
var itemWidth = width / infoItems.length; // calculating width space for table
for (i = 0; i < infoItems.length; i++) {
    infoItems[i].width = itemWidth;
}
var nodeImages; // Container for all "Ansicht" image data
nodeImages = defineImages(table_length, images_path);
// assigning each node a radius value
resetRadiuses();
////


// Simulation
var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2)) // forces for x and y center
    .force("collide", d3.forceCollide(r * collisionFactor)) // no collision/overlap
    .force("charge", d3.forceManyBody()// forces between nodes
        .strength(-center_force))   
    .force("forceY", d3.forceY() // force for horizontal gravity to center
        .strength(0.1)
        .y(height * 0.5))
    .force("link", d3.forceLink()
        .id(function (d) { return d.Nummer; }));

simulation
    .nodes(chrono_data.items)
    .on("tick", update)
    .force("link")


// Canvas
var tooltips = document.querySelectorAll('.tooltip span');

window.onmousemove = function (e) {
    var x = (e.clientX + 20) + 'px',
        y = (e.clientY + 20) + 'px';
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].style.top = y;
        tooltips[i].style.left = x;
    }
};
canvas // = SVG
    .call(d3.drag()
        .container(canvas.node())
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
    .on("click",clicked);



// UPDATE
function update() {
    ctx.clearRect(0, 0, width, height);

    // Style
    info_box.style.backgroundColor = testcolor;


    // draw ALL links in container
    for (c = 0; c < link_container.length; c++) {
        for (i = 0; i < link_container[c].length; i++) {
            drawLink(link_container[c][i]);
        }
    }


    // draw ALL nodes as such or image
    var c; //click node int
    for (i = 0; i < table_length; i++)
    {
        if (chrono_data.items[i] == click_node) { c = i; }  // skip clicknode
        else //Draw nodes
        {
            if (click_links.includes(chrono_data.items[i].Nummer))
                drawHighlight(chrono_data.items[i], 'orange'); // highlight selected nodes

            if (drawImages)
                drawNodeImageRound(chrono_data.items[i], i);//DRAWING IMAGE NODES
            else 
                drawNode(chrono_data.items[i], testcolor);//DRAWING NODES     
        }
    }

    // draw click node last
    if (click_node != null) {
        drawHighlight(click_node, 'black');
        if (click_node)
            drawNodeImageRound(click_node, c);//DRAWING IMAGE NODES
        else
            drawNode(click_node, testcolor);
    }

    // draw ALL names
    if (drawNames) {
        for ( i = 0; i < table_length; i++) {
            drawName(chrono_data.items[i]);
        }
    }


}

// Value update INFOBOX UPDATE MAIN ACTIONS

function clicked() {
    // consists of animations, transitions
    resetRadiuses();
    resetClickLinks();
    // Click node Action and Info
    // only if it is defined
    click_node = drag_node;
    if (click_node != null) {
        click_node.r = 1.5 * r;
        loadInfo();
    }
    update();
}


function loadLinks() {
    // update links
    // called from HTML! when links are pressed

    //update link container
    link_container = [];
    var all_links = []; // holds all active links in one array

    if (S) link_container.push(chrono_data.links.Standort);
    if (L) link_container.push(chrono_data.links.Land);
    if (A) link_container.push(chrono_data.links.A1Nachname);
    if (K) link_container.push(chrono_data.links.K1);
    if (JE) link_container.push(chrono_data.links.JahrEntwurf);
    if (JF) link_container.push(chrono_data.links.JahrFertigstellung);

    // force all contained links
    // unless there are non then reset
    for (var i = 0; i < link_container.length; i++) {
        all_links = all_links.concat(link_container[i]); //merging active links together
    }
    simulation
        .force("link")
        .links(all_links);

    if (link_container.length < 1) {
        simulation
            .force("link")
            .links(0);
    }

    impulse(0.3);
}

function loadSearchNodes(content) {
    resetClickLinks();
    click_links = searchAllItems(content);
    update();
}

function loadHighlightLinks(obj, category) {
    // update highlight links / nodes
    // called from HTML!
    // reads the content of given object in html
    click_content = obj;
    if (click_links.length < 1) {
        obj.style.color = "red";
        click_links = searchItems(obj.innerHTML, category);
    }
    else {
        resetClickLinks();
    }
    update();
  
}

function loadInfo() {
    // UPDATE Info box

    // TEXT
    loadInner(info_name,click_node.Nummer+ " "+ click_node.Bezeichnung);

    loadInner(info_s, click_node.Standort);
    loadInner(info_l,click_node.Land);
    loadInner(info_a,click_node.A1Nachname);
    loadInner(info_k,click_node.K1);
    loadInner(info_je,click_node.JahrEntwurf);
    loadInner(info_jf,click_node.JahrFertigstellung);

    if (click_node.Erlaeuterungstext.length < 2) { info_text.innerHTML = "n/a"; }
    else info_text.innerHTML = readTxt(text_path + "/" + click_node.Erlaeuterungstext + ".txt");

    // IMAGES
    var src;
    if (click_node.Ansicht.length < 2) src = images_path + "/blue.jpg";// not defined
    else src = images_path + "/Abbildungen/" + click_node.Ansicht + ".jpg";
    info_abb.src = src;

    if (click_node.Grundriss.length < 2) src = images_path + "/blue.jpg";
    else src = images_path + "/Abbildungen/" + click_node.Grundriss + ".jpg";
    info_gru.src = src;
}
