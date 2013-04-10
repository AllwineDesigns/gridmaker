/* knot_canvas.js by John Allwine jallwine86@yahoo.com
 *
 * Copyright (c) 2008 John Allwine
 *
 */

function KnotCanvas(id) {
    this.init(id)
}

KnotCanvas.prototype = {
    init: function(id) {
        this.element = $(id);
    },

    setController: function(controller) {
        this.controller = controller;
    },

    getPosition: function() {
        return getElementPosition(this.element);
    },

    getSize: function() {
        return {
            width: this.element.width,
            height: this.element.height
        };
    },

    getRelativeCoordinates: function(page_coords) {
        var pos = this.getPosition();

        return {
            x: page_coords.x-pos.x,
            y: page_coords.y-pos.y
        };
    },

    resize: function(width, height) {
        this.element.width = width;
        this.element.height = height;
    },

    quickrender: function() {
        var grid = this.controller.getKnotGrid();

        var ctx = this.element.getContext("2d");
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0, this.element.width, this.element.height);
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";

        for(var r = 0; r < grid.rows; r++) {
            for(var c = 0; c < grid.cols; c++) {
                if(grid.grid[r][c] != KnotGridValues.INVALID) {
                    this.drawPoint(ctx, r,c);
                }
            }
        }
        ctx.restore();
    },

    render: function() {
        this.calcVars();
        var grid = this.controller.getKnotGrid();

        var ctx = this.element.getContext("2d");
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0, this.element.width, this.element.height);

