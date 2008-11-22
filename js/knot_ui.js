/* knot.js by John Allwine jallwine86@yahoo.com
 *
 * Copyright (c) 2008 John Allwine
 *
 */

function getSelected(select) {
    var sel = [];
    forEach(select.options, function(o) {
        if(o.selected) {
            sel.push(o.value);
        }
    });
    return sel[0];
}
function setSelected(select, value) {
    forEach(select.options, function(o) {
        if(o.value == value) {
            o.selected = true;
        } else {
            o.selected = false;
        }
    });
}

function KnotUI() {
    this.init();
}

KnotUI.prototype = {
    default_params: {
        parts: 11,
        bights: 7,
        coding: '\\/',
        sobre: false,
        width: 500,
        height: 400,
        strand_width: 10,
        over_color: "white",
        under_color: "white",
        miter_color: "white",
        orient: "vertical",
        swap_bight_order: false,
        show_colors: false
    },
    params: {
    },
    show_colors: false,
    directions: {
        vertical: [ 'bottom', 'top' ],
        horizontal: [ 'left', 'right' ]
    },
    animation_time: 0,
    animation_dt: .01,
    paused: true,
    elements: {},
    init: function() {
        var qry_params = {};
        if(window.location.href.indexOf("?") > -1) {
            var query_str = window.location.href.substring(window.location.href.indexOf("?")+1);
            qry_params = parseQueryString(query_str);
            for(key in qry_params) {
                var num = parseFloat(qry_params[key]);
                if(isNaN(num)) {
                    if(qry_params[key] == 'true') {
                        qry_params[key] = true;
                    } else if(qry_params[key] == 'false') {
                        qry_params[key] = false;
                    }
                } else {
                    qry_params[key] = num;
                }
            }
        }
        update(this.params, this.default_params, qry_params);

        this.show_colors = this.params.show_colors;

        this.knot = new Knot(this.params.parts, this.params.bights, this.params.sobre, this.params.coding);
        this.update_title();

        var hc_colors = [];
        for(key in this.params) {
            if(key.match(/hc\d+_color/) != null) {
                var hc_num = parseInt(key.replace(/hc(\d+)_color/, "$1"));
                hc_colors[hc_num-1] = this.params[key];
            }
        }

        this.diagram = new KnotDiagram({
            knot: this.knot,
            width: this.params.width,
            height: this.params.height,
            under_color: this.params.under_color,
            over_color: this.params.over_color,
            miter_color: this.params.miter_color,
            strand_width: this.params.strand_width,
            orient: this.params.orient,
            swap_bight_order: this.params.swap_bight_order,
            hc_colors: hc_colors
        });
        this.init_elements();
        this.connect_signals();
        this.update_half_cycles();
        this.update_diagram();
    },

    init_elements: function() {
        this.elements.parts = $("parts");
        this.elements.bights = $("bights");

        this.elements.parts.value = this.knot.parts;
        this.elements.bights.value = this.knot.bights;

        this.elements.half_cycles = $("half_cycles");
//        this.elements.animate_button = $("animate_button");
        this.elements.canvas = $("knot_diagram");

        this.elements.width = $("width");
        this.elements.height = $("height");

        this.elements.width.value = this.diagram.width;
        this.elements.height.value = this.diagram.height;

        this.elements.sobre = $("sobre");
        this.elements.sobre.checked = this.knot.sobre;

        this.elements.coding = $("coding");
        this.elements.coding.value = this.knot.coding_part;

        this.elements.strand_width = $("strand_width");
        this.elements.strand_width.value = this.diagram.strand_width;

        this.elements.over_color = $("over_color");
        this.elements.over_color.value = this.diagram.over_color;

        this.elements.under_color = $("under_color");
        this.elements.under_color.value = this.diagram.under_color;

        this.elements.miter_color = $("miter_color");
        this.elements.miter_color.value = this.diagram.miter_color;

        this.elements.orient = $("orient");
        setSelected(this.elements.orient, this.diagram.orient);

        this.elements.swap_bight_order = $("swap_bight_order");
        this.elements.swap_bight_order.checked = this.diagram.swap_bight_order;

        this.elements.half_cycle = $("half_cycle");
        this.elements.half_cycle.value = this.knot.half_cycles.length;

        var dir = (this.knot.half_cycles.length+1)%2;
        var hc = this.knot.half_cycles[this.knot.half_cycles.length-1];

        this.elements.from_pin = $("from_pin");
        this.elements.from_pin.innerHTML = this.directions[this.diagram.orient][dir] + " pin " + hc.from_pin;

        this.elements.to_pin = $("to_pin");
        this.elements.to_pin.innerHTML = this.directions[this.diagram.orient][1-dir] + " pin " + hc.to_pin;

        this.elements.run_list = $("run_list");
        this.elements.run_list.innerHTML = hc.run_list_str();

        this.elements.next = $("next");
        this.elements.prev = $("prev");

        this.elements.toggle_show_colors = $("toggle_show_colors");
        this.elements.half_cycle_color_panel = $("half_cycle_color_panel");
        if(this.show_colors) {
            this.elements.toggle_show_colors.innerHTML = "hide";
            removeElementClass(this.elements.half_cycle_color_panel, "hidden");
        }
        this.elements.half_cycle_colors = []

        var components_per_line = 10;
        for(var i = 0; i < this.knot.half_cycles.length; i++) {
            var color_input = INPUT({size: 6 });

            if(this.diagram.hc_colors[i]) {
                color_input.value = this.diagram.hc_colors[i];
            }
            var color_component = DIV({ 'class': (i == this.knot.half_cycles.length-1 || (i+1)%components_per_line == 0) ? 'last_component' : 'component' },
                                    DIV({}, SPAN({ 'class': "bold" }, "Half Cycle " + (i+1))),
                                    DIV({}, color_input));
            this.elements.half_cycle_color_panel.appendChild(color_component);
            this.elements.half_cycle_colors[i] = color_input;

            if((i+1)%components_per_line == 0) {
                this.elements.half_cycle_color_panel.appendChild(DIV({'class': "clear"}));
            }
        }
        this.elements.half_cycle_color_panel.appendChild(DIV({'class': "clear"}));

        this.elements.generate = $("generate");
    },

    update_params: function() {
        this.params = {}
        this.params.show_colors = this.show_colors;
        this.params.width = parseInt(this.elements.width.value);
        this.params.height = parseInt(this.elements.height.value);
        this.params.parts = parseInt(this.elements.parts.value);
        this.params.bights = parseInt(this.elements.bights.value);
        this.params.coding = this.elements.coding.value;
        this.params.sobre = this.elements.sobre.checked;
        this.params.over_color = this.elements.over_color.value;
        this.params.under_color = this.elements.under_color.value;
        this.params.miter_color = this.elements.miter_color.value;
        this.params.strand_width = parseInt(this.elements.strand_width.value);
        this.params.orient = getSelected(this.elements.orient);
        this.params.swap_bight_order = this.elements.swap_bight_order.checked;

        for(var i = 0; i < this.elements.half_cycle_colors.length; i++) {
            if(this.elements.half_cycle_colors[i].value) {
                this.params["hc" + (i+1) + "_color"] = this.elements.half_cycle_colors[i].value;
            }
        }

        for(key in this.params) {
            if(this.params[key] == this.default_params[key]) {
                delete this.params[key];
            }
        }
    },

    update_url: function() {
        this.update_params();
        document.location = "?" + queryString(this.params);
    },

    update_title: function() {
        document.title = "Turks Heads - " + this.knot.parts + "x" + this.knot.bights + " " + this.knot.coding_part;
    },

    update_half_cycle: function() {
        var hc_num = parseInt(this.elements.half_cycle.value);
        var dir = (hc_num+1)%2;
        var hc = this.knot.half_cycles[hc_num-1];

        this.elements.from_pin.innerHTML = this.directions[this.diagram.orient][dir] + " pin " + hc.from_pin;
        this.elements.to_pin.innerHTML = this.directions[this.diagram.orient][1-dir] + " pin " + hc.to_pin;
        this.elements.run_list.innerHTML = hc.run_list_str();

        var ctx = this.elements.canvas.getContext("2d");
        ctx.save();
        this.diagram.clear(ctx);
        this.diagram.set_transform(ctx);
        this.diagram.draw_hc(ctx, hc_num-1, 1);
        ctx.restore();
    },

    connect_signals: function() {
        forEach([this.elements.parts,
                 this.elements.bights,
                 this.elements.coding,
                 this.elements.width,
                 this.elements.height,
                 this.elements.strand_width,
                 this.elements.over_color,
                 this.elements.under_color,
                 this.elements.miter_color ], bind(function(text) {
                     connect(text, "onkeydown", bind(function(e) {
                         if(e.key().code == 13) {
                             this.update_url();
                         }
                     }, this))
         }, this));
        forEach(this.elements.half_cycle_colors, bind(function(text) {
                     connect(text, "onkeydown", bind(function(e) {
                         if(e.key().code == 13) {
                             this.update_url();
                         }
                     }, this))
         }, this));
        connect(this.elements.toggle_show_colors, "onclick", bind(function(e) {
            this.show_colors = !this.show_colors;
            if(this.show_colors) {
                this.elements.toggle_show_colors.innerHTML = "hide";
                removeElementClass(this.elements.half_cycle_color_panel, "hidden");
            } else {
                this.elements.toggle_show_colors.innerHTML = "show";
                addElementClass(this.elements.half_cycle_color_panel, "hidden");
            }
        }, this));

        connect(this.elements.next, "onclick", bind(function(e) {
            this.elements.half_cycle.value = (parseInt(this.elements.half_cycle.value)%this.knot.half_cycles.length)+1;
            this.update_half_cycle();
        }, this));
        connect(this.elements.prev, "onclick", bind(function(e) {
            this.elements.half_cycle.value = (((parseInt(this.elements.half_cycle.value)-1)-1+this.knot.half_cycles.length)%this.knot.half_cycles.length)+1;
            this.update_half_cycle();
        }, this));
        connect(this.elements.half_cycle, "onkeydown", bind(function(e) {
            if(e.key().code == 13) {
                this.update_half_cycle();
            }
        }, this));
        connect(this.elements.generate, "onclick", bind(function() {
//            this.update_knot();
//            this.update_title();
//            this.update_diagram();
            this.update_url();
        }, this));

/*
        connect(this.elements.animate_button, "onclick", bind(function() {
            this.paused = !this.paused
            var ctx = this.elements.canvas.getContext("2d");
            if(this.paused) {
                ctx.restore();

                this.diagram.clear(ctx);
                this.diagram.set_transform(ctx);
                this.diagram.draw(ctx, this.animation_time);
            } else {
                ctx.save();
                this.diagram.clear(ctx);
                this.diagram.set_transform(ctx);
                this.animate();
            }
        }, this));
        */
    },

    update_diagram: function() {
        try {
            var width = parseInt(this.elements.width.value);
            var height = parseInt(this.elements.height.value);
            var strand_width = parseInt(this.elements.strand_width.value);
            this.diagram.update_opts({ width: width, 
                                       height: height, 
                                       strand_width: strand_width,
                                       over_color: this.elements.over_color.value,
                                       under_color: this.elements.under_color.value,
                                       miter_color: this.elements.miter_color.value,
                                       orient: getSelected(this.elements.orient),
                                       swap_bight_order: this.elements.swap_bight_order.checked });
            this.elements.canvas.width = this.diagram.absolute_width;
            this.elements.canvas.height = this.diagram.absolute_height;
            this.draw_knot();
        } catch(err) {
        }
    },

    update_knot: function() {
        try {
            var parts = parseInt(this.elements.parts.value);
            var bights = parseInt(this.elements.bights.value);
            var coding = this.elements.coding.value;
            var sobre = this.elements.sobre.checked;
            var knot = new Knot(parts, bights, sobre, coding);

            this.knot.parts = parts;
            this.knot.bights = bights;
            this.knot.sobre = sobre;
            this.knot.coding_part = coding;
            this.knot.solve();

            this.update_half_cycles();
            this.diagram.calc_knot();
            this.draw_knot();
        } catch(err) { 
        }
    },

    update_half_cycles: function() {
        this.elements.half_cycles.innerHTML = "";
        var dir = 0;
        forEach(this.knot.half_cycles, bind(function(hc) {
            var div = DIV({ 'class': "hc" });
            var str = "from " + this.directions[this.diagram.orient][dir] + " pin " + hc.from_pin + " " +
                              (hc.run_list.length == 0 ? '' : (hc.run_list_str() + " ")) +
                          "to " + this.directions[this.diagram.orient][1-dir] + " pin " + hc.to_pin;
            div.innerHTML = str;
            this.elements.half_cycles.appendChild(div);
            dir = 1-dir;
        }, this));
    },

    draw_knot: function() {
        var ctx = this.elements.canvas.getContext("2d");
        ctx.save();
        this.diagram.clear(ctx);
        this.diagram.set_transform(ctx);
        this.diagram.draw(ctx, 1);
        ctx.restore();
    },
    animate: function() {
        var ctx = this.elements.canvas.getContext("2d");
        this.diagram.clear(ctx);
        this.diagram.draw(ctx, this.animation_time);
        this.animation_time += this.animation_dt;
        if(this.animation_time > 1) {
            this.animation_time -= 1;
        }
        if(!this.paused) {
            callLater(.2, bind(this.animate, this));
        }
    }
};

