function KnotUI() {
    this.init();
}

KnotUI.prototype = {             
    knot: new Knot(11, 7, false),
    elements: {},
    init: function() {
        this.diagram = new KnotDiagram({
            knot: this.knot,
            part_dist: 20,
            bight_dist: 30,
            strand_width: 10
        });
        this.initElements();
        this.connectSignals();
        this.updateHalfCycles();
        this.elements.canvas.width = this.diagram.width;
        this.elements.canvas.height = this.diagram.height+60;
        this.drawKnot();
    },

    initElements: function() {
        this.elements.parts = $("parts");
        this.elements.bights = $("bights");
        this.elements.half_cycles = $("half_cycles");
        this.elements.canvas = $("canvas");
    },

    connectSignals: function() {
        connect(this.elements.parts, "onchange", bind(this.updateKnot, this));
        connect(this.elements.bights, "onchange", bind(this.updateKnot, this));
    },

    updateKnot: function() {
        try {
            var parts = parseInt(this.elements.parts.value);
            var bights = parseInt(this.elements.bights.value);
            var knot = new Knot(parts, bights);

            this.knot.parts = parts;
            this.knot.bights = bights;
            this.knot.solve();

            this.updateHalfCycles();
            this.diagram.calc_knot();
            this.elements.canvas.width = this.diagram.width;
            this.elements.canvas.height = this.diagram.height+60;
            this.drawKnot();
        } catch(err) { 
        }
    },

    updateHalfCycles: function() {
        this.elements.half_cycles.innerHTML = "";
        forEach(this.knot.half_cycles, bind(function(hc) {
            this.elements.half_cycles.appendChild(
                DIV({ 'class': "hc" }, hc.toString())
            );
        }, this));
    },

    drawKnot: function() {
        var ctx = this.elements.canvas.getContext("2d");

        this.diagram.draw(ctx, 1);
    }
};

