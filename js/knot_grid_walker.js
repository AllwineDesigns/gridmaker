KnotDirection = {
    UP_RIGHT: "UP_RIGHT",
    UP_LEFT: "UP_LEFT",
    DOWN_RIGHT: "DOWN_RIGHT",
    DOWN_LEFT: "DOWN_LEFT"
};

function flipHorizontalDirection(dir) {
    switch(dir) {
        case KnotDirection.UP_RIGHT:
            return KnotDirection.UP_LEFT;
        case KnotDirection.UP_LEFT:
            return KnotDirection.UP_RIGHT;
        case KnotDirection.DOWN_RIGHT:
            return KnotDirection.DOWN_LEFT;
        case KnotDirection.DOWN_LEFT:
            return KnotDirection.DOWN_RIGHT;
    }
}
function flipVerticalDirection(dir) {
    switch(dir) {
        case KnotDirection.UP_RIGHT:
            return KnotDirection.DOWN_RIGHT;
        case KnotDirection.UP_LEFT:
            return KnotDirection.DOWN_LEFT;
        case KnotDirection.DOWN_RIGHT:
            return KnotDirection.UP_RIGHT;
        case KnotDirection.DOWN_LEFT:
            return KnotDirection.UP_LEFT;
    }
}

function flipDirection(dir, grid_value) {
    if(grid_value) {
        switch(grid_value) {
            case KnotGridValues.UPPER_BIGHT:
            case KnotGridValues.LOWER_BIGHT:
            case KnotGridValues.VERTICAL_BIGHTS:
                return flipHorizontalDirection(dir);
            case KnotGridValues.LEFT_BIGHT:
            case KnotGridValues.RIGHT_BIGHT:
            case KnotGridValues.HORIZONTAL_BIGHTS:
                return flipVerticalDirection(dir);
        }
    }

    switch(dir) {
        case KnotDirection.UP_RIGHT:
            return KnotDirection.DOWN_LEFT;
        case KnotDirection.DOWN_LEFT:
            return KnotDirection.UP_RIGHT;
        case KnotDirection.UP_LEFT:
            return KnotDirection.DOWN_RIGHT;
        case KnotDirection.DOWN_RIGHT:
            return KnotDirection.UP_LEFT;
    }
}

ValidKnotDirections = {};
ValidKnotDirections[KnotGridValues.X] = [ KnotDirection.DOWN_RIGHT, KnotDirection.UP_LEFT, KnotDirection.DOWN_LEFT, KnotDirection.UP_RIGHT ];
ValidKnotDirections[KnotGridValues.SLASH] = [ KnotDirection.DOWN_LEFT, KnotDirection.UP_RIGHT ];
ValidKnotDirections[KnotGridValues.BACKSLASH] = [ KnotDirection.DOWN_RIGHT, KnotDirection.UP_LEFT ];
ValidKnotDirections[KnotGridValues.UPPER_BIGHT] = [ KnotDirection.DOWN_RIGHT, KnotDirection.DOWN_LEFT ];
ValidKnotDirections[KnotGridValues.LOWER_BIGHT] = [ KnotDirection.UP_RIGHT, KnotDirection.UP_LEFT ];
ValidKnotDirections[KnotGridValues.LEFT_BIGHT] = [ KnotDirection.UP_RIGHT, KnotDirection.DOWN_RIGHT ];
ValidKnotDirections[KnotGridValues.RIGHT_BIGHT] = [ KnotDirection.DOWN_LEFT, KnotDirection.UP_LEFT ];
ValidKnotDirections[KnotGridValues.VERTICAL_BIGHTS] = [ KnotDirection.DOWN_RIGHT, KnotDirection.UP_LEFT, KnotDirection.DOWN_LEFT, KnotDirection.UP_RIGHT ];
ValidKnotDirections[KnotGridValues.HORIZONTAL_BIGHTS] = [ KnotDirection.DOWN_RIGHT, KnotDirection.UP_LEFT, KnotDirection.DOWN_LEFT, KnotDirection.UP_RIGHT ];

function getValidKnotDirections(knot_value) {
    switch(knot_value) {
        case KnotGridValues.X:
        case KnotGridValues.SLASH:
        case KnotGridValues.BACKSLASH:
        case KnotGridValues.UPPER_BIGHT:
        case KnotGridValues.LOWER_BIGHT:
        case KnotGridValues.LEFT_BIGHT:
        case KnotGridValues.RIGHT_BIGHT:
        case KnotGridValues.VERTICAL_BIGHTS:
        case KnotGridValues.HORIZONTAL_BIGHTS:
            return ValidKnotDirections[knot_value];
        default:
            return 0;
    }
}

