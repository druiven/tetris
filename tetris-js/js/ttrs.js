/**
 * Tetris
 * Created by Gerard on 4-4-2015.
 * first steps with help of: http://codeincomplete.com/posts/2011/10/10/javascript_tetris/
 * Jake Gordon: https://disqus.com/by/jakesgordon/
 */

//-------------------------------------------------------------------------
// base helper methods
//-------------------------------------------------------------------------

function get(id) {
    return document.getElementById(id);
};
function hide(id) {
    get(id).style.visibility = 'hidden';
};
function show(id) {
    get(id).style.visibility = null;
};
function html(id, html) {
    get(id).innerHTML = html;
};

function timestamp() {
    return new Date().getTime();
};
function random(min, max) {
    return (min + (Math.random() * (max - min)));
};
function randomChoice(choices) {
    return choices[Math.round(random(0, choices.length - 1))];
};

if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        }
}

/***
 * tetris blokken
 * tB=tetrisBlokken
 */

var tB = [];
tB[0] = {blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: 'blue'};
tB[1] = {blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: 'orange'};
tB[2] = {blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: 'yellow'};
tB[3] = {blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: 'green'};
tB[4] = {blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: 'purple'};
tB[5] = {blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: 'red'};

/**
 * blocken=new Array();
 * met indexes van tB
 * om later random blocken te pakken die weer van bovenaf naar beneden gaan
 * zie uitleg op http://codeincomplete.com/posts/2011/10/10/javascript_tetris/
 *
 * van elk tB vier indexs achter elkaar
 * straks random daar één uithalen, die ook uit de array halen
 * totdat deze op is, dan wordt die array weer gevuld door deze
 */

var blocken = [];
var playingBlocken = [];
for (var i = 0; i < tB.length; i++) {
    for (var j = 0; j < 4; j++) {
        blocken[(i * 4) + j] = i;
    }
}
playingBlocken = blocken;

/**
 *
 * @returns {{type: T, dir: *, x: number, y: number}}
 */

function randomPiece() {
    if (playingBlocken.length == 0)
        playingBlocken = blocken;
    var type = playingBlocken.splice(random(0, playingBlocken.length - 1), 1)[0]; // remove a single piece
    return {type: type, dir: DIR.UP, x: 2, y: 0};
};

/**
 * We can then provide a helper method that given:

 one of the pieces above
 a rotation direction (0-3)
 a location on the tetris grid
 … will iterate over all of the cells in the tetris grid that the piece will occupy:
 *
 * @param type: soort tB
 * @param x: grid pos
 * @param y: grid pos
 * @param dir: direction
 * @param fn: function
 */

function eachblock(type, x, y, dir, fn) {
    var bit, result, row = 0, col = 0, blocks = type.blocks[dir];
    for (bit = 0x8000; bit > 0; bit = bit >> 1) {
        if (blocks & bit) {
            fn(x + col, y + row);
        }
        if (++col === 4) {
            col = 0;
            ++row;
        }
    }
};

/**
 * Is de volgende positie van bewegend block bezet
 *
 * @param type
 * @param x
 * @param y
 * @param dir
 * @returns {boolean}
 */
function occupied(type, x, y, dir) {
    var result = false;
    eachblock(type, x, y, dir, function (x, y) {
        if ((x < 0) || (x >= nx) || (y < 0) || (y >= ny) || getBlock(x, y))
            result = true;
    });
    return result;
};

/**
 * Of is deze niet bezet
 *
 * @param type
 * @param x
 * @param y
 * @param dir
 * @returns {boolean}
 */

function unoccupied(type, x, y, dir) {
    return !occupied(type, x, y, dir);
};

/**
 * Event KeyDown
 * @param ev
 */
function keydown(ev) {
    if (playing) {
        switch (ev.keyCode) {
            case KEY.LEFT:
                actions.push(DIR.LEFT);
                break;
            case KEY.RIGHT:
                actions.push(DIR.RIGHT);
                break;
            case KEY.UP:
                actions.push(DIR.UP);
                break;
            case KEY.DOWN:
                actions.push(DIR.DOWN);
                break;
            case KEY.ESC:
                lose();
                break;
        }
    }
    else if (ev.keyCode == KEY.SPACE) {
        play();
    }
};

