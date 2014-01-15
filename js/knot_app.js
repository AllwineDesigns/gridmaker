PI = 3.14159265359

function KnotApp() {
    this.init();
}

function gcd(x,y) {
    if( y == 0 ) return x;

    return gcd(y, x%y);
}

KnotApp.prototype = {
    init: function() {
        var img_grid = [];
        for(var i = 0; i < 20; i++) {
            img_grid[i] = [];
            for(var j = 0; j < 20; j++) {
                img_grid[i][j] = [ i*10, j*10, i*10 ]
            }
        }

        var query_str = window.location.href.substring(window.location.href.indexOf("?")+1);
        var query_params = parseQueryString(query_str);

//        if(query_params.save_data) {
//            $("save_data").src = query_params.save_data;
//        } else {
//            bmp_lib.render("save_data", img_grid);
//        }
        var canvas = new KnotCanvas("knot_canvas");
//        var grid = new KnotGrid(12, 14);
//        var grid = new KnotGrid(11, 16);
//        var grid = new KnotGrid(15, 18);
        var grid = new KnotGrid(14, 18);

//        grid.removeStrand(new KnotLocation(0,0,KnotDirection.DOWN_RIGHT));

//        $("save_data_canvas").width = 20;
//        $("save_data_canvas").height = 20;
//        var ctx = $("save_data_canvas").getContext("2d");
//        ctx.drawImage($("save_data"), 0, 0);

//        var image_data = ctx.getImageData(0,0,20,20);
//        var len = image_data.data.length;
//        var str = "";
//        for(var i = 0; i < len; i += 4) {
//            var r = image_data.data[i];
//            var g = image_data.data[i+1];
//            var b = image_data.data[i+2];
//            str += "[ " + r + ", " + g + ", " + b + " ], "
//        }

        //log(str);

        var controller = new KnotCanvasController(canvas, grid);
        this.controller = controller;
        this.controller.do_letter_pins = true;
        this.controller.instructions = new KnotInstructions(grid, grid.getDefaultStartLocations(), true, false, false);
        this.do_every_other = false;
        this.do_half_way = false;
        this.do_short_hand = false;
        this.do_letter_pins = true;

        var brushes_select = $("brushes");
        for(var i = 0; i < KnotCanvasBrushes.length; i++) {
            var option = OPTION({ value: i });
            option.innerHTML = KnotCanvasBrushes[i].label;
            brushes_select.options[brushes_select.length] = option;
        }

        connect($("extend_strands"), "onclick", function() {
            controller.grid.extendStrands();
            knot_app.update();
        });

        connect($("do_every_other"), "onclick", bind(function() {
            this.do_every_other = $("do_every_other").checked;
            knot_app.update();
        }, this));

        connect($("do_half_way"), "onclick", bind(function() {
            this.do_half_way = $("do_half_way").checked;
            knot_app.update();
        }, this));
        connect($("do_short_hand"), "onclick", bind(function() {
            this.do_short_hand = $("do_short_hand").checked;
            knot_app.update();
        }, this));

        connect($("set_brush"), "onclick", function() {
            var opt = brushes_select.options[brushes_select.selectedIndex];
            controller.brush = KnotCanvasBrushes[opt.value];
            controller.setClickMode(KnotCanvasClickMode.SET_BRUSH);
        });
        connect($("remove_strand"), "onclick", function() {
            var opt = brushes_select.options[brushes_select.selectedIndex];
            controller.brush = KnotCanvasBrushes[opt.value];
            controller.setClickMode(KnotCanvasClickMode.SET_BRUSH);
        });

        connect(document, "onkeydown", function(e) {
            var m = e.modifier();
            if(controller.alt_down != m.alt) {
                controller.alt_down = m.alt;
                controller.update();
            }
        });
        connect(document, "onkeyup", function(e) {
            var m = e.modifier();
            if(controller.alt_down != m.alt) {
                controller.alt_down = e.modifier().alt;
                controller.update();
            }
        });

        connect($("autofill"), "onclick", function() {
            controller.autofill = $("autofill").checked;
        });
        connect($("clear_grid"), "onclick", function() {
            controller.grid.clear();
            controller.canvas.render();
        });

        connect($("undo"), "onclick", function(e) {
            controller.undo();
        });
        connect($("redo"), "onclick", function(e) {
            controller.redo();
        });
        connect($("toggle_coding"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.TOGGLE_CODING);
        });
        connect($("set_over"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_OVER);
        });
        connect($("set_under"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_UNDER);
        });
        connect($("set_empty"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_EMPTY);
        });
        connect($("set_upper_bight"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_UPPER_BIGHT);
        });
        connect($("set_lower_bight"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_LOWER_BIGHT);
        });
        connect($("set_left_bight"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_LEFT_BIGHT);
        });
        connect($("set_right_bight"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_RIGHT_BIGHT);
        });
        connect($("set_horizontal_bights"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_HORIZONTAL_BIGHTS);
        });
        connect($("set_vertical_bights"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_VERTICAL_BIGHTS);
        });
        connect($("set_slash"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_SLASH);
        });
        connect($("set_backslash"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_BACKSLASH);
        });
        connect($("set_x"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.SET_X);
        });
        connect($("remove_strand"), "onclick", function() {
            controller.setClickMode(KnotCanvasClickMode.REMOVE_STRAND);
        });

        connect($("create_image"), "onclick", function() {
            //log(canvas.element.toDataURL("image/jpeg"));
            $("knot_image").src = canvas.element.toDataURL("image/jpeg");
            $("knot_image").style.display = "";
        });

        connect($("strand_gap_inches"), "onchange", function() {
            var strand_gap = parseFloat($("strand_gap_inches").value)*controller.DPI;
            controller.setGapSize(strand_gap);
            width_inches = (canvas.element.width-2*controller.padding.x)/controller.DPI;
            height_inches = (canvas.element.height-2*controller.padding.y)/controller.DPI;

            width_inches_str = "" + width_inches.toFixed(4) + " inches";
            height_inches_str = "" + height_inches.toFixed(4) + " inches";

            width_cm_str = "" + (2.54*width_inches).toFixed(4) + " cm";
            height_cm_str = "" + (2.54*height_inches).toFixed(4) + " cm";

            if(grid.cols_wrap) {
                width_inches_str += " (" + (width_inches/PI).toFixed(4) + " inch diameter)";
                width_cm_str += " (" + (2.54*width_inches/PI).toFixed(4) + " cm diameter)";
            }

            if(grid.rows_wrap) {
                height_inches_str += " (" + (height_inches/PI).toFixed(4) + " inch diameter)";
                height_cm_str += " (" + (2.54*height_inches/PI).toFixed(4) + " cm diameter)";
            }

            $("width_inches").innerHTML = width_inches_str;
            $("height_inches").innerHTML = height_inches_str;

            $("width_cm").innerHTML = width_cm_str;
            $("height_cm").innerHTML = height_cm_str;
            knot_app.update();
        });
        connect($("strand_gap_cm"), "onchange", function() {
            var strand_gap = parseFloat($("strand_gap_cm").value)*controller.DPI/2.54;
            controller.setGapSize(strand_gap);
            knot_app.update();
        });

        connect($("dpi"), "onchange", function() {
            var dpi = parseFloat($("dpi").value);
            controller.setDPI(dpi);
        });
        connect($("strand_width_inches"), "onchange", function() {
            strand_width = parseFloat($("strand_width_inches").value)*controller.DPI;
            controller.setStrandWidth(strand_width);
            knot_app.update();
        });

        connect($("strand_width_cm"), "onchange", function() {
            strand_width = parseFloat($("strand_width_cm").value)*controller.DPI/2.54;
            controller.setStrandWidth(strand_width);
            knot_app.update();
        });

        connect($("parts_input"), "onchange", function() {
            var parts = parseInt($("parts_input").value);
            var bights = parseInt($("bights_input").value);
            controller.setRowsCols(parts+1, bights*2);
            knot_app.update();
        });
        connect($("bights_input"), "onchange", function() {
            var parts = parseInt($("parts_input").value);
            var bights = parseInt($("bights_input").value);
            controller.setRowsCols(parts+1, bights*2);
            knot_app.update();
        });

        connect(controller, "canvas_resized", function() {
            width_inches = (canvas.element.width-2*controller.padding.x)/controller.DPI;
            height_inches = (canvas.element.height-2*controller.padding.y)/controller.DPI;

            width_inches_str = "" + width_inches.toFixed(4) + " inches";
            height_inches_str = "" + height_inches.toFixed(4) + " inches";

            width_cm_str = "" + (2.54*width_inches).toFixed(4) + " cm";
            height_cm_str = "" + (2.54*height_inches).toFixed(4) + " cm";

            if(grid.cols_wrap) {
                width_inches_str += " (" + (width_inches/PI).toFixed(4) + " inch diameter)";
                width_cm_str += " (" + (2.54*width_inches/PI).toFixed(4) + " cm diameter)";
            }

            if(grid.rows_wrap) {
                height_inches_str += " (" + (height_inches/PI).toFixed(4) + " inch diameter)";
                height_cm_str += " (" + (2.54*height_inches/PI).toFixed(4) + " cm diameter)";
            }

            $("width_inches").innerHTML = width_inches_str;
            $("height_inches").innerHTML = height_inches_str;

            $("width_cm").innerHTML = width_cm_str;
            $("height_cm").innerHTML = height_cm_str;
            knot_app.update();
        });

        connect($("stretch"), "onclick", function(e) {
            controller.resize_mode = KnotCanvasResizeMode.STRETCH;
        });
        connect($("resize"), "onclick", function(e) {
            controller.resize_mode = KnotCanvasResizeMode.RESIZE;
        });
        connect($("gauchocoding"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.coding_func = controller.grid.lockedGauchoCoding;
            controller.grid.coding_opts = {
                size: parseInt($("gaucho_size").value),
                topcoding: $("gaucho_topcoding").value,
            };
            controller.grid.updateCoding();
            controller.canvas.render();

            knot_app.update();
        });
        connect($("dogbonecoding"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.coding_func = controller.grid.dogBoneCoding;
            controller.grid.coding_opts = {
                rows: parseInt($("dog_bone_coding_rows").value),
                topcoding: $("dog_bone_top_coding").value,
                midcoding: $("dog_bone_mid_coding").value,
                botcoding: $("dog_bone_bot_coding").value,
            };
            controller.grid.updateCoding();
            controller.canvas.render();

            knot_app.update();
        });
        connect($("tilecoding"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.coding_func = controller.grid.tileCoding;
            controller.grid.coding_opts = {
                size: parseInt($("tile_size").value),
                topcoding: $("tile_topcoding").value,
                botcoding: $("tile_botcoding").value,
            };
            controller.grid.updateCoding();
            controller.canvas.render();

            knot_app.update();
        });
        connect($("colors"), "onchange", function(e) {
            var colors = $("colors").value.split(/\s+/);
            controller.colors = colors;
            controller.canvas.render();
        });
        connect($("shadow_colors"), "onchange", function(e) {
            var colors = $("shadow_colors").value.split(/\s+/);
            controller.shadow_colors = colors;
            controller.canvas.render();
        });

        connect($("toggle_pins"), "onclick", function(e) {
            controller.show_pins = !controller.show_pins;
            controller.canvas.render();
        });
        connect($("toggle_grid_points"), "onclick", function(e) {
            controller.show_grid_points = !controller.show_grid_points;
            controller.canvas.render();
        });

        connect($("remove_nonloops"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.removeNonLoops();
            controller.canvas.render();
            $("strands").innerHTML = controller.grid.getNumStrands();
            knot_app.update();
        });

        connect($("rowcoding"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.coding_func = controller.grid.rowCoding;
            controller.grid.coding_opts = $("coding").value;
            controller.grid.updateCoding();
            controller.canvas.render();
            knot_app.update();
        });
        connect($("colcoding"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.coding_func = controller.grid.columnCoding;
            controller.grid.coding_opts = $("coding").value;
            controller.grid.updateCoding();
            controller.canvas.render();
        });
        connect($("standard_grid"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.grid_func = controller.grid.standardGrid;
            controller.grid.grid_opts = 0;
            controller.grid.updateGrid();
            knot_app.update();
        });
        connect($("mat_grid"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.grid_func = controller.grid.matGrid;
            controller.grid.grid_opts = 0;
            controller.grid.updateGrid();
            knot_app.update();
        });
        connect($("dog_bone_grid"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.grid_func = controller.grid.dogBoneGrid;
            controller.grid.grid_opts = {
                nested_bights: parseInt($("dog_bone_nested_bights").value),
                shift_bottom_bights: parseInt($("dog_bone_shift_bottom_bights").value),
                rows: parseInt($("dog_bone_rows").value)
            };
            controller.grid.updateGrid();
            knot_app.update();
        });
        connect($("pineapple_grid"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.grid_func = controller.grid.pineappleGrid;
            controller.grid.grid_opts = {
                nested_bights: parseInt($("nested_bights").value),
                shift_bottom_bights: parseInt($("shift_bottom_bights").value)
            };
            controller.grid.updateGrid();
            knot_app.update();
        });
        connect($("do_letter_pins"), "onclick", function(e) {
            controller.do_letter_pins = $("do_letter_pins").checked;
            knot_app.do_letter_pins = $("do_letter_pins").checked;
            knot_app.update();
        });
        connect($("bottom_pineapple_grid"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.grid_func = controller.grid.bottomPineappleGrid;
            controller.grid.grid_opts = {
                nested_bights: parseInt($("nested_bights").value),
                shift_bottom_bights: parseInt($("shift_bottom_bights").value)
            };
            controller.grid.updateGrid();
            knot_app.update();
        });
        connect($("pineapple_plant_hanger_grid"), "onclick", function(e) {
            controller.saveUndo();
            controller.grid.grid_func = controller.grid.pineapplePlantHangerGrid;
            controller.grid.grid_opts = {
                nested_bights: parseInt($("nested_bights").value),
                shift_bottom_bights: parseInt($("shift_bottom_bights").value)
            };
            controller.grid.updateGrid();
            knot_app.update();
        });
        connect($("load_knot"), "onclick", function(e) {
            controller.grid = KnotGrid.fromString($("knot_string").value);
            knot_app.update();
        });

        width_inches = (controller.canvas.element.width-2*controller.padding.x)/controller.DPI;
        height_inches = (controller.canvas.element.height-2*controller.padding.y)/controller.DPI;

        width_inches_str = "" + width_inches.toFixed(4) + " inches";
        height_inches_str = "" + height_inches.toFixed(4) + " inches";

        width_cm_str = "" + (2.54*width_inches).toFixed(4) + " cm";
        height_cm_str = "" + (2.54*height_inches).toFixed(4) + " cm";

        if(controller.grid.cols_wrap) {
            width_inches_str += " (" + (width_inches/PI).toFixed(4) + " inch diameter)";
            width_cm_str += " (" + (2.54*width_inches/PI).toFixed(4) + " cm diameter)";
        }

        if(controller.grid.rows_wrap) {
            height_inches_str += " (" + (height_inches/PI).toFixed(4) + " inch diameter)";
            height_cm_str += " (" + (2.54*height_inches/PI).toFixed(4) + " cm diameter)";
        }

        $("width_inches").innerHTML = width_inches_str;
        $("height_inches").innerHTML = height_inches_str;

        $("width_cm").innerHTML = width_cm_str;
        $("height_cm").innerHTML = height_cm_str;

        this.update();

        var canvas_border = $("knot_canvas_border");
        canvas_border.onselectstart          = "return false;";
        canvas_border.ondragstart            = "return false;";

        canvas_border.style.WebkitUserSelect = 'none';
        canvas_border.style.KhtmlUserSelect  = 'none';
        canvas_border.style.MozUserSelect    = 'none';
        canvas_border.style.MsUserSelect     = 'none';
        canvas_border.style.OUserSelect      = 'none';
        canvas_border.style.UserSelect       = 'none';

        canvas_border.setAttribute ("unselectable", "on");
        canvas_border.setAttribute ("draggable",    "false");
    },

    update: function() {
        var default_start_locs = this.controller.grid.getDefaultStartLocations();
        var every_other = [];
        for(var i = 0; i < default_start_locs.length; i += 2) {
            every_other.push(default_start_locs[i]);
        }
        for(var i = 1; i < default_start_locs.length; i += 2) {
            every_other.push(default_start_locs[i]);
        }
        //log("default: " + default_start_locs);
        //log("every_other: " + every_other);
        var instructions;
        var strand_lengths;
        if(this.do_every_other) {
            instructions = new KnotInstructions(this.controller.grid, every_other, this.do_letter_pins, this.do_half_way, this.do_short_hand);
            strand_lengths = this.controller.strandLengths(every_other);
        } else {
            instructions = new KnotInstructions(this.controller.grid, default_start_locs, this.do_letter_pins, this.do_half_way, this.do_short_hand);
            strand_lengths = this.controller.strandLengths(default_start_locs);
        }
        this.controller.instructions = instructions;
        //log(this.controller.instructions);
        //log(strand_lengths);

        var length_str = "";
        for(var i = 0; i < strand_lengths.length; i++) {
            len_inches = (strand_lengths[i]/this.controller.DPI);
            length_str += "Strand " + (i+1) + ": " + len_inches.toFixed(4) + " inches (" + (len_inches*2.54).toFixed(4) + " cm)\n";
        }
        $("lengths").innerHTML = length_str;
        $("instructions").innerHTML = instructions.toString();
        $("instructions_pre").innerHTML = instructions.toString();
        $("knot_string").value = this.controller.grid.toString();
        $("strands").innerHTML = this.controller.grid.getNumStrands();
        $("facets").innerHTML = this.controller.grid.getFacets();
        $("strand_width_inches").value = (this.controller.strand_width/this.controller.DPI).toFixed(4);
        $("strand_width_cm").value = (this.controller.strand_width*2.54/this.controller.DPI).toFixed(4);
        $("strand_gap_inches").value = (this.controller.strand_gap_size/this.controller.DPI).toFixed(4);
        $("strand_gap_cm").value = (this.controller.strand_gap_size*2.54/this.controller.DPI).toFixed(4);
        $("dpi").value = this.controller.DPI;
        $("rows").innerHTML = this.controller.grid.rows;
        $("cols").innerHTML = this.controller.grid.cols;

// do parts/bights calcs

        var total = 0;
        var bights = 0;
        for(var i = 0; i < default_start_locs.length; i++) {
            var start_loc = default_start_locs[i];
            var walker = new KnotGridWalker(this.controller.grid, start_loc);
            while(walker.next()) {
                total += 1;
                if(walker.isOnBight()) {
                    bights += 1;
                }
            }
        }
        $("parts").innerHTML = Math.floor(total/this.controller.grid.cols);
        $("bights").innerHTML = bights/2;

        this.controller.update();
    }
};