function getDefaultKnotDirection(knot_value) {
    switch(knot_value) {
        case KnotGridValues.X:
            return KnotDirection.DOWN_RIGHT;
        case KnotGridValues.SLASH:
            return KnotDirection.DOWN_LEFT;
        case KnotGridValues.BACKSLASH:
            return KnotDirection.DOWN_RIGHT;
        case KnotGridValues.UPPER_BIGHT:
            return KnotDirection.DOWN_RIGHT;
        case KnotGridValues.LOWER_BIGHT:
            return KnotDirection.UP_RIGHT;
        case KnotGridValues.LEFT_BIGHT:
            return KnotDirection.UP_RIGHT;
        case KnotGridValues.RIGHT_BIGHT:
            return KnotDirection.DOWN_LEFT;
        case KnotGridValues.VERTICAL_BIGHTS:
            return KnotDirection.DOWN_RIGHT;
        case KnotGridValues.HORIZONTAL_BIGHTS:
            return KnotDirection.DOWN_RIGHT;
        default:
            return 0;
    }
}

function KnotLocation(r, c, d) {
    this.row = r;
    this.col = c;
    this.dir = d;
}

KnotLocation.prototype = {
    equals: function(loc) {
        return this.row == loc.row && this.col == loc.col && this.dir == loc.dir;
    },
    toString: function() {
        return "[" + this.row + ", " + this.col + ": " + this.dir + "]";
    },
    getNextLocation: function(next_loc) {
        next_loc.dir = this.dir;
        switch(this.dir) {
            case KnotDirection.UP_LEFT:
                next_loc.row = this.row-1;
                next_loc.col = this.col-1;
                break;
            case KnotDirection.UP_RIGHT:
                next_loc.row = this.row-1;
                next_loc.col = this.col+1;
                break;
            case KnotDirection.DOWN_LEFT:
                next_loc.row = this.row+1;
                next_loc.col = this.col-1;
                break;
            case KnotDirection.DOWN_RIGHT:
                next_loc.row = this.row+1;
                next_loc.col = this.col+1;
                break;
        }
    }
};

function KnotGridWalker(grid, loc) {
    this.grid = grid;
    this.start_loc = new KnotLocation(loc.row, loc.col, loc.dir);
    this.cur_loc = new KnotLocation(loc.row, loc.col, loc.dir);
    this.looped = false;
    this.started = false;
}

function isValidDirection(value, dir) {
    switch(dir) {
        case KnotDirection.UP_RIGHT:
            return (value == KnotGridValues.SLASH ||
                    value == KnotGridValues.LOWER_BIGHT ||
                    value == KnotGridValues.X ||
                    value == KnotGridValues.LEFT_BIGHT ||
                    value == KnotGridValues.HORIZONTAL_BIGHTS ||
                    value == KnotGridValues.VERTICAL_BIGHTS)
        case KnotDirection.UP_LEFT:
            return (value == KnotGridValues.BACKSLASH ||
                    value == KnotGridValues.LOWER_BIGHT ||
                    value == KnotGridValues.X ||
                    value == KnotGridValues.RIGHT_BIGHT ||
                    value == KnotGridValues.VERTICAL_BIGHTS ||
                    value == KnotGridValues.HORIZONTAL_BIGHTS)
        case KnotDirection.DOWN_RIGHT:
            return (value == KnotGridValues.BACKSLASH ||
                    value == KnotGridValues.UPPER_BIGHT ||
                    value == KnotGridValues.X ||
                    value == KnotGridValues.LEFT_BIGHT ||
                    value == KnotGridValues.VERTICAL_BIGHTS ||
                    value == KnotGridValues.HORIZONTAL_BIGHTS)
        case KnotDirection.DOWN_LEFT:
            return (value == KnotGridValues.SLASH ||
                    value == KnotGridValues.UPPER_BIGHT ||
                    value == KnotGridValues.X ||
                    value == KnotGridValues.RIGHT_BIGHT ||
                    value == KnotGridValues.VERTICAL_BIGHTS ||
                    value == KnotGridValues.HORIZONTAL_BIGHTS)
    }
}