/**
 * PLAYING
 *
 * */

/**
 *
 * @param idt
 */

function update(idt) {
    if (playing) {
        handle(actions.shift());
        dt = dt + idt;
        if (dt > step) {
            dt = dt - step;
            drop();
        }
    }
};

/**
 * handle KeyBoard input
 * @param action
 */

function handle(action) {
    switch (action) {
        case DIR.LEFT:
            move(DIR.LEFT);
            break;
        case DIR.RIGHT:
            move(DIR.RIGHT);
            break;
        case DIR.UP:
            rotate();
            break;
        case DIR.DOWN:
            drop();
            break;
    }
};

/**
 * handle Keydown
 * @param ev
 */


function keydown(ev) {
    var handled = false;
    if (playing) {
        switch (ev.keyCode) {
            case KEY.LEFT:
                actions.push(DIR.LEFT);
                handled = true;
                break;
            case KEY.RIGHT:
                actions.push(DIR.RIGHT);
                handled = true;
                break;
            case KEY.UP:
                actions.push(DIR.UP);
                handled = true;
                break;
            case KEY.DOWN:
                actions.push(DIR.DOWN);
                handled = true;
                break;
            case KEY.ESC:
                lose();
                handled = true;
                break;
        }
    }
    else if (ev.keyCode == KEY.SPACE) {
        play();
        handled = true;
    }
    if (handled)
        ev.preventDefault(); // prevent arrow keys from scrolling the page (supported in IE9+ and all other browsers)
};


/**
 * Move left right down
 * @param dir
 * @returns {boolean}
 */


function move(dir) {
    var x = current.x, y = current.y;
    switch (dir) {
        case DIR.RIGHT:
            x = x + 1;
            break;
        case DIR.LEFT:
            x = x - 1;
            break;
        case DIR.DOWN:
            y = y + 1;
            break;
    }
    if (unoccupied(current.type, x, y, current.dir)) {
        current.x = x;
        current.y = y;
        invalidate();
        return true;
    }
    else {
        return false;
    }
};

/**
 * Move Rotate
 * @param dir
 */

function rotate(dir) {
    var newdir = (current.dir == DIR.MAX ? DIR.MIN : current.dir + 1);
    if (unoccupied(current.type, current.x, current.y, newdir)) {
        current.dir = newdir;
        invalidate();
    }
};

/**
 * drop
 */

function drop() {
    if (!move(DIR.DOWN)) {
        addScore(10);
        dropPiece();
        removeLines();
        setCurrentPiece(next);
        setNextPiece(randomPiece());
        if (occupied(current.type, current.x, current.y, current.dir)) {
            lose();
        }
    }
};

/**
 * drop block
 */

function dropPiece() {
    eachblock(current.type, current.x, current.y, current.dir, function (x, y) {
        setBlock(x, y, current.type);
    });
};

/**
 * Constans and variables
 */


var KEY = {ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40},
    DIR = {UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3},
    stats = new Stats(),
    canvas = get('canvas'),
    ctx = canvas.getContext('2d'),
    ucanvas = get('upcoming'),
    uctx = ucanvas.getContext('2d'),
    speed = {start: 0.6, decrement: 0.005, min: 0.1}, // seconds until current piece drops 1 row
    nx = 10, // width of tetris court (in blocks)
    ny = 20, // height of tetris court (in blocks)
    nu = 5;  // width/height of upcoming preview (in blocks)


var dx, dy,        // pixel size of a single tetris block
    blocks,        // 2 dimensional array (nx*ny) representing tetris court - either empty block or occupied by a 'piece'
    actions,       // queue of user actions (inputs)
    playing,       // true|false - game is in progress
    dt,            // time since starting this game
    current,       // the current piece
    next,          // the next piece
    score,         // the current score
    rows,          // number of completed rows in the current game
    step;          // how long before current piece drops by 1 row

/**
 * getter setter -> sort off
 */