function KnotDiagram(opts) {
    this.init({
        knot: opts.knot,
        width: opts.width,
        height: opts.height,
        strand_width: opts.strand_width,
        over_color: opts.over_color,
        under_color: opts.under_color,
        miter_color: opts.miter_color,
        orient: opts.orient,
        swap_bight_order: opts.swap_bight_order,
        hc_colors: opts.hc_colors
    });
}

KnotDiagram.prototype = {
    init: function(opts) {
        this.update_opts(opts);
    },
    update_opts: function(opts) {
        update(this, opts);
        this.calc_knot();
    },
    calc_knot: function() {
        if(this.orient == "vertical") {
            this.bight_dist = this.width/this.knot.bights;
        } else {
            this.bight_dist = this.height/this.knot.bights;
        }

        var to_pin = this.knot.half_cycles[0].to_pin + (Math.floor(this.knot.n/2))*this.knot.bights;
        var adj = (to_pin-1+.5*(this.knot.parts%2))*this.bight_dist;

        var hyp;

        if(this.orient == "vertical") {
            hyp = Math.sqrt(adj*adj+this.height*this.height);
        } else {
            hyp = Math.sqrt(adj*adj+this.width*this.width);
        }

        this.part_dist = hyp/this.knot.parts;

        this.angle = Math.acos(adj/hyp);

        if(this.orient == "vertical") {
            this.dx = this.part_dist*Math.cos(this.angle);
            this.dy = this.part_dist*Math.sin(this.angle);
        } else {
            this.dx = this.part_dist*Math.sin(this.angle);
            this.dy = -this.part_dist*Math.cos(this.angle);
        }

        if(this.orient == "vertical") {
            this.absolute_height = this.height + this.strand_width/Math.cos(Math.PI*.5-this.angle)+40;
            this.absolute_width = this.width;
        } else {
            this.absolute_width = this.width + this.strand_width/Math.cos(Math.PI*.5-this.angle)+40;
            this.absolute_height = this.height;
        }

        this.half_cycles = [];

        var startx = 0;
        var starty = 0;
        for(var i = 0; i < this.knot.half_cycles.length; i++) {
            this.half_cycles[i] = [];
            for(var j = 0; j < this.knot.parts-1; j++) {
                var over = (this.knot.sobre && this.knot.coding[j] == "\\") ||
                           (!this.knot.sobre && this.knot.coding[j] == "/");
                if(i%2 && ((this.knot.parts+1)%2)) {
                    over = !over;
                }

                var x;
                var y;
                var type;
                if(this.orient == "vertical") {
                    x = (startx+(j+1)*this.dx) % this.width;
                    y = starty+((i%2) ? -1 : 1)*(j+1)*this.dy;
                    type = (i%2) ? 'down' : 'up';
                } else {
                    x = startx+((i%2) ? -1 : 1)*(j+1)*this.dx;
                    y = (starty+(j+1)*this.dy) % this.height;
                    type = (i%2) ? 'left' : 'right';
                }

                this.half_cycles[i].push(new KnotPiece({
                    diagram: this,
                    x: x,
                    y: y,
                    type: type,
                    uo: over ? 'O' : 'U',
                    hc: i
                }));
            }

            if(this.orient == "vertical") {
                startx = (startx+this.knot.parts*this.dx) % this.width;
                starty = starty+((i%2) ? -1 : 1)*this.knot.parts*this.dy;
                type = (i%2) ? 'bottom_miter' : 'top_miter';
            } else {
                startx = startx+((i%2) ? -1 : 1)*this.knot.parts*this.dx;
                starty = (starty+this.knot.parts*this.dy) % this.height;
                type = (i%2) ? 'left_miter' : 'right_miter';
            }
            this.half_cycles[i].push(new KnotPiece({
                diagram: this,
                x: startx,
                y: starty,
                type: type,
                uo: 'U',
                hc: i
            }));
        }
    },
    draw_pins: function(ctx) {
        try {
            if(this.orient == "vertical") {
                for(var i = 0; i <= this.knot.bights; i++) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    if(this.swap_bight_order) {
                        ctx.translate(this.bight_dist*(i+.5*(this.knot.parts%2)), 15);
                    } else {
                        ctx.translate(this.absolute_width-this.bight_dist*(i+.5*(this.knot.parts%2))-15, 15);
                    }
                    ctx.mozDrawText("" + ((i%this.knot.bights)+1));

                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    if(this.swap_bight_order) {
                        ctx.translate(this.bight_dist*i, this.absolute_height-5);
                    } else {
                        ctx.translate(this.absolute_width-this.bight_dist*i-15, this.absolute_height-5);
                    }
                    ctx.mozDrawText("" + ((i%this.knot.bights)+1));
                    ctx.restore();
                }
            } else {
                for(var i = 0; i <= this.knot.bights; i++) {
                    ctx.save();
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    if(this.swap_bight_order) {
                        ctx.translate(this.absolute_width-15, this.bight_dist*(i+.5*(this.knot.parts%2))+15);
                    } else {
                        ctx.translate(this.absolute_width-15, this.absolute_height-this.bight_dist*(i+.5*(this.knot.parts%2)));
                    }
                    ctx.mozDrawText("" + ((i%this.knot.bights)+1));

                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    if(this.swap_bight_order) {
                        ctx.translate(5, this.bight_dist*i+15);
                    } else {
                        ctx.translate(5, this.absolute_height-this.bight_dist*i);
                    }
                    ctx.mozDrawText("" + ((i%this.knot.bights)+1));
                    ctx.restore();
                }
            }
        } catch(err) {
        }
    },

    draw_hc: function(ctx, hc, t) {
        ctx.save();
        this.draw_pins(ctx);
        for(var i = 0; i < hc; i++) {
            for(var j = 0; j < this.half_cycles[i].length; j++) {
                this.half_cycles[i][j].draw(ctx, 1);
            }
        }

        if(hc < this.half_cycles.length) {
            var end_j = this.half_cycles[hc].length*t;
            for(var j = 0; j < end_j; j++) {
                this.half_cycles[hc][j].draw(ctx, 1);
            }

            if(end_j < this.half_cycles[hc].length) {
                var piece_t = end_j-Math.floor(end_j);
                end_j = Math.floor(end_j);
                this.half_cycles[hc][end_j].draw(ctx, piece_t);
            }
        }
        ctx.restore();
    },
    draw: function(ctx, t) {
        ctx.save();
        this.draw_pins(ctx);
        var end_i = this.half_cycles.length*t;
        for(var i = 0; i < Math.floor(end_i); i++) {
            for(var j = 0; j < this.half_cycles[i].length; j++) {
                this.half_cycles[i][j].draw(ctx, 1);
            }
        }

        if(end_i < this.half_cycles.length) {
            var hc_t = end_i-Math.floor(end_i);
            end_i = Math.floor(end_i);

            var end_j = this.half_cycles[end_i].length*hc_t;
            for(var j = 0; j < end_j; j++) {
                this.half_cycles[end_i][j].draw(ctx, 1);
            }

            if(end_j < this.half_cycles[end_i].length) {
                var piece_t = end_j-Math.floor(end_j);
                end_j = Math.floor(end_j);
                this.half_cycles[end_i][end_j].draw(ctx, piece_t);
            }
        }
        ctx.restore();
    },
    set_transform: function(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        if(this.swap_bight_order) {
            ctx.scale(1, -1);

            if(this.orient == "vertical") {
                ctx.translate(0, -this.height-(this.strand_width*.5/Math.cos(Math.PI*.5-this.angle)+20));
            } else {
                ctx.translate((this.strand_width*.5/Math.cos(Math.PI*.5-this.angle)+20), 0);
            }
        } else {
            if(this.orient == "vertical") {
                ctx.scale(-1, -1);
                ctx.translate(-this.absolute_width, -this.height-(this.strand_width*.5/Math.cos(Math.PI*.5-this.angle)+20));
            } else {
                ctx.scale(1, 1);
                ctx.translate((this.strand_width*.5/Math.cos(Math.PI*.5-this.angle)+20), this.absolute_height);
            }
        }
    },

    clear: function(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
};

