/* knot.js by John Allwine jallwine86@yahoo.com
 *
 * Copyright (c) 2008 John Allwine
 *
 */

function gcd(x,y) {
    if( y == 0 ) return x;

    return gcd(y, x%y);
}

function HalfCycle(d) {
    this.init(d);
}

HalfCycle.prototype = {
    dir: 'L',
    from_pin: 0,
    to_pin: 0,
    init: function(d) {
        this.dir = d;
        this.run_list = [];
    },
    toString: function() {
        var from_side = (this.dir == 'L') ? 'R' : 'L';
        var to_side = (this.dir == 'L') ? 'L' : 'R';

        var str = "from " + from_side + " pin " + this.from_pin + " " + (this.run_list.length == 0 ? '' : (this.run_list_str() + " ")) +
                  "to " + to_side + " pin " + this.to_pin;

        return str;
    },
    run_list_str: function() {
        var run_list = [];

        for(var i = 0; i < this.run_list.length; i++) {
            if(run_list.length == 0 || run_list[run_list.length-1].uo != this.run_list[i]) {
                run_list.push({
                    uo: this.run_list[i],
                    count: 1
                });
            } else {
                run_list[run_list.length-1].count++;
            }
        }

        var run_list_strs = [];
        for(var i = 0; i < run_list.length; i++) {
            run_list_strs.push("" + run_list[i].uo + run_list[i].count);
        }

        return run_list_strs.join(" ");
    }
};

function Knot(p, b, sobre, coding) {
    this.init(p, b, sobre, coding);
}

Knot.prototype = {
    parts: 5,
    bights: 4,
    coding_part: "\\/", 
    init: function(p, b, sobre, coding_part) {
        if(p) this.parts = p;
        if(b) this.bights = b;
        if(coding_part) this.coding_part = coding_part;
        this.sobre = sobre;
        this.solve();
    },
    fill_coding: function() {
        this.coding = "";
        for(var i = 0; i < this.parts-1; i++) {
            this.coding += this.coding_part[i%this.coding_part.length];
        }
    },

    check_conditions: function() {
        if(this.parts > 0 && this.bights > 0) {
            if(gcd(this.parts, this.bights) != 1) {
                // remove this when implementing multiple strands
                // for now only solves single strand turksheads
                throw "the parts and bights must have a greatest common divisor of 1";
            }
        } else {
            throw "the parts and bights both must be greater than 0";
        }
    },

    init_vars: function() {
        this.n = Math.floor(this.parts/this.bights);
        this.r = this.parts%this.bights;
        this.v = this.bights - this.r;
        this.cbn = [];
        this.top_cbn = [];
        this.bot_cbn = [];
        this.top_uo = [];
        this.bot_uo = [];
        this.half_cycles = [];
        this.pins = [];
    },

    solve: function() {
        this.check_conditions();
        this.fill_coding();
        this.init_vars();
        this.fill_cbn();
        this.fill_uo();
        this.fill_pins();
        this.fill_half_cycles();
    },

    fill_cbn: function() {
        for(var c = 0;  c < this.bights; c++) {
            this.cbn[(c*this.v) % this.bights] = c;
        }

        for(var c = 0; c < this.parts-1; c++) {
            this.top_cbn[c] = this.cbn[(c+1) % this.bights];
            this.bot_cbn[this.parts-1-c-1] = this.cbn[(c+1) % this.bights];
        }
    },

    fill_uo: function() {
        for(var i = 0; i < this.parts-1; i++) {
            if(this.coding[i] == '\\') {
                if(this.sobre) {
                    this.top_uo.push('O');
                    this.bot_uo.push('U');
                } else {
                    this.top_uo.push('U');
                    this.bot_uo.push('O');
                }
            } else {
                if(this.sobre) {
                    this.top_uo.push('U');
                    this.bot_uo.push('O');
                } else {
                    this.top_uo.push('O');
                    this.bot_uo.push('U');
                }
            }
        }
    },
    fill_pins: function() {
        this.pins.push(1);

        var m = 2*this.bights;
        if(this.parts % 2) {
            for(var i = 1; i < m; i++) {
                var r = (i*this.parts) % m;
                this.pins.push(Math.floor(r/2)+1);
            }
        } else {
            for(var i = 1; i < m; i++) {
                var r = (i*this.parts) % m;
                if(r == 0) {
                    r = (i*this.parts+1) %m;
                    this.pins.push(Math.floor(r/2)+1);
                } else if(i % 2) {
                    this.pins.push(Math.floor(r/2)+1);
                } else {
                    this.pins.push(Math.floor((r+1)/2)+1);
                }
            }
        }

        this.pins.push(1);
    },
    fill_half_cycles: function() {
        var going_right = true;
        var hc = new HalfCycle('R');
        hc.from_pin = this.pins[0];
        hc.to_pin = this.pins[1];

        this.half_cycles.push(hc);

        for(var hc_num = 2; hc_num <= 2*this.bights; hc_num++) {
            going_right = !going_right;
            hc = new HalfCycle(going_right ? 'R' : 'L');
            hc.from_pin = this.pins[hc_num-1];
            hc.to_pin = this.pins[hc_num];

            var cbn = (hc_num-2-(hc_num%2))/2;

            if(hc_num%2) {
                for(var i = 0; i < this.top_uo.length; i++) {
                    if(this.top_cbn[i] <= cbn) {
                        hc.run_list.push(this.top_uo[i]);
                    }
                }
            } else {
                for(var i = this.bot_uo.length-1; i >= 0; i--) {
                    if(this.bot_cbn[i] <= cbn) {
                        hc.run_list += this.bot_uo[i];
                    }
                }
            }

            this.half_cycles.push(hc);
        }
    }
};