function setScore(n) {
    score = n;
    invalidateScore();
};
function addScore(n) {
    score = score + n;
};
function setRows(n) {
    rows = n;
    step = Math.max(speed.min, speed.start - (speed.decrement * rows));
    invalidateRows();
};
function addRows(n) {
    setRows(rows + n);
};
function getBlock(x, y) {
    return (blocks && blocks[x] ? blocks[x][y] : null);
};
function setBlock(x, y, type) {
    blocks[x] = blocks[x] || [];
    blocks[x][y] = type;
    invalidate();
};
function setCurrentPiece(piece) {
    current = piece || randomPiece();
    invalidate();
};
function setNextPiece(piece) {
    next = piece || randomPiece();
    invalidateNext();
};


/**
 * Game Loop
 */

function run() {

    showStats(); // initialize FPS counter
    addEvents(); // attach keydown and resize events

    var last = now = timestamp();

    function frame() {
        now = timestamp();
        update(Math.min(1, (now - last) / 1000.0)); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
        draw();
        stats.update();
        last = now;
        requestAnimationFrame(frame, canvas);
    }

    resize(); // setup all our sizing information
    reset();  // reset the per-game variables
    frame();  // start the first frame

};

function showStats() {
    stats.domElement.id = 'stats';
    get('menu').appendChild(stats.domElement);
};

function addEvents() {
    document.addEventListener('keydown', keydown, false);
    window.addEventListener('resize', resize, false);
};

function resize(event) {
    canvas.width = canvas.clientWidth;  // set canvas logical size equal to its physical size
    canvas.height = canvas.clientHeight; // (ditto)
    ucanvas.width = ucanvas.clientWidth;
    ucanvas.height = ucanvas.clientHeight;
    dx = canvas.width / nx; // pixel size of a single tetris block
    dy = canvas.height / ny; // (ditto)
    invalidate();
    invalidateNext();
};


/* RENDERING */

/**
 * Notifications
 * @param id
 * @param html
 */

function writeHtml(id, html) {
    document.getElementById(id).innerHTML = html;
}

var invalid = {court: true, next: true, score: true, rows: true};

function invalidate() {
    invalid.court = true;
}
function invalidateNext() {
    invalid.next = true;
}
function invalidateScore() {
    invalid.score = true;
}
function invalidateRows() {
    invalid.rows = true;
}

function draw() {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.translate(0.5, 0.5); // for crisp 1px black lines
    drawCourt();
    drawNext();
    drawScore();
    drawRows();
    ctx.restore();
};

function drawCourt() {
    if (invalid.court) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (playing)
            drawPiece(ctx, current.type, current.x, current.y, current.dir);
        var x, y, block;
        for (y = 0; y < ny; y++) {
            for (x = 0; x < nx; x++) {
                if (block = getBlock(x, y))
                    drawBlock(ctx, x, y, block.color);
            }
        }
        ctx.strokeRect(0, 0, nx * dx - 1, ny * dy - 1); // court boundary
        invalid.court = false;
    }
};

function drawNext() {
    if (invalid.next) {
        var padding = (nu - next.type.size) / 2; // half-arsed attempt at centering next piece display
        uctx.save();
        uctx.translate(0.5, 0.5);
        uctx.clearRect(0, 0, nu * dx, nu * dy);
        drawPiece(uctx, next.type, padding, padding, next.dir);
        uctx.strokeStyle = 'black';
        uctx.strokeRect(0, 0, nu * dx - 1, nu * dy - 1);
        uctx.restore();
        invalid.next = false;
    }
};

function drawScore() {
    if (invalid.score) {
        writeHtml('score', ("00000" + Math.floor(score)).slice(-5));
        invalid.score = false;
    }
};

function drawRows() {
    if (invalid.rows) {
        writeHtml('rows', rows);
        invalid.rows = false;
    }
};

function drawPiece(ctx, type, x, y, dir) {
    eachblock(type, x, y, dir, function (x, y) {
        drawBlock(ctx, x, y, type.color);
    });
};

function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * dx, y * dy, dx, dy);
    ctx.strokeRect(x * dx, y * dy, dx, dy)
};

/**
 * START
 */

run(); // start the first frame

