if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/\s+$/g, '');
    };
}
//pads left
String.prototype.lpad = function(padString, length) {
        var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}
 
//pads right
String.prototype.rpad = function(padString, length) {
        var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

function HalfCycle() {
    this.init();
}

HalfCycle.prototype = {
    init: function() {
        this.run_list = [];
    },

    setStartLoc: function(loc) {
        this.start = new KnotLocation(loc.row, loc.col, loc.dir);
    },

    setEndLoc: function(loc) {
        this.end = new KnotLocation(loc.row, loc.col, loc.dir);
    },

    getStartLoc: function() {
        return this.start;
    },

    getEndLoc: function() {
        return this.end;
    },

    getRunList: function() {
        return this.run_list;
    },

    appendToRunList: function(c) {
        this.run_list.push(c);
    }
};

function StrandInstructions() {
    this.init();
}

StrandInstructions.prototype = {
    init: function() {
        this.half_cycles = [];
    },

    getHalfCycles: function() {
        return this.half_cycles;
    },

    appendHalfCycle: function(hc) {
        this.half_cycles.push(hc);
    }
};

function KnotInstructions(grid, start_locs, do_letter_pins, do_half_way, do_short_hand) {
    this.init(grid,start_locs,do_letter_pins, do_half_way, do_short_hand);
}

KnotInstructions.prototype = {
    init: function(grid, start_locs,do_letter_pins,do_half_way, do_short_hand) {
        this.do_letter_pins = do_letter_pins;
        this.do_short_hand = do_short_hand;
        this.instructions = [];
        this.grid = grid;

        var newgrid = grid.emptyCopy();
        for(var i = 0; i < start_locs.length; i++) {
            var strand_instructions = new StrandInstructions();

            var start_loc = start_locs[i];
            var walker = new KnotGridWalker(grid, start_loc);
            var hc = new HalfCycle();
            hc.setStartLoc(start_loc);
            walker.next();

            if(walker.isOnBight()) {
                var loc = walker.getLocation();
                newgrid.putStrandPiece(loc, grid.grid[loc.row][loc.col]);
            } else {
                newgrid.putStrandPiece(walker.getLocation());
            }

            while(walker.next()) {
                var loc = walker.getLocation();
                if(walker.isOnBight()) {
                    newgrid.putStrandPiece(loc, grid.grid[loc.row][loc.col]);
                } else {
                    newgrid.putStrandPiece(loc);
                }
                if(newgrid.isBight(loc.row,loc.col)) {
                    hc.setEndLoc(loc);
                    strand_instructions.appendHalfCycle(hc);
                    hc = new HalfCycle();
                    hc.setStartLoc(walker.getLocation());
                } else if(newgrid.isCrossing(loc.row, loc.col)) {
                    if(newgrid.isOver(loc)) {
                        hc.appendToRunList("O");
                    } else {
                        hc.appendToRunList("U");
                    }
                } else {
                    hc.appendToRunList(".");
                }
            }

            hc.setEndLoc(walker.getLocation());
            strand_instructions.appendHalfCycle(hc);
            this.instructions.push(strand_instructions);
        }

        if(do_half_way) {
            newgrid = grid.emptyCopy();
            var normalInstructions = this.instructions;
            this.instructions = [];
            for(var i = 0; i < start_locs.length; i++) {
                if(!this.grid.isLoop(start_locs[i])) {
                    // only do half way instructions for strands that loop
                    // back to the beginning
                    // TODO add half way instructions for strands that don't loop?
                    this.instructions.push(normalInstructions[i]);
                    continue;
                }
                var numHalfCycles = normalInstructions[i].getHalfCycles().length;
                var halfWayCycles = Math.ceil(numHalfCycles/2);
                var otherWayCycles = numHalfCycles-halfWayCycles;

                var strand_instructions = new StrandInstructions();

                var start_loc = start_locs[i];
                var walker = new KnotGridWalker(grid, start_loc);
                var hc = new HalfCycle();
                hc.setStartLoc(start_loc);
                walker.next();

                if(walker.isOnBight()) {
                    var loc = walker.getLocation();
                    newgrid.putStrandPiece(loc, grid.grid[loc.row][loc.col]);
                } else {
                    newgrid.putStrandPiece(walker.getLocation());
                }

                while(walker.next()) {
                    var loc = walker.getLocation();
                    if(walker.isOnBight()) {
                        newgrid.putStrandPiece(loc, grid.grid[loc.row][loc.col]);
                    } else {
                        newgrid.putStrandPiece(loc);
                    }
                    if(newgrid.isBight(loc.row,loc.col)) {
                        hc.setEndLoc(loc);
                        strand_instructions.appendHalfCycle(hc);
                        if(strand_instructions.getHalfCycles().length == halfWayCycles) {
                            break;
                        }
                        hc = new HalfCycle();
                        hc.setStartLoc(walker.getLocation());
                    } else if(newgrid.isCrossing(loc.row, loc.col)) {
                        if(newgrid.isOver(loc)) {
                            hc.appendToRunList("O");
                        } else {
                            hc.appendToRunList("U");
                        }
                    } else {
                        hc.appendToRunList(".");
                    }
                }

                start_loc.dir = flipDirection(start_loc.dir, grid.grid[start_loc.row][start_loc.col]);
                walker = new KnotGridWalker(grid, start_loc);
                hc = new HalfCycle();
                hc.setStartLoc(start_loc);
                walker.next();

                if(walker.isOnBight()) {
                    var loc = walker.getLocation();
                    newgrid.putStrandPiece(loc, grid.grid[loc.row][loc.col]);
                } else {
                    newgrid.putStrandPiece(walker.getLocation());
                }

                while(walker.next()) {
                    var loc = walker.getLocation();
                    if(walker.isOnBight()) {
                        newgrid.putStrandPiece(loc, grid.grid[loc.row][loc.col]);
                    } else {
                        newgrid.putStrandPiece(loc);
                    }
                    if(newgrid.isBight(loc.row,loc.col)) {
                        hc.setEndLoc(loc);
                        strand_instructions.appendHalfCycle(hc);
                        if(strand_instructions.getHalfCycles().length == numHalfCycles) {
                            break;
                        }
                        hc = new HalfCycle();
                        hc.setStartLoc(walker.getLocation());
                    } else if(newgrid.isCrossing(loc.row, loc.col)) {
                        if(newgrid.isOver(loc)) {
                            hc.appendToRunList("O");
                        } else {
                            hc.appendToRunList("U");
                        }
                    } else {
                        hc.appendToRunList(".");
                    }
                }

                this.instructions.push(strand_instructions);
            }
        }
    },
    getPinMap: function() {
        var map = new PinMap();
        var pin = 1;
        for(var i = 0; i < this.instructions.length; i++) {
            var strand = this.instructions[i];
            var half_cycles = strand.getHalfCycles();
            for(var j = 0; j < half_cycles.length; j++) {
                var hc = half_cycles[j];
                var start_loc = hc.getStartLoc();
                var end_loc = hc.getEndLoc();
                if(!map.hasPin(start_loc.row,start_loc.col)) {
                    map.setPin(pin, start_loc.row, start_loc.col);
                    pin++;
                }
                if(!map.hasPin(end_loc.row,end_loc.col)) {
                    map.setPin(pin, end_loc.row, end_loc.col);
                    pin++;
                }
            }
        }

        return map;
    },
    toString: function() {
        var pinmap;
        if(this.do_letter_pins) {
            pinmap = this.grid.getPinMap();
        } else {
            pinmap = this.getPinMap();
        }
        var str_out = "";
        for(var i = 0; i < this.instructions.length; i++) {
            var strand = this.instructions[i];
            var half_cycles = strand.getHalfCycles();
            str_out += "Strand " + (i+1) + "\n";
            for(var j = 0; j < half_cycles.length; j++) {
                var hc = half_cycles[j];
                var start_loc = hc.getStartLoc();
                var end_loc = hc.getEndLoc();
                var run_list = hc.getRunList();

                if(j > 0) {
                    var prevEndLoc = half_cycles[j-1].getEndLoc();
                    if(start_loc.row != prevEndLoc.row || start_loc.col != prevEndLoc.col) {
                        str_out += "\nReturn to start point and go other direction\n\n";
                    }
                }

                str_out += "From " + pinmap.getPin(start_loc.row, start_loc.col).rpad(" ", 7) + " ";
                if(this.do_short_hand) {
                    var lastMove = '';
                    var num = 0;
                    for(var k = 0; k < run_list.length; k++) {
                        if(run_list[k] == ".") continue;

                        if(num > 0 && run_list[k] != lastMove) {
                            str_out += lastMove + num + " ";
                            num = 0;
                        }
                        lastMove = run_list[k];
                        num++;
                    }
                    if(num > 0) {
                        str_out += lastMove + num + " ";
                    }
                } else {
                    for(var k = 0; k < run_list.length; k++) {
                        str_out += run_list[k] + " ";
                    }
                }
                str_out += ("to " + pinmap.getPin(end_loc.row, end_loc.col)).lpad(" ", 10) + "\n";
//                console.log("Start - " + start_loc.row + ", " + start_loc.col + ": " + pinmap.getPin(start_loc.row, start_loc.col));
//                console.log("End - " + end_loc.row + ", " + end_loc.col + ": " + pinmap.getPin(end_loc.row, end_loc.col));
            }
            str_out += "\n";
        }

        return str_out;
    }
};
