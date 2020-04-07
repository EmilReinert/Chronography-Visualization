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
var timeline = document.getElementById("timeline");
var infoItems = document.getElementById("infobox").rows.item(0).cells;

// Derived VARIABLES
var width = canvas.attr("width");
var height = canvas.attr("height");
var ctx = canvas.node().getContext("2d"); // 2D Context
var ctime = timeline.getContext("2d"); // 2D context of timeline
var table_length = chrono_data.items.length; // number of all items
var attributes = getAttributes(); // number of attributes of each item

// Constants
var images_path = "../../Data/Images";
var text_path = "../../Data/Beschreibungstexte";
var testcolor = '#86d1b7';
var highlightcolor = 'black';
var r = 20;
var center_force = 180;
var collisionFactor = 1.2;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var testImage = makeImage("../../Data/Images/blue.jpg", 100, 100, "na");
var mapImage = makeImage("../../Data/Images/map.png", 1200,600, "map");
var positions = { "upleft": { "x": 300, "y": 150 }, "upright": { "x": 900, "y": 150 }, "lowleft": { "x": 300, "y": 450 }, "lowright": { "x": 900, "y": 450 } }; // testpositions

var map = {
    "Australien": { "x": 1003, "y": 471  },
    "Dänemark": { "x": 592, "y": 178 },
    "Belgien": { "x": 573, "y": 195},
    "Deutschland": { "x": 588, "y": 206},
    "Finnland": { "x": 647, "y": 134  },
    "Frankreich": { "x": 570, "y": 213 },
    "Griechenland": { "x": 629, "y": 246 },
    "Italien": { "x": 603, "y": 240},
    "Japan": { "x": 1028, "y": 251 },
    "Kanada": { "x": 225, "y": 161},
    "Mexiko": { "x": 224, "y": 306},
    "Niederlande": { "x": 576, "y": 191 },
    "Österreich": { "x": 609, "y": 219},
    "Pakistan": { "x": 791, "y": 289},
    "Polen": { "x": 630, "y": 197 },
    "Russland": { "x": 759, "y": 137 },
    "Schweden": { "x": 610, "y": 143 },
    "Schweiz": { "x": 577, "y": 222 },
    "Sowjetunion": { "x": 658, "y": 172 },
    "Spanien": { "x": 548, "y": 242 },
    "Uruguay": { "x": 374, "y": 497  },
    "Vereinigte Staaten": { "x": 231, "y": 214 },
    "Vereinigtes Königreich": { "x": 548, "y": 180 },
    "Volksrepublik China": { "x": 907, "y": 262 }
};
//for timeline
var h = timeline.height;
var w = timeline.width;
var offset = 20; // offset on both ends
var start = 1750;
var end = 2020;
var step = (w - 2 * offset) * 10 / (end - start); // 10 years steps


// Variables
var mode = "map";
var forcing = true;
var hover_node, drag_node, click_node; var click_content; // content html of click node to reset
var link_container = []; // init from html
var search_nodes = []; // init from html
var search_links = [];
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