function canGoUpRight(value) {
    switch(value) {
        case KnotGridValues.X:
        case KnotGridValues.SLASH:
        case KnotGridValues.LOWER_BIGHT:
        case KnotGridValues.LEFT_BIGHT:
        case KnotGridValues.HORIZONTAL_BIGHTS:
        case KnotGridValues.VERTICAL_BIGHTS:
            return true;
    }
    return false;
}
function canGoDownRight(value) {
    switch(value) {
        case KnotGridValues.X:
        case KnotGridValues.BACKSLASH:
        case KnotGridValues.UPPER_BIGHT:
        case KnotGridValues.LEFT_BIGHT:
        case KnotGridValues.HORIZONTAL_BIGHTS:
        case KnotGridValues.VERTICAL_BIGHTS:
            return true;
    }
    return false;
}
function canGoDownLeft(value) {
    switch(value) {
        case KnotGridValues.X:
        case KnotGridValues.SLASH:
        case KnotGridValues.UPPER_BIGHT:
        case KnotGridValues.RIGHT_BIGHT:
        case KnotGridValues.HORIZONTAL_BIGHTS:
        case KnotGridValues.VERTICAL_BIGHTS:
            return true;
    }
    return false;
}
function canGoUpLeft(value) {
    switch(value) {
        case KnotGridValues.X:
        case KnotGridValues.BACKSLASH:
        case KnotGridValues.LOWER_BIGHT:
        case KnotGridValues.RIGHT_BIGHT:
        case KnotGridValues.HORIZONTAL_BIGHTS:
        case KnotGridValues.VERTICAL_BIGHTS:
            return true;
    }
    return false;
}

