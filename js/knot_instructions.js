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

function KnotInstructions(grid, start_locs) {
    this.init(grid,start_locs);
}

KnotInstructions.prototype = {
    init: function(grid, start_locs) {
        this.instructions = [];

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
        var pinmap = this.getPinMap();
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

                str_out += "From " + pinmap.getPin(start_loc.row, start_loc.col).lpad(" ", 7) + " ";
                for(var k = 0; k < run_list.length; k++) {
                    str_out += run_list[k] + " ";
                }
                str_out += "to " + pinmap.getPin(end_loc.row, end_loc.col).lpad(" ", 7) + "\n";
            }
            str_out += "\n";
        }

        return str_out;
    }
};