function KnotDiagram(opts) {
    this.init({
        knot: opts.knot,
        part_dist: opts.part_dist,
        bight_dist: opts.bight_dist,
        strand_width: opts.strand_width
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
        var hyp = this.knot.parts*this.part_dist;
        var x = (this.knot.half_cycles[0].to_pin-1+.5*((this.knot.bights+1)%2))*this.bight_dist;

        this.height = Math.sqrt(hyp*hyp-x*x);
        this.width = this.knot.bights*this.bight_dist;

        this.angle = Math.acos(x/hyp);
        this.dx = this.part_dist*Math.cos(this.angle)
        this.dy = this.part_dist*Math.sin(this.angle)

        this.half_cycles = [];

        var startx = 0;
        var starty = 0;
        for(var i = 0; i < this.knot.half_cycles.length; i++) {
            this.half_cycles[i] = [];
            for(var j = 0; j < this.knot.parts-1; j++) {
                var over = (this.knot.sobre && this.knot.coding[j] == "/") ||
                           (!this.knot.sobre && this.knot.coding[j] == "\\");
                if(i%2 && (this.knot.bights%2)) {
                    over = !over;
                }

                this.half_cycles[i].push(new KnotPiece({
                    diagram: this,
                    x: (startx+(j+1)*this.dx) % this.width,
                    y: starty+((i%2) ? -1 : 1)*(j+1)*this.dy,
                    type: (i%2) ? 'down' : 'up',
                    uo: over ? 'O' : 'U'
                }));
            }
            startx = (startx+this.knot.parts*this.dx) % this.width;
            starty = starty+((i%2) ? -1 : 1)*this.knot.parts*this.dy;
            this.half_cycles[i].push(new KnotPiece({
                diagram: this,
                x: startx,
                y: starty,
                type: (i%2) ? 'bottom_miter' : 'top_miter',
                uo: 'O'
            }));
        }
    },
    draw: function(ctx, hc, t) {
        this.clear(ctx);
        ctx.save();
        this.set_origin(ctx);
        ctx.restore();
    },
    draw: function(ctx, t) {
        this.clear(ctx);
        ctx.save();
        this.set_origin(ctx);
        var end_i = this.half_cycles.length*t;
        for(var i = 0; i < end_i; i++) {
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
    set_origin: function(ctx) {
        ctx.scale(1, -1);
        ctx.translate(0, -this.height-10);
    },

    clear: function(ctx) {
        ctx.save();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    }
};

function KnotPiece(opts) {
    this.init({
        x: opts.x,
        y: opts.y,
        diagram: opts.diagram,
        type: opts.type,
        uo: opts.uo
    });
}

KnotPiece.prototype = {
    init: function(opts) {
        update(this, opts);
    },
    draw_type: {
        bottom_miter: function(ctx, t) {
            ctx.save();
            ctx.lineWidth = this.diagram.strand_width;
            var x1 = this.x-this.diagram.dx*.5;
            var y1 = this.y+this.diagram.dy*.5

            var x2 = this.x;
            var y2 = this.y;

            var x3 = this.x+this.diagram.dx*.5;
            var y3 = this.y+this.diagram.dy*.5

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            if(x1 < 0) {
                x1 += this.diagram.width;
                x2 += this.diagram.width;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.restore();
        },
        top_miter: function(ctx, t) {
            ctx.save();
            ctx.lineWidth = this.diagram.strand_width;
            var x1 = this.x-this.diagram.dx*.5;
            var y1 = this.y-this.diagram.dy*.5

            var x2 = this.x;
            var y2 = this.y;

            var x3 = this.x+this.diagram.dx*.5;
            var y3 = this.y-this.diagram.dy*.5

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.stroke();

            if(x1 < 0) {
                x1 += this.diagram.width;
                x2 += this.diagram.width;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
            ctx.restore();
        },
        up: function(ctx, t) {
            ctx.save();
            if(this.uo == 'O') {
                ctx.fillStyle = "rgba(255,0,0,1)";
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.fillStyle = "rgba(0,255,0,1)";
                ctx.globalCompositeOperation = 'destination-over';
            }
            ctx.lineWidth = 1;
//            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.strokeStle = "rgba(0,0,0,1)";
            
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.diagram.angle);
            ctx.fillRect(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5, this.diagram.part_dist, this.diagram.strand_width);

            ctx.beginPath();
            ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
            ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
            ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
            ctx.stroke();
            ctx.restore();

            if(this.x-this.diagram.part_dist*.5 < 0) {
                ctx.save();
                ctx.translate(this.x+this.diagram.width, this.y);
                ctx.rotate(this.diagram.angle);
                ctx.fillRect(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5, this.diagram.part_dist, this.diagram.strand_width);

                ctx.beginPath();
                ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
                ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
                ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
                ctx.stroke();
                ctx.restore();
            }

            ctx.restore();
        },
        down: function(ctx, t) {
            ctx.save();
            if(this.uo == 'O') {
                ctx.fillStyle = "rgba(255,0,0,1)";
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.fillStyle = "rgba(0,255,0,1)";
                ctx.globalCompositeOperation = 'destination-over';
            }
            ctx.lineWidth = 1;
//            ctx.fillStyle = "rgba(255,255,255,1)";
            ctx.strokeStle = "rgba(0,0,0,1)";
            
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(-this.diagram.angle);
            ctx.fillRect(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5, this.diagram.part_dist, this.diagram.strand_width);

            ctx.beginPath();
            ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
            ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
            ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
            ctx.stroke();
            ctx.restore();

            if(this.x-this.diagram.part_dist*.5 < 0) {
                ctx.save();
                ctx.translate(this.x+this.diagram.width, this.y);
                ctx.rotate(-this.diagram.angle);
                ctx.fillRect(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5, this.diagram.part_dist, this.diagram.strand_width);

                ctx.beginPath();
                ctx.moveTo(-this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
                ctx.lineTo(this.diagram.part_dist*.5, -this.diagram.strand_width*.5);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(-this.diagram.part_dist*.5, this.diagram.strand_width*.5);
                ctx.lineTo(this.diagram.part_dist*.5, this.diagram.strand_width*.5);
                ctx.stroke();
                ctx.restore();
            }

            ctx.restore();
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