canvas // = SVG
    .call(d3.drag()
        .container(canvas.node())
        .subject(dragsubject)
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
    .on("click", clicked)
    .on('mousemove', function () { // HOVER!!!
        //hovered();
    }); 

changeMode("map");

function changeMode(m) {
    //called once when changing modes
    previous = mode;
    mode = m;
    timeline.style.display = "none";
    document.getElementById("network").height = height =600;

    if (mode == "network") {
        if (previous == "map")
            impulse(0.2);
        else
            impulse(1);
        forcing = true;
        simulation
            .force("collide", d3.forceCollide(r * collisionFactor))
            .force("charge", d3.forceManyBody()// forces between nodes
                .strength(-center_force));
    }
    if (mode == "map") {
        simulation.stop();
        simulation
            .force("collide", d3.forceCollide(0))
            .force("charge", d3.forceManyBody()// forces between nodes
                .strength(0));
        forcing = false;
        initMap(); // called once!
        setTimeout(function () { update(); }, 100);
    }
    if (mode == "time") {
        simulation.stop();
        simulation
            .force("collide", d3.forceCollide(0))
            .force("charge", d3.forceManyBody()// forces between nodes
                .strength(0));
        forcing = false;
        initTime();
    }
    update();
}


function initMap() {
    // draw ALL nodes as such or image
    var pos = {};
    for (i = 0; i < table_length; i++) {
        if (map[chrono_data.items[i].Land] == undefined) pos.x = pos.y = 0;
        else pos = map[chrono_data.items[i].Land];
        chrono_data.items[i].x = pos.x;// + i * 0.1 * Math.random();
        chrono_data.items[i].y = pos.y - 1.7 * r;//+ i * 0.1 * Math.random();
    }

}

function initTime() {
    // initializing time mode
    document.getElementById("network").height = 300; height = 300;
    timeline.style.display = "block";
    drawTimeLine(ctime);
    // todo node behaviours also in "changeMode"
    var pos; //year position on ray
    for (i = 0; i < table_length; i++) {
        if (chrono_data.items[i].JahrFertigstellung == "") pos = 0;
        else 
            pos = offset + (step / 10) * (parseInt(chrono_data.items[i].JahrFertigstellung) - start);
        chrono_data.items[i].x = pos; //+  0.1 * Math.random();
        chrono_data.items[i].y = height - 1.7 * r;
        
    }

}


// UPDATE
function update() {
    // Style
    if (mode == "network") {
        ctx.clearRect(0, 0, width, height);
        updateView(drawHighlight, testcolor);
    }
    if (mode == "map") {
        ctx.drawImage(mapImage, 0, 0, width, height);
        updateView(drawPin,"grey");
    }
    if (mode == "time") {
        ctx.clearRect(0, 0, width, height);
        updateView(drawPin, "grey");
    }
}

function updateView(f, color) {
    // draw ALL nodes as such or image
    // draw ALL links in container
    for (i = 0; i < link_container.length; i++)
        drawLink(link_container[i]);

    for (i= 0; i < search_links.length; i++) {
        drawLink(search_links[i], highlightcolor);
    }


    for (i = 0; i < table_length; i++) {
        if (search_nodes.includes(chrono_data.items[i].Nummer))
            f(chrono_data.items[i], highlightcolor); // highlight selected nodes
        else
            f(chrono_data.items[i], color);
        drawNodeImageRound(chrono_data.items[i], i);//DRAWING IMAGE NODES
        
    }

    // draw hover node with side info
    if (hover_node != null) {
        drawSideName(hover_node, color);
        f(hover_node, color);
        drawNodeImageRound(hover_node, parseInt(hover_node.Nummer) - 1);
    }

    // draw click node last
    if (click_node != null) {
        drawHighlight(click_node, highlightcolor);
        drawNodeImageRound(click_node, parseInt(click_node.Nummer)-1);//DRAWING IMAGE NODES
    }
    loadInfo();
}


// Value update INFOBOX UPDATE MAIN ACTIONS

function clicked() {
    // consists of animations and transitions
    resetRadiuses();
    resetClickLinks();
    // Click node Action and Info
    // only if it is defined
    click_node = drag_node; // defining here
    if (click_node != null) {
        click_node.r = 1.5 * r;
    }
    loadInfo();
    update();
}

function hovered() {
    hover_node = simulation.find(d3.event.x, d3.event.y);
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
    link_container = all_links;
    simulation
        .force("link")
        .links(all_links);

    if (link_container.length < 1) {
        simulation
            .force("link")
            .links(0);
    }
    if (forcing)
        impulse(0.3);
    update();
}

function loadSearchNodes(content) {
    // called from html when looking for specific words
    resetClickLinks();
    search_nodes = searchAllItems(content);
    update();
}

function loadHighlightLinks(obj, category) {
    // update highlight links / nodes
    // called from HTML when pressing on item content
    // reads the content of given object in html
    click_content = obj;
    if (search_nodes.length < 1) {
        obj.style.color = "red";
        search_nodes = searchItems(obj.innerHTML, category);
        search_links = makeSearchLinks(search_nodes);
        simulation.force("link").links(search_links); simulation.force("link").links(link_container);// adding links but not forces
    }
    else {
        resetClickLinks();
    }
    update();
  
}

function loadInfo() {
    // UPDATE Info box
    if (click_node != null) {
        // Style
        info_box.style.display = "block";
        info_box.style.top = 150 + click_node.y + "px";
        //info_box.style.left = 80 + click_node.x + "px";


        // TEXT
        loadInner(info_name, click_node.Nummer + " " + click_node.Bezeichnung);

        loadInner(info_s, click_node.Standort);
        loadInner(info_l, click_node.Land);
        loadInner(info_a, click_node.A1Nachname);
        loadInner(info_k, click_node.K1);
        loadInner(info_je, click_node.JahrEntwurf);
        loadInner(info_jf, click_node.JahrFertigstellung);

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
    else
        info_box.style.display = "none";
}
