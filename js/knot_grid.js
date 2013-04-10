function PinMap() {
    this.init();
}

PinMap.prototype = {
    init: function() {
        this.mapping = {};
    },
    setPin: function(pin, row, col) {
        this.mapping["p" + row + "," + col] = "" + pin;
    },

    getPin: function(row,col) {
        if(this.mapping["p" + row + "," + col]) {
            return this.mapping["p" + row + "," + col];
        }

        return "";
    },

    hasPin: function(row,col) {
        if(this.mapping["p" + row + "," + col]) {
            return true;
        }
        return false;
    }
};

function KnotGrid(rows, cols, no_knot_info) {
    this.init(rows,cols, no_knot_info);
}
KnotGrid.fromString = function(str) {
    var split_str = str.trim().split("\nCoding:\n");
    var grid_str = split_str[0];
    var coding_str = split_str[1];

    var grid_data = [];
    var grid_rows = grid_str.split("\n");
    var max_cols = 0;
    for(var i = 0; i < grid_rows.length; i++) {
        var grid_cols = grid_rows[i].split("");
        if(grid_cols.length > max_cols) {
            max_cols = grid_cols.length;
        }
        grid_data.push(grid_cols);
    }

    var rows = grid_rows.length;
    var cols = max_cols;

    var coding_data = [];
    var coding_rows = coding_str.split("\n");
    for(var i = 0; i < coding_rows.length; i++) {
        var coding_cols = coding_rows[i].split("");
        coding_data.push(coding_cols);
    }

    var grid = new KnotGrid(rows,cols);
    for(var r = 0; r < rows; r++) {
        for(var c = 0; c < cols; c++) {
            switch(grid_data[r][c]) {
                case KnotGridValues.EMPTY:
                case KnotGridValues.INVALID:
                case KnotGridValues.X:
                case KnotGridValues.SLASH:
                case KnotGridValues.BACKSLASH:
                case KnotGridValues.UPPER_BIGHT:
                case KnotGridValues.LOWER_BIGHT:
                case KnotGridValues.LEFT_BIGHT:
                case KnotGridValues.RIGHT_BIGHT:
                    break;
                default:
                    grid_data[r][c] = KnotGridValues.EMPTY;
                    //throw "Invalid knot grid data: " + r + ", " + c + ": '" + grid_data[r][c] + "'";
            }
            switch(coding_data[r][c]) {
                case CodingValues.O:
                case CodingValues.U:
                    break;
                default:
                    throw "Invalid coding data";
            }
            grid.grid[r][c] = grid_data[r][c];
            grid.coding[r][c] = coding_data[r][c];
        }
    }
    grid.setInvalid();

    return grid;
},


KnotGridValues = {
    EMPTY: '.',
    INVALID: '*',
    X: 'X',
    SLASH: '/',
    BACKSLASH: '\\',
    UPPER_BIGHT: '^',
    LOWER_BIGHT: 'v',
    LEFT_BIGHT: '<',
    RIGHT_BIGHT: '>'
};

// O means a strand going DOWN_RIGHT (or UP_LEFT) is over the
// strand it crosses
// U means a strand going DOWN_RIGHT (or UP_LEFT) is under the
// strand it crosses
CodingValues = {
    O: 'O',
    U: 'U'
};

