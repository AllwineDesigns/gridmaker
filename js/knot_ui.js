function KnotUI() {
    this.init();
}

KnotUI.prototype = {
    knot: new Knot(),
    elements: {},
    init: function() {
        this.initElements();
        this.connectSignals();
        this.updateHalfCycles();
    },

    initElements: function() {
        this.elements.parts = $("parts");
        this.elements.bights = $("bights");
        this.elements.half_cycles = $("half_cycles");
    },

    connectSignals: function() {
        connect(this.elements.parts, "onchange", bind(this.updateKnot, this));
        connect(this.elements.bights, "onchange", bind(this.updateKnot, this));
    },

    updateKnot: function() {
        try {
            this.old_knot = this.knot;
            this.knot.parts = this.elements.parts.value;
            this.knot.bights = this.elements.bights.value;
            this.knot.solve();
        } catch(err) {
            this.knot = this.old_knot;
        }
        this.updateHalfCycles();
    },

    updateHalfCycles: function() {
        this.elements.half_cycles.innerHTML = "";
        forEach(this.knot.half_cycles, bind(function(hc) {
            this.elements.half_cycles.appendChild(
                DIV({ 'class': "hc" }, hc.toString())
            );
        }, this));
    }
};

var knot_ui;
addLoadEvent(function(e) {
    knot_ui = new KnotUI();
});