//        ctx.fillStyle = "#000000";
//        for(var r = 0; r < grid.rows; r++) {
//            for(var c = 0; c < grid.cols; c++) {
//                if(grid.grid[r][c] != KnotGridValues.INVALID) {
//                    this.drawPoint(ctx, r,c);
//                }
//            }
//        }

        var start_row;
        var end_row;
        var start_col;
        var end_col;
        if(grid.cols_wrap) {
            start_col = -2;
            end_col = grid.cols+1;
        } else {
            start_col = 0;
            end_col = grid.cols-1;
        }
        if(grid.rows_wrap) {
            start_row = -2;
            end_row = grid.rows+1;
        } else {
            start_row = 0;
            end_row = grid.rows-1;
        }
        if(this.controller.show_grid_points) {
            this.quickrender();
        }
        for(var row = start_row; row <= end_row; row++) {
            for(var col = start_col; col <= end_col; col++) {
                var r;
                var c;
                if(grid.cols_wrap) {
                    c = (col+grid.cols)%grid.cols; 
                } else {
                    c = col;
                }
                if(grid.rows_wrap) {
                    r = (row+grid.rows)%grid.rows; 
                } else {
                    r = row;
                }
                colors = this.controller.getColors(r,c);
                if(grid.grid[r][c] == KnotGridValues.X) {
                    if(grid.coding[r][c] == CodingValues.O) {
                        this.drawUnderSlash(ctx, row,col,colors);
//                        this.drawBackSlash(ctx, row,col,colors);
                    } else {
                        this.drawUnderBackSlash(ctx, row,col,colors);
//                        this.drawSlash(ctx, row,col,colors);
                    }
                } else if(grid.grid[r][c] == KnotGridValues.SLASH) {
//                    this.drawSlash(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.BACKSLASH) {
//                    this.drawBackSlash(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.UPPER_BIGHT) {
//                    this.drawUpperBight(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.LOWER_BIGHT) {
//                    this.drawLowerBight(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.RIGHT_BIGHT) {
//                    this.drawRightBight(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.LEFT_BIGHT) {
//                    this.drawLeftBight(ctx, row,col,colors);
                }
            }
        }
        for(var row = start_row; row <= end_row; row++) {
            for(var col = start_col; col <= end_col; col++) {
                var r;
                var c;
                if(grid.cols_wrap) {
                    c = (col+grid.cols)%grid.cols; 
                } else {
                    c = col;
                }
                if(grid.rows_wrap) {
                    r = (row+grid.rows)%grid.rows; 
                } else {
                    r = row;
                }
                colors = this.controller.getColors(r,c);
                if(grid.grid[r][c] == KnotGridValues.X) {
                    if(grid.coding[r][c] == CodingValues.O) {
//                        this.drawUnderSlash(ctx, row,col,colors);
                        this.drawBackSlash(ctx, row,col,colors);
                    } else {
//                        this.drawUnderBackSlash(ctx, row,col,colors);
                        this.drawSlash(ctx, row,col,colors);
                    }
                } else if(grid.grid[r][c] == KnotGridValues.SLASH) {
                    this.drawSlash(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.BACKSLASH) {
                    this.drawBackSlash(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.UPPER_BIGHT) {
                    this.drawUpperBight(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.LOWER_BIGHT) {
                    this.drawLowerBight(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.RIGHT_BIGHT) {
                    this.drawRightBight(ctx, row,col,colors);
                } else if(grid.grid[r][c] == KnotGridValues.LEFT_BIGHT) {
                    this.drawLeftBight(ctx, row,col,colors);
                }
            }
        }
        if(this.controller.show_pins) {
//            var instructions = new KnotInstructions(grid, grid.getDefaultStartLocations());
            var instructions = this.controller.instructions;
            var pinmap;
            if(this.controller.do_letter_pins) {
                pinmap = grid.getPinMap();
            } else {
                pinmap = instructions.getPinMap();
            }

            var start_locs = grid.getValidStartLocations();
            for(var row = start_row; row <= end_row; row++) {
                for(var col = start_col; col <= end_col; col++) {
                    var is_start_loc = false;
                    for(var i = 0; i < start_locs.length; i++) {
                        var start_loc = start_locs[i];
                        if(start_loc.row == row && start_loc.col == col) {
                            is_start_loc = true;
                        }
                    }
                    if(grid.isBight(row,col) || is_start_loc) {
                        ctx.fillStyle = "black";
                        var P = this.grid2coords(row,col);
                        if(row == 0) {
                            ctx.fillText(pinmap.getPin(row,col), P.x-5, P.y-5);
                        } else if(row == grid.rows-1) {
                            ctx.fillText(pinmap.getPin(row,col), P.x-5, P.y+15);
                        } else {
                            ctx.fillText(pinmap.getPin(row,col), P.x-5, P.y+5);
                        }
                    }
                }
            }
        }

//        var coords = this.controller.getLastCoords();
//        var str = "" + Math.floor(coords.x) + ", " + Math.floor(coords.y) + " " + this.controller.body.style.cursor;
//        var str = "" + grid.rows + ", " + grid.cols;
//        ctx.fillText(str, coords.x,coords.y);

        var cursor_row = this.controller.cursor_row;
        var cursor_col = this.controller.cursor_col;
        if(cursor_row != -1 && cursor_col != -1) {
            switch(this.controller.click_mode) {
                case KnotCanvasClickMode.TOGGLE_CODING:
                case KnotCanvasClickMode.SET_OVER:
                case KnotCanvasClickMode.SET_UNDER:
                case KnotCanvasClickMode.SET_BRUSH:
                    break;
                default:
                    this.drawSlash(ctx, cursor_row, cursor_col, {
                        over: 'white',
                        outline: 'white'
                    });
                    this.drawBackSlash(ctx, cursor_row, cursor_col, {
                        over: 'white',
                        outline: 'white'
                    });
            }
            switch(this.controller.click_mode) {
                case KnotCanvasClickMode.SET_UPPER_BIGHT:
                    this.drawUpperBight(ctx, cursor_row, cursor_col, {
                        outline: 'white',
                        over: 'yellow',
                        shadow: 'yellow'
                    });
                    break;
                case KnotCanvasClickMode.SET_LOWER_BIGHT:
                    this.drawLowerBight(ctx, cursor_row, cursor_col, {
                        outline: 'white',
                        over: 'yellow',
                        shadow: 'yellow'
                    });
                    break;
                case KnotCanvasClickMode.SET_LEFT_BIGHT:
                    this.drawLeftBight(ctx, cursor_row, cursor_col, {
                        outline: 'white',
                        over: 'yellow',
                        shadow: 'yellow'
                    });
                    break;
                case KnotCanvasClickMode.SET_RIGHT_BIGHT:
                    this.drawRightBight(ctx, cursor_row, cursor_col, {
                        outline: 'white',
                        over: 'yellow',
                        shadow: 'yellow'
                    });
                    break;
                case KnotCanvasClickMode.SET_SLASH:
                    this.drawSlash(ctx, cursor_row, cursor_col, {
                        outline: 'white',
                        over: 'yellow',
                        shadow: 'yellow'
                    });
                    break;
                case KnotCanvasClickMode.SET_BACKSLASH:
                    this.drawBackSlash(ctx, cursor_row, cursor_col, {
                        outline: 'white',
                        over: 'yellow',
                        shadow: 'yellow'
                    });
                    break;
                case KnotCanvasClickMode.SET_X:
                    if(this.controller.grid.coding[cursor_row][cursor_col] == CodingValues.O) {
                        this.drawUnderSlash(ctx, cursor_row, cursor_col, {
                            outline: 'white',
                            over: 'yellow',
                            under: 'green',
                            shadow: 'green'
                        });
                        this.drawBackSlash(ctx, cursor_row, cursor_col, {
                            outline: 'white',
                            over: 'yellow',
                            under: 'green',
                            shadow: 'green'
                        });
                    } else {
                        this.drawUnderBackSlash(ctx, cursor_row, cursor_col, {
                            outline: 'white',
                            over: 'yellow',
                            under: 'green',
                            shadow: 'green'
                        });
                        this.drawSlash(ctx, cursor_row, cursor_col, {
                            outline: 'white',
                            over: 'yellow',
                            under: 'green',
                            shadow: 'green'
                        });
                    }
                    break;
                case KnotCanvasClickMode.SET_BRUSH:
                    var brush = this.controller.brush.brush;
                    for(var r = 0; r < brush.length; r++) {
                        for(var c = 0; c < brush[r].length; c++) {
                            var row = r+cursor_row;
                            if(this.controller.grid.rows_wrap) {
                                row = row%this.controller.grid.rows;
                            }
                            var col = c+cursor_col;
                            if(this.controller.grid.cols_wrap) {
                                col = col%this.controller.grid.cols;
                            }

                            if(row < this.controller.grid.rows && col < this.controller.grid.cols) {
                                if(brush[r][c] != KnotGridValues.INVALID) {
                                    this.drawSlash(ctx, row, col, {
                                        over: 'white',
                                        outline: 'white'
                                    });
                                    this.drawBackSlash(ctx, row, col, {
                                        over: 'white',
                                        outline: 'white'
                                    });
                                }
                                switch(brush[r][c]) {
                                    case KnotGridValues.X:
                                        if(this.controller.grid.coding[cursor_row][cursor_col] == CodingValues.O) {
                                            this.drawUnderSlash(ctx, row, col, {
                                                outline: 'white',
                                                over: 'yellow',
                                                under: 'green',
                                                shadow: 'green'
                                            });
                                            this.drawBackSlash(ctx, row, col, {
                                                outline: 'white',
                                                over: 'yellow',
                                                under: 'green',
                                                shadow: 'green'
                                            });
                                        } else {
                                            this.drawUnderBackSlash(ctx, row, col, {
                                                outline: 'white',
                                                over: 'yellow',
                                                under: 'green',
                                                shadow: 'green'
                                            });
                                            this.drawSlash(ctx, row, col, {
                                                outline: 'white',
                                                over: 'yellow',
                                                under: 'green',
                                                shadow: 'green'
                                            });
                                        }
                                        break;
                                    case KnotGridValues.BACKSLASH:
                                        this.drawBackSlash(ctx, row, col, {
                                            outline: 'white',
                                            over: 'yellow',
                                            shadow: 'yellow'
                                        });
                                        break;
                                    case KnotGridValues.SLASH:
                                        this.drawSlash(ctx, row, col, {
                                            outline: 'white',
                                            over: 'yellow',
                                            shadow: 'yellow'
                                        });
                                        break;
                                    case KnotGridValues.UPPER_BIGHT:
                                        this.drawUpperBight(ctx, row, col, {
                                            outline: 'white',
                                            over: 'yellow',
                                            shadow: 'yellow'
                                        });
                                        break;
                                    case KnotGridValues.LOWER_BIGHT:
                                        this.drawLowerBight(ctx, row, col, {
                                            outline: 'white',
                                            over: 'yellow',
                                            shadow: 'yellow'
                                        });
                                        break;
                                    case KnotGridValues.LEFT_BIGHT:
                                        this.drawLeftBight(ctx, row, col, {
                                            outline: 'white',
                                            over: 'yellow',
                                            shadow: 'yellow'
                                        });
                                        break;
                                    case KnotGridValues.RIGHT_BIGHT:
                                        this.drawRightBight(ctx, row, col, {
                                            outline: 'white',
                                            over: 'yellow',
                                            shadow: 'yellow'
                                        });
                                        break;
                                }
                            }
                        }
                    }
                default:
                    //this.drawPoint(ctx, cursor_row, cursor_col);
            }
        }
        ctx.restore();
    },

    drawPoint: function(ctx, r,c) {
        var coords = this.grid2coords(r,c);

        ctx.fillRect(coords.x-.5,coords.y-.5, 1, 1);
    },
    drawBox: function(ctx, r,c, width,height) {
        var coords = this.grid2coords(r,c);

        ctx.fillRect(coords.x-width/2,coords.y-height/2, width, height);
    },

    grid2coords: function(r,c) {
        var padding = this.controller.padding;
        var spacing = this.controller.grid_spacing;
        var strand_width = this.controller.strand_width;

        var x;
        var y;

        if(this.cols_wrap) {
            x = padding.x+(c+.5)*spacing.col;
        } else {
            x = padding.x+.5*strand_width+c*spacing.col;
        }

        if(this.rows_wrap) {
            y = padding.y+(r+.5)*spacing.row;
        } else {
            y = padding.y+.5*strand_width+r*spacing.row;
        }

        return {
            x: x,
            y: y
        };
    },

    calcVars: function() {
        this.vars = {};
        this.vars.tantheta = this.controller.grid_spacing.col/this.controller.grid_spacing.row;
        this.vars.theta = Math.atan(this.vars.tantheta);
        this.vars.sintheta = Math.sin(this.vars.theta);
        this.vars.costheta = Math.cos(this.vars.theta);
        this.vars.s = this.controller.strand_width;
        this.vars.a = this.vars.s/(4*this.vars.sintheta);
        this.vars.b = this.vars.a*this.vars.tantheta;
        this.vars.halfcol = this.controller.grid_spacing.col*.5;
        this.vars.halfrow = this.controller.grid_spacing.row*.5;
//        this.vars.t = this.controller.shadow_ratio;
        this.vars.d = this.controller.shadow_width/(2*this.vars.costheta);
        this.vars.e = this.vars.d/this.vars.tantheta;

        this.vars.f = 1/(2*this.vars.costheta);
        this.vars.g = this.vars.f/this.vars.tantheta;
    },

    drawSlash: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x+this.vars.halfcol;
        var My = P.y-this.vars.halfrow;

        var Nx = P.x-this.vars.halfcol;
        var Ny = P.y+this.vars.halfrow;

        var x1 = Mx-this.vars.b+this.vars.f;
        var y1 = My-this.vars.a-this.vars.g;

        var x2 = Mx+this.vars.b+this.vars.f;
        var y2 = My+this.vars.a-this.vars.g;

        var x3 = Nx+this.vars.b-this.vars.f;
        var y3 = Ny+this.vars.a+this.vars.g;

        var x4 = Nx-this.vars.b-this.vars.f;
        var y4 = Ny-this.vars.a+this.vars.g;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.over;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x4,y4);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x4,y4);
        ctx.stroke();

        ctx.restore();
    },

    drawUnderSlash: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x+this.vars.halfcol;
        var My = P.y-this.vars.halfrow;

        var Nx = P.x-this.vars.halfcol;
        var Ny = P.y+this.vars.halfrow;

        var x1 = Mx-this.vars.b+this.vars.f;
        var y1 = My-this.vars.a-this.vars.g;

        var x2 = Mx+this.vars.b+this.vars.f;
        var y2 = My+this.vars.a-this.vars.g;

        var x3 = Nx+this.vars.b-this.vars.f;
        var y3 = Ny+this.vars.a+this.vars.g;

        var x4 = Nx-this.vars.b-this.vars.f;
        var y4 = Ny-this.vars.a+this.vars.g;


        var Qx = P.x;
        var Qy = P.y-2*this.vars.a;

        var Rx = P.x+2*this.vars.b;
        var Ry = P.y;

        var Sx = P.x;
        var Sy = P.y+2*this.vars.a;

        var Tx = P.x-2*this.vars.b;
        var Ty = P.y;

        var x5 = Qx+this.vars.d;
        var y5 = Qy-this.vars.e;

        var x6 = Rx+this.vars.d;
        var y6 = Ry-this.vars.e;

        var x7 = Sx-this.vars.d;
        var y7 = Sy+this.vars.e;

        var x8 = Tx-this.vars.d;
        var y8 = Ty+this.vars.e;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.under;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x4,y4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colors.shadow;
        ctx.beginPath();
        ctx.moveTo(x5, y5);
        ctx.lineTo(x6,y6);
        ctx.lineTo(x7,y7);
        ctx.lineTo(x8,y8);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x4,y4);
        ctx.stroke();

        ctx.restore();
    },

    drawUnderBackSlash: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x+this.vars.halfcol;
        var My = P.y+this.vars.halfrow;

        var Nx = P.x-this.vars.halfcol;
        var Ny = P.y-this.vars.halfrow;

        var x1 = Mx+this.vars.b+this.vars.f;
        var y1 = My-this.vars.a+this.vars.g;

        var x2 = Mx-this.vars.b+this.vars.f;
        var y2 = My+this.vars.a+this.vars.g;

        var x3 = Nx-this.vars.b-this.vars.f;
        var y3 = Ny+this.vars.a-this.vars.g;

        var x4 = Nx+this.vars.b-this.vars.f;
        var y4 = Ny-this.vars.a-this.vars.g;

        var Qx = P.x+2*this.vars.b;
        var Qy = P.y;

        var Rx = P.x;
        var Ry = P.y+2*this.vars.a;

        var Sx = P.x-2*this.vars.b;
        var Sy = P.y;

        var Tx = P.x;
        var Ty = P.y-2*this.vars.a;

        var x5 = Qx+this.vars.d;
        var y5 = Qy+this.vars.e;

        var x6 = Rx+this.vars.d;
        var y6 = Ry+this.vars.e;

        var x7 = Sx-this.vars.d;
        var y7 = Sy-this.vars.e;

        var x8 = Tx-this.vars.d;
        var y8 = Ty-this.vars.e;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.under;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x4,y4);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colors.shadow;
        ctx.beginPath();
        ctx.moveTo(x5, y5);
        ctx.lineTo(x6,y6);
        ctx.lineTo(x7,y7);
        ctx.lineTo(x8,y8);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x4,y4);
        ctx.stroke();

        ctx.restore();
    },

    drawBackSlash: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x+this.vars.halfcol;
        var My = P.y+this.vars.halfrow;

        var Nx = P.x-this.vars.halfcol;
        var Ny = P.y-this.vars.halfrow;

        var x1 = Mx+this.vars.b+this.vars.f;
        var y1 = My-this.vars.a+this.vars.g;

        var x2 = Mx-this.vars.b+this.vars.f;
        var y2 = My+this.vars.a+this.vars.g;

        var x3 = Nx-this.vars.b-this.vars.f;
        var y3 = Ny+this.vars.a-this.vars.g;

        var x4 = Nx+this.vars.b-this.vars.f;
        var y4 = Ny-this.vars.a-this.vars.g;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.over;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.lineTo(x4,y4);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x3,y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x4,y4);
        ctx.stroke();

        ctx.restore();
    },
    drawUpperBight: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x-this.vars.halfcol;
        var My = P.y+this.vars.halfrow;

        var Nx = P.x+this.vars.halfcol;
        var Ny = P.y+this.vars.halfrow;

        var x1 = Mx-this.vars.b-this.vars.f;
        var y1 = My-this.vars.a+this.vars.g;

        var x2 = P.x;
        var y2 = P.y-2*this.vars.a;

        var x3 = Nx+this.vars.b+this.vars.f;
        var y3 = Ny-this.vars.a+this.vars.g;

        var x4 = Nx-this.vars.b+this.vars.f;
        var y4 = Ny+this.vars.a+this.vars.g;

        var x5 = P.x;
        var y5 = P.y+2*this.vars.a;

        var x6 = Mx+this.vars.b-this.vars.f;
        var y6 = My+this.vars.a+this.vars.g;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.over;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.lineTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.stroke();

        ctx.restore();
    },
    drawLowerBight: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x-this.vars.halfcol;
        var My = P.y-this.vars.halfrow;

        var Nx = P.x+this.vars.halfcol;
        var Ny = P.y-this.vars.halfrow;

        var x1 = Mx+this.vars.b-this.vars.f;
        var y1 = My-this.vars.a-this.vars.g;

        var x2 = P.x;
        var y2 = P.y-2*this.vars.a;

        var x3 = Nx-this.vars.b+this.vars.f;
        var y3 = Ny-this.vars.a-this.vars.g;

        var x4 = Nx+this.vars.b+this.vars.f;
        var y4 = Ny+this.vars.a-this.vars.g;

        var x5 = P.x;
        var y5 = P.y+2*this.vars.a;

        var x6 = Mx-this.vars.b-this.vars.f;
        var y6 = My+this.vars.a-this.vars.g;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.over;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.lineTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.stroke();

        ctx.restore();
    },

    drawRightBight: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x-this.vars.halfcol;
        var My = P.y-this.vars.halfrow;

        var Nx = P.x-this.vars.halfcol;
        var Ny = P.y+this.vars.halfrow;

        var x1 = Mx+this.vars.b-this.vars.f;
        var y1 = My-this.vars.a-this.vars.g;

        var x2 = P.x+2*this.vars.b;
        var y2 = P.y;

        var x3 = Nx+this.vars.b-this.vars.f;
        var y3 = Ny+this.vars.a+this.vars.g;

        var x4 = Nx-this.vars.b-this.vars.f;
        var y4 = Ny-this.vars.a+this.vars.g;

        var x5 = P.x-2*this.vars.b;
        var y5 = P.y;

        var x6 = Mx-this.vars.b-this.vars.f;
        var y6 = My+this.vars.a-this.vars.g;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.over;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.lineTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.stroke();

        ctx.restore();
    },

    drawLeftBight: function(ctx, r, c, colors) {
        var P = this.grid2coords(r,c);
        var Mx = P.x+this.vars.halfcol;
        var My = P.y-this.vars.halfrow;

        var Nx = P.x+this.vars.halfcol;
        var Ny = P.y+this.vars.halfrow;

        var x1 = Mx-this.vars.b+this.vars.f;
        var y1 = My-this.vars.a-this.vars.g;

        var x2 = P.x-2*this.vars.b;
        var y2 = P.y;

        var x3 = Nx-this.vars.b+this.vars.f;
        var y3 = Ny+this.vars.a+this.vars.g;

        var x4 = Nx+this.vars.b+this.vars.f;
        var y4 = Ny-this.vars.a+this.vars.g;

        var x5 = P.x+2*this.vars.b;
        var y5 = P.y;

        var x6 = Mx+this.vars.b+this.vars.f;
        var y6 = My+this.vars.a-this.vars.g;

        ctx.save();
        ctx.lineWidth = 1;

        ctx.fillStyle = colors.over;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.lineTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = colors.outline;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.quadraticCurveTo(x2, y2, x3, y3);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x4,y4);
        ctx.quadraticCurveTo(x5, y5, x6, y6);
        ctx.stroke();

        ctx.restore();
    },
};
