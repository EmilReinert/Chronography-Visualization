var graph = JSON.parse(data);

// HTML VARIABLES
var info = document.getElementById("info");
var pics = document.getElementsByClassName("photo");
var data_path = "../../Data/Images";
var canvas = d3.select("#network"); // D3 activated canvas = SVG
var infoItems = document.getElementById("infobox").rows.item(0).cells;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Canvas Derived VARIABLES
var width = canvas.attr("width");
var height = canvas.attr("height");
var ctx = canvas.node().getContext("2d"); // 2D Context

// Constants
var r = 10;
var collisionFactor = 1;
var color = d3.scaleOrdinal(d3.schemeCategory10);

var itemWidth = width / infoItems.length; // calculating width space for table
for (i = 0; i < infoItems.length; i++) {
    infoItems[i].width = itemWidth;
}
var testImage = makeImage("../../Data/Images/globe.png", 200, 200); //MAKING A SMALL TEST IMAGE
var nodeImage = makeImage("../../Data/Images/globe.png", 200, 200); //Container with dynamic image source possible ?
var drawImages = false;

// NEW modificable VARIABLES
var click_node;
var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(r * collisionFactor)) // default r +1
    .force("charge", d3.forceManyBody()
        .strength(-200))
    .force("link", d3.forceLink()
        .id(function (d) { return d.name; }));
var testcolor;

var testnode = { name: "Emil", age: 36, color: "red" };
graph.nodes.push(testnode);

simulation
    .nodes(graph.nodes)
    .on("tick", update)
    .force("link")
    .links(graph.links);

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

    graph.links.forEach(drawLink);//DRAWING LINKS

    if (drawImages) {
        graph.nodes.forEach(drawNodeAge);//DRAWING NODES
        collisionFactor = 5;
    }
    else {
        graph.nodes.forEach(drawNode);//DRAWING NODES
        collisionFactor = 1;
    }
    //update collision radius
    simulation.force("collide", d3.forceCollide(r * collisionFactor));


}


// INFOBOX UPDATE MAIN ACTION"
function clicked() {
    /*TODO MAKE TRANSITION
    d3.select(this).transition()
        .attr("r", r * 10);
      */

    // Print selected Node info onto canvas
    info.innerHTML = "Name: " + click_node.name + " Age: " + click_node.age;

    // Change examplary 3 photos in info
    for (i = 0; i < pics.length; i++) {
        pics[i].src = data_path + "/" + click_node.color + ".jpg";
    }

    // Print some Document?
}


// DRAWING FUNCTIONS
function drawNode(d) {
    ctx.beginPath();
    ctx.fillStyle = color(d.color);
    ctx.globalAlpha = 1;
    ctx.moveTo(d.x, d.y);
    ctx.arc(d.x, d.y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawNodeAge(d) {
    nodeImage.src = data_path + "/" + d.color + ".jpg";
    ctx.drawImage(nodeImage, d.x - d.age / 2, d.y - d.age / 2, 2 * d.age / 2, 2 * d.age / 2);
    ctx.moveTo(d.x, d.y);

    //ctx.write("Hi");
}

function drawLink(l) {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#aaa";
    ctx.moveTo(l.source.x, l.source.y);
    ctx.lineTo(l.target.x, l.target.y);
    ctx.stroke();
}


// DRAG EVENTS

function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
}

function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    click_node = d3.event.subject; // Select clicked node
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
}

function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
}


// HELPERS

function makeImage(src, w, h) {
    var x = document.createElement("IMG");
    x.setAttribute("src", src);
    x.setAttribute("width", w);
    x.setAttribute("height", h);
    x.setAttribute("alt", "The Pulpit Rock");
    return x;
}

function impulse() {
}