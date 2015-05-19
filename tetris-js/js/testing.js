/**
 * Created by Gerard on 5-4-2015.
 */

function random(min, max) {
    return (min + (Math.random() * (max - min)));
};

//-------------------------------------------------------------------------
// game constants
//-------------------------------------------------------------------------

var KEY = {ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40},
    DIR = {UP: 0, RIGHT: 1, DOWN: 2, LEFT: 3, MIN: 0, MAX: 3},
    strokeColor='#ffffff',
    nx = 15, // width of tetris court (in blocks)
    ny = 20, // height of tetris court (in blocks)
    nu = 5;  // width/height of upcoming preview (in blocks)


var tB = [];
tB[0] = {size: 4, blocks: [0x44C0, 0x8E00, 0x6440, 0x0E20], color: '#4850fd'};
tB[1] = {size: 3, blocks: [0x4460, 0x0E80, 0xC440, 0x2E00], color: '#f82620'};
tB[2] = {size: 3, blocks: [0xCC00, 0xCC00, 0xCC00, 0xCC00], color: '#3ba2b8'};
tB[3] = {size: 2, blocks: [0x06C0, 0x8C40, 0x6C00, 0x4620], color: '#8127b8'};
tB[4] = {size: 3, blocks: [0x0E40, 0x4C40, 0x4E00, 0x4640], color: '#4cdf6c'};
tB[5] = {size: 3, blocks: [0x0C60, 0x4C80, 0xC600, 0x2640], color: '#f9c12b'};
tB[6] = {size: 4, blocks: [0x0F00, 0x2222, 0x00F0, 0x4444], color: '#f87e23'};

/**
 * blocks
 * Array of indexes of tB length
 * playingBlocks: copy of Blocks with four time every index of tB
 *
 * @type {Array}
 */

var startingBlocks = [];
var playingBlocks = [];

function fillBlocksArray(){
    for (var i = 0; i < tB.length; i++) {
        for (var j = 0; j < 4; j++) {
            playingBlocks[(i * 4) + j] = i;

        }
    }
}
fillBlocksArray();

function randomPiece() {
    if (playingBlocks.length <1){
        fillBlocksArray();
        //playingBlocks = startingBlocks;
        console.log('in randomPiece new length startingBlocks: '+playingBlocks.length);
    }
    var num = playingBlocks.splice(Math.floor(Math.random()* playingBlocks.length - 1), 1)[0];
    console.log('num: '+num);
    var type=tB[num];
    return {type: type, dir: DIR.UP, x: Math.round(random(0, nx - type.size)), y: 0};
};

for(i=0;i<124;i++){
    var rt=randomPiece()
    console.log('returndType: '+rt);
}