KnotGridWalker.prototype = {
    next: function() {
        var rows = this.grid.rows;
        var cols = this.grid.cols;

        var ret = true;
        var next_row;
        var next_col;
        var next_dir;

        if(!this.started) {
            this.started = true;
            return true;
        } else {
            switch(this.cur_loc.dir) {
                case KnotDirection.UP_RIGHT:
                    if(!canGoUpRight(this.grid.grid[this.cur_loc.row][this.cur_loc.col])) {
                        throw "Can't go up right: '" + this.grid.grid[this.cur_loc.row][this.cur_loc.col] + "'";
                    }
                    if(this.grid.rows_wrap) {
                        next_row = (this.cur_loc.row-1+rows)%rows;
                    } else {
                        next_row = this.cur_loc.row-1;
                    }
                    if(this.grid.cols_wrap) {
                        next_col = (this.cur_loc.col+1)%cols;
                    } else {
                        next_col = this.cur_loc.col+1;
                    }
                    break;
                case KnotDirection.UP_LEFT:
                    if(!canGoUpLeft(this.grid.grid[this.cur_loc.row][this.cur_loc.col])) {
                        throw "Can't go up left: '" + this.grid.grid[this.cur_loc.row][this.cur_loc.col] + "'";
                    }
                    if(this.grid.rows_wrap) {
                        next_row = (this.cur_loc.row-1+rows)%rows;
                    } else {
                        next_row = this.cur_loc.row-1;
                    }
                    if(this.grid.cols_wrap) {
                        next_col = (this.cur_loc.col-1+cols)%cols;
                    } else {
                        next_col = this.cur_loc.col-1;
                    }
                    break;
                case KnotDirection.DOWN_RIGHT:
                    if(!canGoDownRight(this.grid.grid[this.cur_loc.row][this.cur_loc.col])) {
                        throw "Can't go down right: '" + this.grid.grid[this.cur_loc.row][this.cur_loc.col] + "'";
                    }
                    if(this.grid.rows_wrap) {
                        next_row = (this.cur_loc.row+1)%rows;
                    } else {
                        next_row = this.cur_loc.row+1;
                    }
                    if(this.grid.cols_wrap) {
                        next_col = (this.cur_loc.col+1)%cols;
                    } else {
                        next_col = this.cur_loc.col+1;
                    }
                    break;
                case KnotDirection.DOWN_LEFT:
                    if(!canGoDownLeft(this.grid.grid[this.cur_loc.row][this.cur_loc.col])) {
                        throw "Can't go down left: '" + this.grid.grid[this.cur_loc.row][this.cur_loc.col] + "'";
                    }
                    if(this.grid.rows_wrap) {
                        next_row = (this.cur_loc.row+1)%rows;
                    } else {
                        next_row = this.cur_loc.row+1;
                    }
                    if(this.grid.cols_wrap) {
                        next_col = (this.cur_loc.col-1+cols)%cols;
                    } else {
                        next_col = this.cur_loc.col-1;
                    }
                    break;
            }

            if(next_row >= 0 && next_row < rows && next_col >= 0 && next_col < cols) {
                switch(this.cur_loc.dir) {
                    case KnotDirection.UP_RIGHT:
                        switch(this.grid.grid[next_row][next_col]) {
                            case KnotGridValues.EMPTY:
                                ret = false;
                                break;
                            case KnotGridValues.X:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.SLASH:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.BACKSLASH:
                                ret = false;
                                break;
                            case KnotGridValues.UPPER_BIGHT:
                                next_dir = KnotDirection.DOWN_RIGHT;
                                break;
                            case KnotGridValues.LOWER_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.LEFT_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.RIGHT_BIGHT:
                                next_dir = KnotDirection.UP_LEFT;
                                break;
                            case KnotGridValues.HORIZONTAL_BIGHTS:
                                next_dir = KnotDirection.UP_LEFT;
                                break;
                            case KnotGridValues.VERTICAL_BIGHTS:
                                next_dir = KnotDirection.DOWN_RIGHT;
                                break;
                        }
                        break;
                    case KnotDirection.UP_LEFT:
                        switch(this.grid.grid[next_row][next_col]) {
                            case KnotGridValues.EMPTY:
                                ret = false;
                                break;
                            case KnotGridValues.X:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.SLASH:
                                ret = false;
                                break;
                            case KnotGridValues.BACKSLASH:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.UPPER_BIGHT:
                                next_dir = KnotDirection.DOWN_LEFT;
                                break;
                            case KnotGridValues.LOWER_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.LEFT_BIGHT:
                                next_dir = KnotDirection.UP_RIGHT;
                                break;
                            case KnotGridValues.RIGHT_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.VERTICAL_BIGHTS:
                                next_dir = KnotDirection.DOWN_LEFT;
                                break;
                            case KnotGridValues.HORIZONTAL_BIGHTS:
                                next_dir = KnotDirection.UP_RIGHT;
                                break;
                        }
                        break;
                    case KnotDirection.DOWN_RIGHT:
                        switch(this.grid.grid[next_row][next_col]) {
                            case KnotGridValues.EMPTY:
                                ret = false;
                                break;
                            case KnotGridValues.X:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.SLASH:
                                ret = false;
                                break;
                            case KnotGridValues.BACKSLASH:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.UPPER_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.LOWER_BIGHT:
                                next_dir = KnotDirection.UP_RIGHT;
                                break;
                            case KnotGridValues.LEFT_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.RIGHT_BIGHT:
                                next_dir = KnotDirection.DOWN_LEFT;
                                break;
                            case KnotGridValues.VERTICAL_BIGHTS:
                                next_dir = KnotDirection.UP_RIGHT;
                                break;
                            case KnotGridValues.HORIZONTAL_BIGHTS:
                                next_dir = KnotDirection.DOWN_LEFT;
                                break;
                        }
                        break;
                    case KnotDirection.DOWN_LEFT:
                        switch(this.grid.grid[next_row][next_col]) {
                            case KnotGridValues.EMPTY:
                                ret = false;
                                break;
                            case KnotGridValues.X:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.SLASH:
                                next_dir = this.cur_loc.dir;
                                break;
                            case KnotGridValues.BACKSLASH:
                                ret = false;
                                break;
                            case KnotGridValues.UPPER_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.LOWER_BIGHT:
                                next_dir = KnotDirection.UP_LEFT;
                                break;
                            case KnotGridValues.LEFT_BIGHT:
                                next_dir = KnotDirection.DOWN_RIGHT;
                                break;
                            case KnotGridValues.RIGHT_BIGHT:
                                ret = false;
                                break;
                            case KnotGridValues.VERTICAL_BIGHTS:
                                next_dir = KnotDirection.UP_LEFT;
                                break;
                            case KnotGridValues.HORIZONTAL_BIGHTS:
                                next_dir = KnotDirection.DOWN_RIGHT;
                                break;
                        }
                        break;
                }
                if(ret) {
                    if(next_row == this.start_loc.row && 
                        next_col == this.start_loc.col &&
                        next_dir == this.start_loc.dir) {
                        ret = false;
                        this.cur_loc.row = this.start_loc.row;
                        this.cur_loc.col = this.start_loc.col;
                        this.cur_loc.dir = this.start_loc.dir;
                        this.looped = true;
                    } else {
                        this.cur_loc.row = next_row;
                        this.cur_loc.col = next_col;
                        this.cur_loc.dir = next_dir;
                    }
                } 
            } else {
                ret = false;
            }
        }
        return ret;
    },

    isOnBight: function() {
        return this.grid.isBight(this.cur_loc.row, this.cur_loc.col);
    },

    isOnCrossing: function() {
        return this.grid.isCrossing(this.cur_loc.row,this.cur_loc.col);
    },

    isOver: function() {
        return this.grid.isOver(this.cur_loc);
    },

    isUnder: function() {
        return !this.isOver();
    },

    getLocation: function() {
        return new KnotLocation(this.cur_loc.row, this.cur_loc.col, this.cur_loc.dir);
    },

    getStartLocation: function() {
        return new KnotLocation(this.start_loc.row, this.start_loc.col, this.start_loc.dir);
    },

    returnedToStart: function() {
        return this.looped;
    }
};