function KnotPiece(opts) {
    this.init({
        x: opts.x,
        y: opts.y,
        diagram: opts.diagram,
        type: opts.type,
        uo: opts.uo,
        hc: opts.hc
    });
}

KnotPiece.prototype = {
    init: function(opts) {
        update(this, opts);
    },
    draw_top_miter: function(ctx, x, y, t) {
        var l = this.diagram.part_dist*.5;
        var w = this.diagram.strand_width*.5;
        var costheta = Math.cos(this.diagram.angle);
        var sintheta = Math.sin(this.diagram.angle);
        var x1 = x+l*costheta-w*sintheta;
        var y1 = y-l*sintheta-w*costheta;

        var x2 = x+l*costheta+w*sintheta;
        var y2 = y-l*sintheta+w*costheta;

        var x3 = x;
        var y3 = y+w/costheta;

        var x4 = x-l*costheta-w*sintheta;
        var y4 = y-l*sintheta+w*costheta;

        var x5 = x-l*costheta+w*sintheta;
        var y5 = y-l*sintheta-w*costheta;

        var x6 = x;
        var y6 = y-w/costheta;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.fillStyle = this.diagram.miter_color;

        if(this.diagram.hc_colors[this.hc]) {
            ctx.fillStyle = this.diagram.hc_colors[this.hc];
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.quadraticCurveTo(x3, y3, x4, y4);
        ctx.lineTo(x5, y5);
        ctx.quadraticCurveTo(x6, y6, x1, y1);
        ctx.closePath()
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.quadraticCurveTo(x3, y3, x4, y4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x5, y5);
        ctx.quadraticCurveTo(x6, y6, x1, y1);
        ctx.stroke();


        ctx.restore();
    },
    draw_bottom_miter: function(ctx, x, y, t) {
        var l = this.diagram.part_dist*.5;
        var w = this.diagram.strand_width*.5;
        var costheta = Math.cos(this.diagram.angle);
        var sintheta = Math.sin(this.diagram.angle);
        var x1 = x+l*costheta-w*sintheta;
        var y1 = y+l*sintheta+w*costheta;

        var x2 = x+l*costheta+w*sintheta;
        var y2 = y+l*sintheta-w*costheta;

        var x3 = x;
        var y3 = y-w/costheta;

        var x4 = x-l*costheta-w*sintheta;
        var y4 = y+l*sintheta-w*costheta;

        var x5 = x-l*costheta+w*sintheta;
        var y5 = y+l*sintheta+w*costheta;

        var x6 = x;
        var y6 = y+w/costheta;

        ctx.save();
        ctx.lineWidth = 1;
        ctx.fillStyle = this.diagram.miter_color;

        if(this.diagram.hc_colors[this.hc]) {
            ctx.fillStyle = this.diagram.hc_colors[this.hc];
        }

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.quadraticCurveTo(x3, y3, x4, y4);
        ctx.lineTo(x5, y5);
        ctx.quadraticCurveTo(x6, y6, x1, y1);
        ctx.closePath()
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.quadraticCurveTo(x3, y3, x4, y4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x5, y5);
        ctx.quadraticCurveTo(x6, y6, x1, y1);
        ctx.stroke();

        ctx.restore();
    },

    draw_up: function(ctx, x, y, t) {
        ctx.save();
        if(this.uo == 'O') {
            ctx.fillStyle = this.diagram.over_color;
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.fillStyle = this.diagram.under_color;
            ctx.globalCompositeOperation = 'destination-over';
        }
        ctx.lineWidth = 1;
        if(this.diagram.hc_colors[this.hc]) {
            ctx.fillStyle = this.diagram.hc_colors[this.hc];
        }
        
        ctx.translate(x, y);
        ctx.rotate(this.diagram.angle);

        if(this.uo == 'O') {
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.stroke();

        if(this.uo == 'U') { // because of how compositing works, an under needs to be filled in after the lines are drawn
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.restore();
    },
    draw_down: function(ctx, x, y, t) {
        ctx.save();
        if(this.uo == 'O') {
            ctx.fillStyle = this.diagram.over_color;
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.fillStyle = this.diagram.under_color;
            ctx.globalCompositeOperation = 'destination-over';
        }
        ctx.lineWidth = 1;
        if(this.diagram.hc_colors[this.hc]) {
            ctx.fillStyle = this.diagram.hc_colors[this.hc];
        }
        
        ctx.translate(x, y);
        ctx.rotate(-this.diagram.angle);
        if(this.uo == 'O') {
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.stroke();

        if(this.uo == 'U') { // because of how compositing works, an under needs to be filled in after the lines are drawn
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.restore();
    },
    draw_right: function(ctx, x, y, t) {
        ctx.save();
        if(this.uo == 'O') {
            ctx.fillStyle = this.diagram.over_color;
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.fillStyle = this.diagram.under_color;
            ctx.globalCompositeOperation = 'destination-over';
        }
        ctx.lineWidth = 1;
        if(this.diagram.hc_colors[this.hc]) {
            ctx.fillStyle = this.diagram.hc_colors[this.hc];
        }
        
        ctx.translate(x, y);
        ctx.rotate(Math.PI/2+this.diagram.angle);

        if(this.uo == 'O') {
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.stroke();

        if(this.uo == 'U') {
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.restore();
    },
    draw_left: function(ctx, x, y, t) {
        ctx.save();
        if(this.uo == 'O') {
            ctx.fillStyle = this.diagram.over_color;
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.fillStyle = this.diagram.under_color;
            ctx.globalCompositeOperation = 'destination-over';
        }
        ctx.lineWidth = 1;
        if(this.diagram.hc_colors[this.hc]) {
            ctx.fillStyle = this.diagram.hc_colors[this.hc];
        }
        
        ctx.translate(x, y);
        ctx.rotate(Math.PI/2-this.diagram.angle);

        if(this.uo == 'O') {
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
        ctx.stroke();

        if(this.uo == 'U') {
            ctx.fillRect(-this.diagram.part_dist*.5-.5, -this.diagram.strand_width*.5, this.diagram.part_dist+1, this.diagram.strand_width);
        }

        ctx.restore();
    },
    draw_type: {
        right: function(ctx, t) {
            this.draw_right(ctx, this.x, this.y, t);
            if(this.y+1 > 0) {
                this.draw_right(ctx, this.x, this.y-this.diagram.height, t);
            } else if(this.y-1 < -this.diagram.height) {
                this.draw_right(ctx, this.x, this.y+this.diagram.height, t);
            }
        },
        left: function(ctx, t) {
            this.draw_left(ctx, this.x, this.y, t);
            if(this.y+1 > 0) {
                this.draw_left(ctx, this.x, this.y-this.diagram.height, t);
            } else if(this.y-1 < -this.diagram.height) {
                this.draw_left(ctx, this.x, this.y+this.diagram.height, t);
            }
        },
        right_miter: function(ctx, t) {
            ctx.save();
            ctx.translate(this.x, this.y)
            ctx.rotate(-Math.PI/2)
            this.draw_top_miter(ctx, 0, 0, t);
            ctx.restore();

            if(this.y+1 > 0) {
                ctx.save();
                ctx.translate(this.x, this.y-this.diagram.height)
                ctx.rotate(-Math.PI/2)
                this.draw_top_miter(ctx, 0, 0, t);
                ctx.restore();
            } else if(this.y-1 < -this.diagram.height) {
                ctx.save();
                ctx.translate(this.x, this.y+this.diagram.height)
                ctx.rotate(-Math.PI/2)
                this.draw_top_miter(ctx, 0, 0, t);
                ctx.restore();
            }
        },
        left_miter: function(ctx, t) {
            ctx.save();
            ctx.translate(this.x, this.y)
            ctx.rotate(-Math.PI/2)
            this.draw_bottom_miter(ctx, 0, 0, t);
            ctx.restore();

            if(this.y+1 > 0) {
                ctx.save();
                ctx.translate(this.x, this.y-this.diagram.height)
                ctx.rotate(-Math.PI/2)
                this.draw_bottom_miter(ctx, 0, 0, t);
                ctx.restore();
            } else if(this.y-1 < -this.diagram.height) {
                ctx.save();
                ctx.translate(this.x, this.y+this.diagram.height)
                ctx.rotate(-Math.PI/2)
                this.draw_bottom_miter(ctx, 0, 0, t);
                ctx.restore();
            }
        },
        bottom_miter: function(ctx, t) {
            this.draw_bottom_miter(ctx, this.x, this.y, t);
            if(this.x-1 < 0) {
                this.draw_bottom_miter(ctx, this.x+this.diagram.width, this.y, t);
            } else if(this.x+1 > this.diagram.width) {
                this.draw_bottom_miter(ctx, this.x-this.diagram.width, this.y, t);
            }
        },
        top_miter: function(ctx, t) {
            this.draw_top_miter(ctx, this.x, this.y, t);
            if(this.x-1 < 0) {
                this.draw_top_miter(ctx, this.x+this.diagram.width, this.y, t);
            } else if(this.x+1 > this.diagram.width) {
                this.draw_top_miter(ctx, this.x-this.diagram.width, this.y, t);
            }
        },
        up: function(ctx, t) {
            this.draw_up(ctx, this.x, this.y, t);
            if(this.x-1 < 0) {
                this.draw_up(ctx, this.x+this.diagram.width, this.y, t);
            } else if(this.x+1 > this.diagram.width) {
                this.draw_up(ctx, this.x-this.diagram.width, this.y, t);
            }
        },
        down: function(ctx, t) {
            this.draw_down(ctx, this.x, this.y, t);
            if(this.x-1 < 0) {
                this.draw_down(ctx, this.x+this.diagram.width, this.y, t);
            } else if(this.x+1 > this.diagram.width) {
                this.draw_down(ctx, this.x-this.diagram.width, this.y, t);
            }
        }
    },
    draw: function(ctx, t) {
        bind(this.draw_type[this.type], this)(ctx, t);
    }
};

var knot_ui;
addLoadEvent(function(e) {
    knot_ui = new KnotUI();
});
