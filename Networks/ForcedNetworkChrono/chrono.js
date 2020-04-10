var chrono_data = JSON.parse(chrono);
var active_items = chrono_data.items;


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

var network = document.getElementById("network"); //HTML canvas
var timeline = document.getElementById("timeline");
network.width = window.innerWidth;//*0.9;
network.height = window.innerHeight;
timeline.width = window.innerWidth;
var canvas = d3.select("#network"); // D3 activated canvas = SVG
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
var r = 20, rw = 2;
var center_force = 180;
var collisionFactor = 1.2;
var color = d3.scaleOrdinal(d3.schemeCategory10);
var testImage = makeImage("../../Data/Images/blue.jpg", 100, 100, "na");
var mapImage = makeImage("../../Data/Images/map.svg", 1200,600, "map");
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
var timesteps = []; // holder for dates and steps of timeline
var h = timeline.height;
var w = timeline.width;
var offset = 50; // offset on both ends
var start = temp_start = 1750;
var end = temp_end = 2020.4;


// Variables
var mode = "map";
var forcing = true; drag = true;
var hover_node, drag_node, click_node; var click_content; // content html of click node to reset
var active_links = []; // init from html
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
    .nodes(active_items)
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
        hovered();
    })
    .on("wheel", function (d) {
        var direction = d3.event.deltaY < 0 ? 'down' : 'up'; //down = zoomin
        scroll(direction);
    });

changeMode("time");
setTimeout(function () { update(); }, 1000);

function changeMode(m) {
    //called once when changing modes
    previous = mode;
    mode = m;
    timeline.style.display = "none";
    document.getElementById("network").height = height = window.innerHeight*0.93;

    if (mode == "network") {
        forcing = true;
        r = 20;
        if (previous == "map")
            impulse(0.2);
        else
            impulse(1);
        simulation
            .force("collide", d3.forceCollide(r * collisionFactor))
            .force("charge", d3.forceManyBody()// forces between nodes
                .strength(-center_force));
    }
    if (mode == "map") {
        drag = true;
        zoom = false;
        forcing = false;
        updateNodes(chrono_data.items);
        r = 10;
        simulation.stop();
        simulation
            .force("collide", d3.forceCollide(0))
            .force("charge", d3.forceManyBody()// forces between nodes
                .strength(0));
        initMap(); // called once!
    }
    if (mode == "time") {
        //drag = false;
        forcing = false;
        updateNodes(chrono_data.items);
        r = 20;
        simulation.stop();
        simulation
            .force("collide", d3.forceCollide(0))
            .force("charge", d3.forceManyBody()// forces between nodes
                .strength(0));
        initTimeline();
    }
    update();
    loadInfo();
}


function initMap() {
    // draw ALL nodes as such or image
    var pos = {};
    for (i = 0; i < table_length; i++) {
        if (map[chrono_data.items[i].Land] == undefined) pos.x = pos.y = 0;
        else pos = map[chrono_data.items[i].Land];
        chrono_data.items[i].x = width*0.00083*pos.x + i * 0.1 * Math.random();
        chrono_data.items[i].y = height * 0.00168*pos.y - 1.7 * r+ i * 0.1 * Math.random();
    }

}

function initTimeline() {
    // initializing time mode
    timeline.style.display = "block";

    drawTimeLine(ctime);
    // todo node behaviours also in "changeMode"
    var sameNodes = [];

    if (temp_end > end) temp_end = end;
    if (temp_start < start) temp_start = start;
    
    var span = temp_end - temp_start; //total time span in given timeline
    rw = 500 / span;
    if (rw > r) rw = r;
    // all positions are determined relative to time span
    var year;
    for (i = 0; i < active_items.length; i++) {
        active_items[i].x = -20;
        active_items[i].y = height/2 -3*r;
        // determine X
        if (active_items[i].JahrFertigstellung == "") continue; 
        year = parseInt(active_items[i].JahrFertigstellung);
        if (year > temp_end || year < temp_start) continue;
        
        active_items[i].x = offset + (w - 2 * offset) * ((year - temp_start) / span);

        // determine Y
        sameNodes= searchItems(active_items[i].JahrFertigstellung, "JahrFertigstellung");
        var num = 0;
        if (sameNodes.length > 1) {// action if theres several nodes for one year
            num = i + 1;
            active_items[i].y -= (sameNodes.indexOf(num.toString()) * 3 * r);
        }
      
    }

}