KnotGrid.prototype = {
    copy: function(no_knot_info) {
        var new_grid = new KnotGrid(this.rows, this.cols, no_knot_info);
        new_grid.cols_wrap = this.cols_wrap;
        new_grid.rows_wrap = this.rows_wrap;
        new_grid.offset = this.offset;

        new_grid.grid_func = this.grid_func;
        new_grid.grid_opts = this.grid_opts;

        new_grid.coding_func = this.coding_func;
        new_grid.coding_opts = this.coding_opts;
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                new_grid.grid[r][c] = this.grid[r][c];
                new_grid.coding[r][c] = this.coding[r][c];
            }
        }

        return new_grid;
    },
    emptyCopy: function() {
        var new_grid = new KnotGrid(this.rows, this.cols, 1);
        new_grid.cols_wrap = this.cols_wrap;
        new_grid.rows_wrap = this.rows_wrap;
        new_grid.offset = this.offset;

        new_grid.grid_func = this.grid_func;
        new_grid.grid_opts = this.grid_opts;

        new_grid.coding_func = this.coding_func;
        new_grid.coding_opts = this.coding_opts;
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                new_grid.grid[r][c] = KnotGridValues.EMPTY;
                new_grid.coding[r][c] = this.coding[r][c];
            }
        }

        new_grid.setInvalid();

        return new_grid;
    },
    init: function(rows, cols, no_knot_info) {
        //log("in init: " + rows + ", " + cols);
        this.rows = rows;
        this.cols = cols;
        this.cols_wrap = true;
        this.rows_wrap = false;
        this.offset = 0; // 1 or 0, offset the grid up to 1 space in 
                         // the matrix

        this.grid_func = this.standardGrid;
        this.grid_opts = 0;

        this.coding_func = this.columnCoding;
        this.coding_opts = "OU";
//        this.coding_func = this.imageCoding;
//        this.coding_opts = "save_data";

        this.grid = [];
        this.coding = [];
        for(var r = 0; r < rows; r++) {
            this.grid[r] = [];
            this.coding[r] = [];
            for(var c = 0; c < cols; c++) {
                this.grid[r][c] = KnotGridValues.EMPTY;
                this.coding[r][c] = CodingValues.O;
            }
        }

        this.fill();
//        this.setInvalid();
        if(!no_knot_info) {
            this.updateKnotInfo();
        }
    },

    putStrandPiece: function(loc, bight) {
        if(bight) {
            this.grid[loc.row][loc.col] = bight;
        } else {
            switch(this.grid[loc.row][loc.col]) {
                case KnotGridValues.EMPTY:
                    switch(loc.dir) {
                        case KnotDirection.UP_RIGHT:
                        case KnotDirection.DOWN_LEFT:
                            this.grid[loc.row][loc.col] = KnotGridValues.SLASH;
                            break;
                        case KnotDirection.UP_LEFT:
                        case KnotDirection.DOWN_RIGHT:
                            this.grid[loc.row][loc.col] = KnotGridValues.BACKSLASH;
                            break;
                    }
                    break;
                case KnotGridValues.SLASH:
                    switch(loc.dir) {
                        case KnotDirection.UP_LEFT:
                        case KnotDirection.DOWN_RIGHT:
                            this.grid[loc.row][loc.col] = KnotGridValues.X;
                            break;
                    }
                    break;
                case KnotGridValues.BACKSLASH:
                    switch(loc.dir) {
                        case KnotDirection.UP_RIGHT:
                        case KnotDirection.DOWN_LEFT:
                            this.grid[loc.row][loc.col] = KnotGridValues.X;
                            break;
                    }
                    break;
            }
        }
    },

    updateKnotInfo: function() {
        //log("hello");
        this.knot_info = [];
        for(var r = 0; r < this.rows; r++) {
            this.knot_info[r] = [];
        }

        var grid = this.copy(1);
        var strand = 0;

        for(var r = 0; r < grid.rows; r++) {
            for(var c = 0; c < grid.cols; c++) {
                for(var s = 0; s < 2; s++) {
                    if(grid.hasValue(r,c)) {
                        var dir = getDefaultKnotDirection(grid.grid[r][c]);
                        var start_loc = new KnotLocation(r, c, dir);
                        if(!grid.isLoop(start_loc)) {
                            var ends = grid.findEnds(start_loc);
                            start_loc = ends[0];
                        }
                        var walker = new KnotGridWalker(grid, start_loc);
                        while(walker.next()) {
                            var loc = walker.getLocation();
                            if(!this.knot_info[loc.row][loc.col]) {
                                this.knot_info[loc.row][loc.col] = [];
                            }
                            this.knot_info[loc.row][loc.col].push({
                                strand: strand,
                                dir: loc.dir
                            });
                        }
                        grid.removeStrand(start_loc);
                        strand++;
                    }
                }
            }
        }
    },

    removeNonLoops: function() {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                var dirs = getValidKnotDirections(this.grid[r][c]);
                for(var s = 0; s < dirs.length; s++) {
                    var dir = dirs[s];
                    if(this.hasValue(r,c) && isValidDirection(this.grid[r][c], dir)) {
                        var loc = new KnotLocation(r,c,dir);
                        if(!this.isLoop(loc)) {
                            this.removeStrand(loc);
                        }
                    }
                }
            }
        }