// UPDATE
function update() {
    // catch out of bounds nodes
    if (drag)  // limit only when dragging is allowed
        for (i = 0; i < active_items.length; i++) {
            if (active_items[i].x < 0 + r)
                active_items[i].x = 0 + r;
            if (active_items[i].x > width - r)
                active_items[i].x = width - r;
            if (active_items[i].y < 0 + r)
                active_items[i].y = 0 + r;
            if (active_items[i].y > height - r)
                active_items[i].y = height - r;
        }

    // drawing Modes
    ctx.clearRect(0, 0, width, height);
    if (mode == "network") {
        drawRect(ctx, 0, 0, width, height, "#dbdbdb");
        updateView(drawNode, testcolor);
    }
    if (mode == "map") {
        ctx.drawImage(mapImage,0, 10, width, height);
        updateView(drawPin,"grey");
    }
    if (mode == "time") {
        drawTimeLine(ctime);
        updateView(drawImage, "grey");
    }
}

function updateView(f, color) {
    // draw ALL nodes as such or image
    // draw ALL links in container
    for (i = 0; i < active_links.length; i++)
        drawLink(active_links[i]);
    /*
    for (i= 0; i < search_links.length; i++) {
        drawLink(search_links[i], highlightcolor);
    }
    */

    if (click_node != null)
        drawRect(ctx, 0, 0, width, height, 'white', 0.7);

    for (i = 0; i < active_items.length; i++) {
        if (active_items[i] == click_node) { continue;}
        if (search_nodes.includes(active_items[i].Nummer))
            f(active_items[i], highlightcolor); // highlight selected nodes
        else {
            if (click_node != null)
                f(active_items[i], color, 0.5);
            else
                f(active_items[i], color, 1);

        }
       //DRAWING IMAGE NODES
        
    }
    //hover node
    if (hover_node != null) {
        drawHighlight(hover_node, highlightcolor,0.5, 1.5 * r);
        drawNodeImageRound(hover_node, "",0.5, 1.5 * r);//DRAWING IMAGE NODES
    }



    // draw click node last
    if (click_node != null) {
        drawHighlight(click_node, highlightcolor,1, 1.5 * r);
        drawNodeImageRound(click_node,"",1, 1.5 * r);//DRAWING IMAGE NODES
    }

    //loadInfo();
}


// Value update INFOBOX UPDATE MAIN ACTIONS

function clicked() {
    // consists of animations and transitions
    resetClickLinks();
    // Click node Action and Info
    // only if it is defined
    click_node = drag_node; // defining here
    nodePop(click_node);
    loadInfo();
}

function hovered() {
    x = getMouseCanvasPos().x;
    y = getMouseCanvasPos().y;
    hover_node = simulation.find(x, y);
    if (getDistance(hover_node, getMouseCanvasPos()) > r * 1.2) {
        hover_node = null;
        document.getElementById("network").style.cursor = "default";
    }
    else
        document.getElementById("network").style.cursor = "pointer";

    update();
}


function loadLinks() {
    // update links
    // called from HTML! when links are pressed

    //update link container
    active_links = [];
    var all_links = []; // holds all active links in one array

    if (S) active_links.push(chrono_data.links.Standort);
    if (L) active_links.push(chrono_data.links.Land);
    if (A) active_links.push(chrono_data.links.A1Nachname);
    if (K) active_links.push(chrono_data.links.K1);
    if (JE) active_links.push(chrono_data.links.JahrEntwurf);
    if (JF) active_links.push(chrono_data.links.JahrFertigstellung);

    // force all contained links
    // unless there are non then reset
    for (var i = 0; i < active_links.length; i++) {
        all_links = all_links.concat(active_links[i]); //merging active links together
    }
    active_links = all_links;
    simulation
        .force("link")
        .links(all_links);

    if (active_links.length < 1) {
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
        simulation.force("link").links(search_links); simulation.force("link").links(active_links);// adding links but not forces
    }
    else {
        resetClickLinks();
    }
    update();
  
}

function loadInfo() {
    //info_box.style.backgroundColor = "rgba(134, 209, 183, 0.89)";
    // UPDATE Info box
    if (click_node != null) {
        slideInfo();

        simulation.stop();

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
    else {
        slideOutInfo();
        if (mode == "network")
            impulse(0.1);
        update();
    }
}

expand = false;
function bigInfo() {
    if (!expand) {
        turnArrow(1);
        slideInfo(0);
        expand = true;
    }
    else {
        turnArrow(-1);
        slideInfo();
        expand = false;
    }
}

function loadMapNodes() {
    map_nodes = [];

    for (i = 0; i < table_length; i++) {
        if (chrono_data.items[i].Land== "Deutschland") {
            map_nodes.push(chrono_data.items[i]);
        }
    }
    updateNodes(map_nodes);
}
zoom_map = false;
function scroll(direction) {
    if (mode == "map" && !zoom_map) {
        if (direction == "down") {
            zoom_map = true;
            zoomMap();
        }// todo reset?
    }
    if (mode == "network" && zoom_map) {
        if (direction == "up") {
            zoom_map = false;
            updateNodes(chrono_data.items);
            changeMode("map");
        }
    }
    if (mode == "time") {
        zoomTime(direction);
    }
    update();
}