//        this.updateKnotInfo();
    },

    isLoop: function(loc) {
        var walker = new KnotGridWalker(this, loc);

        while(walker.next()) {
        }

        return walker.returnedToStart();
    },

    findEnds: function(loc) {
        var ends = [];

        var walker = new KnotGridWalker(this, loc);
        while(walker.next()) {
        }

        var end1 = walker.getLocation();
        end1.dir = flipDirection(end1.dir, this.grid[end1.row][end1.col]);

        walker = new KnotGridWalker(this, end1);
        while(walker.next()) {
        }

        var end2 = walker.getLocation();
        end2.dir = flipDirection(end2.dir, this.grid[end2.row][end2.col]);
        ends.push(end2);

        if(end2.row != end1.row || end2.col != end1.col) {
            ends.push(end1);
        }

        return ends;
    },
    findBights: function(loc) {
        var bights = [];

        if(!this.isLoop(loc)) {
            loc = this.findEnds(loc)[0];
        }

        var walker = new KnotGridWalker(this, loc);
        while(walker.next()) {
            if(walker.isOnBight()) {
                bights.push(walker.getLocation());
            }
        }
        return bights;
    },

    hasValue: function(row,col) {
        switch(this.grid[row][col]) {
            case KnotGridValues.EMPTY:
            case KnotGridValues.INVALID:
                return false;
        }
        return true;
    },

    getDefaultStartLocations: function() {
        var start_locs = [];
        var grid = this.copy();
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                if(grid.hasValue(r,c)) {
                    var loc = new KnotLocation(r,c, getDefaultKnotDirection(grid.grid[r][c]));
                    if(grid.isLoop(loc)) {
                        var bights = grid.findBights(loc);
                        start_locs.push(bights[0]);
                    } else {
                        var ends = grid.findEnds(loc)
                        start_locs.push(ends[0]);
                    }
                    grid.removeStrand(loc);
                }
            }
        }

        return start_locs;
    },

    getNumStrands: function() {
        var grid = this.copy();
        var strands = 0;
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                for(var s = 0; s < 2; s++) {
                    if(grid.hasValue(r,c)) {
                        strands++;
                        var loc = new KnotLocation(r,c, getDefaultKnotDirection(grid.grid[r][c]));
                        grid.removeStrand(loc);
                    }
                }
            }
        }

        return strands;
    },

    getValidStartLocations: function() {
        var start_locs = [];
        var grid = this.copy();
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                for(var s = 0; s < 2; s++) {
                    if(grid.hasValue(r,c)) {
                        var loc = new KnotLocation(r,c, getDefaultKnotDirection(grid.grid[r][c]));
                        var bights = grid.findBights(loc);
                        start_locs = start_locs.concat(bights);

                        if(!grid.isLoop(loc)) {
                            var ends = grid.findEnds(loc)
                            start_locs = start_locs.concat(ends);
                        }
                        grid.removeStrand(loc);
                    }
                }
            }
        }

        return start_locs;
    },

    isBight: function(row,col) {
        switch(this.grid[row][col]) {
            case KnotGridValues.UPPER_BIGHT:
            case KnotGridValues.LOWER_BIGHT:
            case KnotGridValues.LEFT_BIGHT:
            case KnotGridValues.RIGHT_BIGHT:
                return true;
        }

        return false;
    },

    isCrossing: function(r,c) {
        return this.grid[r][c] == KnotGridValues.X;
    },

    // returns whether the given strand 
    // crosses over the strand it is crossing.
    // if the strand isn't crossing another strand than the information
    // isn't very useful
    isOver: function(loc) {
        var coding = this.coding[loc.row][loc.col];
        switch(loc.dir) {
            case KnotDirection.UP_RIGHT:
            case KnotDirection.DOWN_LEFT:
                return (coding != CodingValues.O);
            case KnotDirection.UP_LEFT:
            case KnotDirection.DOWN_RIGHT:
                return (coding == CodingValues.O);
        }
    },

    isUnder: function(loc) {
        return !this.isOver(loc);
    },

    resize: function(rows, cols) {
        var new_grid = [];
        var new_coding = [];
        for(var r = 0; r < rows; r++) {
            new_grid[r] = [];
            new_coding[r] = [];
            for(var c = 0; c < cols; c++) {
                if(r < this.rows && c < this.cols) {
                    new_grid[r][c] = this.grid[r][c];
                    new_coding[r][c] = this.coding[r][c];
                } else {
                    new_grid[r][c] = KnotGridValues.EMPTY;
                    new_coding[r][c] = CodingValues.O;
                }
            }
        }

        this.grid = new_grid;
        this.coding = new_coding;
        this.rows = rows;
        this.cols = cols;

        this.setInvalid();

        this.updateKnotInfo();
    },

    setInvalid: function() {
        for(var start_c = 1-this.offset; start_c < this.cols; start_c += 2) {
            var c = start_c;
            var r = 0;
            while(r < this.rows && c < this.cols) {
                this.grid[r][c] = KnotGridValues.INVALID;
                r++;
                c++;
            }
        }

        for(var start_r = 1-this.offset; start_r < this.rows; start_r += 2) {
            var c = 0;
            var r = start_r;
            while(r < this.rows && c < this.cols) {
                this.grid[r][c] = KnotGridValues.INVALID;
                r++;
                c++;
            }
        }
    },

    clear: function() {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                if(this.grid[r][c] != KnotGridValues.INVALID) {
                    this.grid[r][c] = KnotGridValues.EMPTY;
                }
            }
        }
    },

    fill: function() {
        this.updateGrid();
        this.updateCoding();
    },

    extendStrands: function() {
        var cur_loc = new KnotLocation(0,0,KnotDirection.DOWN_RIGHT);
        var next_loc = new KnotLocation(0,0,KnotDirection.DOWN_RIGHT);
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                if(this.hasValue(r,c)) {
                    var dirs = getValidKnotDirections(this.grid[r][c]);
                    for(var i = 0; i < dirs.length; i++) {
                        var dir = dirs[i];
                        cur_loc.row = r;
                        cur_loc.col = c;
                        cur_loc.dir = dir;
                        cur_loc.getNextLocation(next_loc);
                        if(this.rows_wrap && (next_loc.row < 0 || next_loc.row >= this.rows)) {
                            next_loc.row = (next_loc.row+this.rows)%this.rows;
                        }
                        if(this.cols_wrap && (next_loc.col < 0 || next_loc.col >= this.cols)) {
                            next_loc.col = (next_loc.col+this.cols)%this.cols;
                        }
                        switch(dir) {
                            case KnotDirection.UP_RIGHT:
                            case KnotDirection.UP_LEFT:
                                while(next_loc.row >= 0 && next_loc.row < this.rows &&
                                      next_loc.col >= 0 && next_loc.col < this.cols &&
                                      !this.isBight(next_loc.row, next_loc.col)) {
                                    this.putStrandPiece(next_loc);
                                    cur_loc.row = next_loc.row;
                                    cur_loc.col = next_loc.col;
                                    cur_loc.getNextLocation(next_loc);
                                    if(this.rows_wrap && (next_loc.row < 0 || next_loc.row >= this.rows)) {
                                        next_loc.row = (next_loc.row+this.rows)%this.rows;
                                    }
                                    if(this.cols_wrap && (next_loc.col < 0 || next_loc.col >= this.cols)) {
                                        next_loc.col = (next_loc.col+this.cols)%this.cols;
                                    }
                                }
                                break;
                            default:
                                if(next_loc.row >= 0 && next_loc.row < this.rows &&
                                      next_loc.col >= 0 && next_loc.col < this.cols &&
                                      !this.isBight(next_loc.row, next_loc.col)) {
                                    this.putStrandPiece(next_loc);
                                }
                        }
                    }
                }
            }
        }
    },

    getFacets: function() {
        var facets = 0;
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                if(this.grid[r][c] == KnotGridValues.X) {
                    facets++;
                }
            }
        }

        return facets;
    },

    updateGrid: function() {
        this.grid_func(this.grid_opts);
    },

    updateCoding: function() {
        this.coding_func(this.coding_opts);
    },

    columnCoding: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.coding[r][c] = opts[c%opts.length];
            }
        }
    },
    lockedGauchoCoding: function(opts) {
        var topcoding = opts.topcoding[0];

        coding = [];
        coding[0] = 'O'; // top bight row
        coding[1] = topcoding;
        var over = topcoding == 'U';
        for(var i = 0; i < this.rows-4; i++) {
            if((i % opts.size) == 0 && i != 0) {
                over = !over;
            }
            coding[i+2] = over ? 'O' : 'U';
        }
        
        coding[this.rows-2] = coding[this.rows-3] == 'U' ? 'O' : 'U'; // bottom bight row
        coding[this.rows-1] = 'O'; // bottom bight row

        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.coding[r][c] = coding[r%coding.length];
            }
        }
    },

    imageCoding: function(opts) {
        var canvas = CANVAS();
        canvas.width = this.cols;
        canvas.height = this.rows;
        var ctx = canvas.getContext("2d");
        ctx.drawImage($(opts), 0, 0);

        var image_data = ctx.getImageData(0, 0, this.cols, this.rows).data;
        
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                var val = image_data[r*this.cols*4+c*4];
                if(val == 255) {
                    this.coding[r][c] = CodingValues.U;
                } else {
                    this.coding[r][c] = CodingValues.O;
                }
                //log((r*this.cols*4+c*4) + ": " + val + ", " + this.coding[r][c]);
            }
        }
    },

    rowCoding: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.coding[(r+1)%this.rows][c] = opts[r%opts.length];
            }
        }
    },

    dogBoneCoding: function(opts) {
        for(var r = 0; r < opts.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.coding[r][c] = opts.topcoding[r%opts.topcoding.length];
            }
        }
        for(var r = opts.rows; r < this.rows-opts.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.coding[r][c] = opts.midcoding[r%opts.midcoding.length];
            }
        }
        for(var r = this.rows-opts.rows; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.coding[r][c] = opts.botcoding[r%opts.botcoding.length];
            }
        }
    },

    toString: function() {
        var str = "";
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                str += this.grid[r][c];
            }
            str += "\n";
        }
        str += "Coding:\n";
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                str += this.coding[r][c];
            }
            str += "\n";
        }

        return str;
    },
    gridAsString: function() {
        var str = "";
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                str += this.grid[r][c];
            }
            str += "\n";
        }

        return str;
    },
    codingAsString: function() {
        var str = "";
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                str += this.coding[r][c];
            }
            str += "\n";
        }

        return str;
    },

    toStringForURL: function() {
        var str = "" + this.rows + "x" + this.cols + "_";
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                str += this.grid[r][c];
            }
        }

        return str;
    },

    rowColumnCoding: function(codings) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                row_coding = (codings.row[r%codings.row.length] == "O" ? 0 : 1);
                col_coding = (codings.col[c%codings.col.length] == "O" ? 0 : 1);
                coding = (row_coding ^ col_coding) ? "O" : "U";

                this.coding[r][c] = coding;
            }
        }
    },

    tileCoding: function(opts) {
        var num = opts.size;
        this.coding = [];
        for(var r = 0; r < this.rows; r++) {
            this.coding[r] = [];
            for(var c = 0; c < this.cols; c++) {
                this.coding[r][c] = CodingValues.U;
            }
        }
        pattern = [];
        reverse_pattern = [];
        for(var i = 0; i < num; i++) {
            pattern.push("O");
            reverse_pattern.push("U");
        }
        for(var i = 0; i < num; i++) {
            pattern.push("U");
            reverse_pattern.push("O");
        }

        var maxnum = Math.max(this.rows, this.cols);
        for(var i = 0; i < maxnum; i += 2) {
            for(var j = 0; j < maxnum; j++) {
                var index = (Math.floor(i/2)+j)%(2*num);
                if(j < this.rows && i+j < this.cols) {
                    this.coding[j][i+j] = pattern[index];
                    if(Math.floor(Math.floor(i/2)/num)%2) {
                        this.coding[j][i+j] = reverse_pattern[index];
                    }
                }
                if(i > 0) {
                    if(i+j < this.rows && j < this.cols) {
                        this.coding[i+j][j] = pattern[index];
                        if(Math.floor((Math.floor(i/2)+num-1)/num)%2) {
                            this.coding[i+j][j] = reverse_pattern[index];
                        }
                    }
                }
            }
        }

        var topcoding = opts.topcoding;
        var botcoding = opts.botcoding;
        for(var c = 0; c < this.cols; c++) {
            for(var i = 0; i < topcoding.length; i++) {
                var r = 1+i;
                this.coding[r][c] = topcoding[i];
            }
            for(var i = 0; i < botcoding.length; i++) {
                var r = this.rows-1-botcoding.length+i;
                this.coding[r][c] = botcoding[i];
            }
        }

    },

    standardGrid: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                if(r == 0 && !this.rows_wrap) {
                    this.grid[r][c] = KnotGridValues.UPPER_BIGHT;
                } else if(r == this.rows-1 && !this.rows_wrap) {
                    this.grid[r][c] = KnotGridValues.LOWER_BIGHT;
                } else if(c == 0 && !this.cols_wrap) {
                    this.grid[r][c] = KnotGridValues.LEFT_BIGHT;
                } else if(c == this.cols-1 && !this.cols_wrap) {
                    this.grid[r][c] = KnotGridValues.RIGHT_BIGHT;
                } else {
                    this.grid[r][c] = KnotGridValues.X;
                }
            }
        }
        this.setInvalid();
    },

    matGrid: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                if(c == 0 ||
                    (c == this.cols-1 && (this.cols-1)%2 == 0)) {
                    this.grid[r][c] = KnotGridValues.EMPTY;
                } else {
                    if(r == 0) {
                        this.grid[r][c] = KnotGridValues.UPPER_BIGHT;
                    } else if(r == this.rows-1) {
                        this.grid[r][c] = KnotGridValues.LOWER_BIGHT;
                    } else if(c == 1) {
                        this.grid[r][c] = KnotGridValues.LEFT_BIGHT;
                    } else if((c == this.cols-1 && (this.cols-1) % 2) ||
                              (c == this.cols-2 && (this.cols-2) % 2)) {
                        this.grid[r][c] = KnotGridValues.RIGHT_BIGHT;
                    } else {
                        this.grid[r][c] = KnotGridValues.X;
                    }
                }
            }
        }
        this.setInvalid();
    },

    dogBoneGrid: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.grid[r][c] = KnotGridValues.EMPTY;
            }
        }

        var num_nested = opts.nested_bights;
        var shift_bottom = 2*opts.shift_bottom_bights;
        for(var i = 0; i < num_nested; i++) {
            for(var c = 0; c < this.cols; c += 2*num_nested) {
                var r = 2*i;
                this.grid[r][c] = KnotGridValues.UPPER_BIGHT;
                this.grid[r][c+1] = KnotGridValues.UPPER_BIGHT;

                r = opts.rows-2-(2*i);
                if(i == num_nested-1) {
                    this.grid[r][(c+shift_bottom)%this.cols] = KnotGridValues.X;
                    if(c+1 < this.cols) {
                        this.grid[r][(c+1+shift_bottom)%this.cols] = KnotGridValues.X;
                    }
                } else {
                    this.grid[r][(c+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                    if(c+1 < this.cols) {
                        this.grid[r][(c+1+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                    }
                }
            }

        }

        for(var i = 0; i < num_nested; i++) {
            for(var c = 0; c < this.cols; c += 2*num_nested) {
                var r = this.rows-1-opts.rows+2*i;

                if(i == 0) {
                    this.grid[r][c] = KnotGridValues.X;
                    this.grid[r][c+1] = KnotGridValues.X;
                } else {
                    this.grid[r][c] = KnotGridValues.UPPER_BIGHT;
                    this.grid[r][c+1] = KnotGridValues.UPPER_BIGHT;
                }

                r = this.rows-1-(2*i);
                this.grid[r][(c+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                if(c+1 < this.cols) {
                    this.grid[r][(c+1+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                }
            }

        }
        this.extendStrands();
        this.setInvalid();
    },

    pineappleGrid: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.grid[r][c] = KnotGridValues.EMPTY;
            }
        }

        var num_nested = opts.nested_bights;
        var shift_bottom = 2*opts.shift_bottom_bights;
        for(var i = 0; i < num_nested; i++) {
            for(var c = 0; c < this.cols; c += 2*num_nested) {
                var r = 2*i;
                this.grid[r][c] = KnotGridValues.UPPER_BIGHT;
                this.grid[r][c+1] = KnotGridValues.UPPER_BIGHT;

                r = this.rows-1-(2*i);
                this.grid[r][(c+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                if(c+1 < this.cols) {
                    this.grid[r][(c+1+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                }
            }

        }
        this.extendStrands();
        this.setInvalid();
    },
    bottomPineappleGrid: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.grid[r][c] = KnotGridValues.EMPTY;
            }
        }

        var num_nested = opts.nested_bights;
        var shift_bottom = 2*opts.shift_bottom_bights;
        for(var c = 0; c < this.cols; c+= 2) {
            var r = 0;
            this.grid[r][c] = KnotGridValues.UPPER_BIGHT;
            this.grid[r][c+1] = KnotGridValues.UPPER_BIGHT;
        }

        for(var i = 0; i < num_nested; i++) {
            for(var c = 0; c < this.cols; c += 2*num_nested) {
                r = this.rows-1-(2*i);
                this.grid[r][(c+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                if(c+1 < this.cols) {
                    this.grid[r][(c+1+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                }
            }

        }
        this.extendStrands();
        this.setInvalid();
    },

    pineapplePlantHangerGrid: function(opts) {
        for(var r = 0; r < this.rows; r++) {
            for(var c = 0; c < this.cols; c++) {
                this.grid[r][c] = KnotGridValues.EMPTY;
            }
        }

        var num_nested = opts.nested_bights;
        var shift_bottom = 2*opts.shift_bottom_bights;
        for(var i = 0; i < num_nested; i++) {
            for(var c = 0; c < this.cols; c += 2*num_nested) {
                var r = this.rows-1-(2*i);
                this.grid[r][(c+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                if(c+1 < this.cols) {
                    this.grid[r][(c+1+shift_bottom)%this.cols] = KnotGridValues.LOWER_BIGHT;
                }
            }

        }
        this.extendStrands();
        this.setInvalid();
    },

    removeStrand: function(loc) {
        var walker;

        if(this.isLoop(loc)) {
            walker = new KnotGridWalker(this, loc);
        } else {
            var ends = this.findEnds(loc);
            walker = new KnotGridWalker(this, ends[0]);
        }
        walker.next();
        var cur_loc = walker.getLocation();
        while(walker.next()) {
            var last_loc = cur_loc;
            switch(last_loc.dir) {
                case KnotDirection.UP_RIGHT:
                    switch(this.grid[last_loc.row][last_loc.col]) {
                        case KnotGridValues.X:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.BACKSLASH;
                            break;
                        case KnotGridValues.SLASH:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.BACKSLASH:
                            break;
                        case KnotGridValues.UPPER_BIGHT:
                            break;
                        case KnotGridValues.LOWER_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.LEFT_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.RIGHT_BIGHT:
                            break;
                    }
                    break;
                case KnotDirection.UP_LEFT:
                    switch(this.grid[last_loc.row][last_loc.col]) {
                        case KnotGridValues.X:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.SLASH;
                            break;
                        case KnotGridValues.SLASH:
                            break;
                        case KnotGridValues.BACKSLASH:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.UPPER_BIGHT:
                            break;
                        case KnotGridValues.LOWER_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.LEFT_BIGHT:
                            break;
                        case KnotGridValues.RIGHT_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                    }
                    break;
                case KnotDirection.DOWN_RIGHT:
                    switch(this.grid[last_loc.row][last_loc.col]) {
                        case KnotGridValues.X:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.SLASH;
                            break;
                        case KnotGridValues.SLASH:
                            break;
                        case KnotGridValues.BACKSLASH:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.UPPER_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.LOWER_BIGHT:
                            break;
                        case KnotGridValues.LEFT_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.RIGHT_BIGHT:
                            break;
                    }
                    break;
                case KnotDirection.DOWN_LEFT:
                    switch(this.grid[last_loc.row][last_loc.col]) {
                        case KnotGridValues.X:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.BACKSLASH;
                            break;
                        case KnotGridValues.SLASH:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.BACKSLASH:
                            break;
                        case KnotGridValues.UPPER_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                        case KnotGridValues.LOWER_BIGHT:
                            break;
                        case KnotGridValues.LEFT_BIGHT:
                            break;
                        case KnotGridValues.RIGHT_BIGHT:
                            this.grid[last_loc.row][last_loc.col] = KnotGridValues.EMPTY;
                            break;
                    }
                    break;
            }
            cur_loc = walker.getLocation();
        }
        switch(cur_loc.dir) {
            case KnotDirection.UP_RIGHT:
                switch(this.grid[cur_loc.row][cur_loc.col]) {
                    case KnotGridValues.X:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.BACKSLASH;
                        break;
                    case KnotGridValues.SLASH:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.BACKSLASH:
                        break;
                    case KnotGridValues.UPPER_BIGHT:
                        break;
                    case KnotGridValues.LOWER_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.LEFT_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.RIGHT_BIGHT:
                        break;
                }
                break;
            case KnotDirection.UP_LEFT:
                switch(this.grid[cur_loc.row][cur_loc.col]) {
                    case KnotGridValues.X:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.SLASH;
                        break;
                    case KnotGridValues.SLASH:
                        break;
                    case KnotGridValues.BACKSLASH:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.UPPER_BIGHT:
                        break;
                    case KnotGridValues.LOWER_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.LEFT_BIGHT:
                        break;
                    case KnotGridValues.RIGHT_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                }
                break;
            case KnotDirection.DOWN_RIGHT:
                switch(this.grid[cur_loc.row][cur_loc.col]) {
                    case KnotGridValues.X:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.SLASH;
                        break;
                    case KnotGridValues.SLASH:
                        break;
                    case KnotGridValues.BACKSLASH:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.UPPER_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.LOWER_BIGHT:
                        break;
                    case KnotGridValues.LEFT_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.RIGHT_BIGHT:
                        break;
                }
                break;
            case KnotDirection.DOWN_LEFT:
                switch(this.grid[cur_loc.row][cur_loc.col]) {
                    case KnotGridValues.X:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.BACKSLASH;
                        break;
                    case KnotGridValues.SLASH:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.BACKSLASH:
                        break;
                    case KnotGridValues.UPPER_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                    case KnotGridValues.LOWER_BIGHT:
                        break;
                    case KnotGridValues.LEFT_BIGHT:
                        break;
                    case KnotGridValues.RIGHT_BIGHT:
                        this.grid[cur_loc.row][cur_loc.col] = KnotGridValues.EMPTY;
                        break;
                }
                break;
        }
    },

    getPinMap: function() {
        var map = new PinMap();
        var pinNum = 1;
        var pinLetter = 64; // ascii value
        var m = {
        /*
            67: 68,
            68: 69,
            69: 71,
            70: 72
        */
        };
        for(var r = 0; r < this.rows; r++) {
            var hasBights = false;
            for(var c = -1; c < (this.cols-1); c++) {
                var col = (c+this.cols)%this.cols;
                if(this.isBight(r,col)) {
                    hasBights = true;
                }
            }
            if(hasBights) {
                pinLetter++;
                for(var c = -1; c < (this.cols-1); c++) {
                    var col = (c+this.cols)%this.cols;
                    if(this.isBight(r,col)) {
                        var pin;
                        if(m[pinLetter]) {
                            pin = String.fromCharCode(m[pinLetter])+pinNum;
                        } else {
                            pin = String.fromCharCode(pinLetter)+pinNum;
                        }
                        pinNum++;
                        map.setPin(pin, r,col);
                    }
                }
            }
            pinNum = 1;
        }

        return map;
    },
};
