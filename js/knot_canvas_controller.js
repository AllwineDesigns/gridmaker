function KnotCanvasController(knot_canvas, knot_grid) {
    this.init(knot_canvas, knot_grid);
}

KnotCanvasClickMode = {
    COPY: "copy",
    PASTE: "paste",
    TOGGLE_CODING: "toggle_coding",
    SET_OVER: "set_over",
    SET_UNDER: "set_under",
    SET_EMPTY: "set_empty",
    SET_UPPER_BIGHT: "set_upper_bight",
    SET_LOWER_BIGHT: "set_lower_bight",
    SET_LEFT_BIGHT: "set_left_bight",
    SET_RIGHT_BIGHT: "set_right_bight",
    SET_HORIZONTAL_BIGHTS: "set_horizontal_bights",
    SET_VERTICAL_BIGHTS: "set_vertical_bights",
    SET_SLASH: "set_slash",
    SET_BACKSLASH: "set_backslash",
    SET_X: "set_x",
    SET_BRUSH: "set_brush",
    REMOVE_STRAND: "remove_strand",
    TOGGLE_STRAND_CODING: "toggle_strand_coding"
};

KnotCanvasBrushes = [
    {brush:
".*.*^*.*.*.*\n" +
"*.*/*\\*.*.*.\n" +
".*/*^*\\*.*.*\n" +
"*<*<*>*>*.*.\n" +
".*\\*X*/*^*.*\n" +
"*\\*X*X*/*\\*.\n" +
".*X*X*X*^*\\*\n" +
"*X*X*X*X*>*>\n" +
".*X*X*X*v*/*\n" +
"*/*X*X*\\*/*.\n" +
".*/*X*\\*v*.*\n" +
"*<*<*>*>*.*.\n" +
".*\\*v*/*.*.*\n" +
"*.*\\*/*.*.*.\n" +
".*.*v*.*.*.*\n",
label: "celtic"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*Y*Y*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "A"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*Y*Y*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "B"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "C"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "D"
    },
    {
        brush:  "X*Y*Y\n" +
                "*X*X*\n" +
                "K*X*X\n" +
                "*X*X*\n" +
                "K*Y*Y\n" +
                "*X*X*\n" +
                "K*X*X\n" +
                "*X*X*\n" +
                "X*Y*Y\n",
        label: "E"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "K*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "F"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "K*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "G"
    },
    {
        brush:  "X*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*Y*Y*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "H"
    },
    {
        brush:  "X\n" +
                "*\n" +
                "K\n" +
                "*\n" +
                "K\n" +
                "*\n" +
                "K\n" +
                "*\n" +
                "X\n",
        label: "I"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "X*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "J"
    },
    {
        brush:  "X*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "K"
    },
    {
        brush:  "X*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "L"
    },
    {
        brush:  "X*Y*X*Y*X\n" +
                "*X*X*X*X*\n" +
                "K*X*K*X*K\n" +
                "*X*X*X*X*\n" +
                "K*X*X*X*K\n" +
                "*X*X*X*X*\n" +
                "K*X*X*X*K\n" +
                "*X*X*X*X*\n" +
                "X*X*X*X*X\n",
        label: "M"
    },
    {
        brush:  "X*Y*X*X\n" +
                "*X*X*X*\n" +
                "K*X*K*K\n" +
                "*X*X*X*\n" +
                "K*X*Y*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "N"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "O"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "P"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*Y\n",
        label: "Q"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "R"
    },
    {
        brush:  "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "K*X*X*X\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n" +
                "*X*X*X*\n" +
                "X*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "S"
    },
    {
        brush:  "Y*X*Y\n" +
                "*X*X*\n" +
                "X*K*X\n" +
                "*X*X*\n" +
                "X*K*X\n" +
                "*X*X*\n" +
                "X*K*X\n" +
                "*X*X*\n" +
                "X*X*X\n",
        label: "T"
    },
    {
        brush:  "X*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*Y*Y*X\n",
        label: "U"
    },
    {
        brush:  "X*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*K*K*X\n",
        label: "V"
    },
    {
        brush:  "X*X*X*X*X\n" +
                "*X*X*X*X*\n" +
                "K*X*X*X*K\n" +
                "*X*X*X*X*\n" +
                "K*X*X*X*K\n" +
                "*X*X*X*X*\n" +
                "K*X*K*X*K\n" +
                "*X*X*X*X*\n" +
                "X*Y*X*Y*X\n",
        label: "W"
    },
    {
        brush:  "X*X*X*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*K*K*X\n" +
                "*X*X*X*\n" +
                "K*X*X*K\n" +
                "*X*X*X*\n" +
                "X*X*X*X\n",
        label: "X"
    },
    {
        brush:  "K*X*K\n" +
                "*X*X*\n" +
                "X*K*X\n" +
                "*X*X*\n" +
                "X*K*Y\n" +
                "*X*X*\n" +
                "X*K*X\n" +
                "*X*X*\n" +
                "X*X*X\n",
        label: "Y"
    },
    {
        brush:  "Y*Y*X\n" +
                "*X*X*\n" +
                "X*X*K\n" +
                "*X*X*\n" +
                "X*Y*X\n" +
                "*X*X*\n" +
                "K*K*X\n" +
                "*X*X*\n" +
                "X*Y*Y\n",
        label: "Z"
    },

    {
        brush:  
"X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*Y*X*Y*X*X*X*X*X*Y*X*X*X*X*Y*Y*X*X*X*Y*Y*X*X*X*X*X*X*X*Y*Y*X*X*X*Y*Y*X*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*K*X*K*X*X*X*K*X*X*X*K*X*X*K*X*K*X*K*X*K*X*K*X*K*X*K*K*X*K*X*X*K*X*K*X*X*X*K*X*X*K*X*K*X*X*K*X*K*X*X*X*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*K*X*K*X*X*X*K*X*X*X*K*X*X*K*X*K*X*X*X*K*X*K*X*K*X*Y*K*X*K*X*X*K*X*K*Y*Y*X*K*X*X*K*X*K*X*X*K*X*X*Y*Y*X*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*K*X*K*X*X*X*K*X*X*X*K*X*X*K*X*K*X*X*X*K*X*K*X*K*X*X*K*X*K*X*X*K*X*K*X*X*X*K*X*X*K*X*K*X*X*K*X*X*X*X*K*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*X*X*X*Y*Y*X*X*Y*Y*X*X*Y*Y*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*Y*Y*X*X*X*Y*Y*X*X*Y*Y*X*X*X*Y*Y*X*X*X*Y*Y*X*X\n",
        label: "ILLUMINOEUDS"

    },
    {
        brush:  
"X*Y*Y*X*X*Y*Y*X*X*Y*Y*X*X*Y*Y*X*X*X*X*X*X*X*Y*X*X*X*\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*K\n" +
"K*X*X*X*K*X*X*K*K*X*X*X*K*X*X*K*K*X*X*K*K*K*X*K*K*X*\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X\n" +
"K*Y*Y*X*K*Y*Y*X*K*Y*Y*X*K*Y*Y*K*K*Y*Y*X*K*K*X*Y*K*X*\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X\n" +
"K*X*X*X*K*X*X*K*K*X*X*X*K*X*X*K*K*X*X*K*K*K*X*X*K*X*\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X\n" +
"X*X*X*X*X*X*X*X*X*Y*Y*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n",
        label: "FREAKIN"

    },
    {
        brush:  
//  F                 R                  E                  A                   K                I                N         '
"X*Y*Y" + "*X*" + "X*Y*Y*X" + "*X*" + "X*Y*Y" + "*X*" + "X*Y*Y*X" + "*X*" + "X*X*X*X" + "*X*" + "X" + "*X*" + "X*Y*X*X" + "*K*" + "\n" +
"*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*" + "X*X" + "*X*X*X*" + "X*X" + "\n" +
"K*X*X" + "*X*" + "K*X*X*K" + "*X*" + "K*X*X" + "*X*" + "K*X*X*K" + "*X*" + "K*X*X*K" + "*X*" + "K" + "*X*" + "K*X*K*K" + "*X*" + "\n" +
"*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*" + "X*X" + "*X*X*X*" + "X*X" + "\n" +
"K*Y*Y" + "*X*" + "K*Y*Y*X" + "*X*" + "K*Y*Y" + "*X*" + "K*Y*Y*K" + "*X*" + "K*Y*Y*X" + "*X*" + "K" + "*X*" + "K*X*Y*K" + "*X*" + "\n" +
"*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*" + "X*X" + "*X*X*X*" + "X*X" + "\n" +
"K*X*X" + "*X*" + "K*X*X*K" + "*X*" + "K*X*X" + "*X*" + "K*X*X*K" + "*X*" + "K*X*X*K" + "*X*" + "K" + "*X*" + "K*X*X*K" + "*X*" + "\n" +
"*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*" + "X*X" + "*X*X*X*" + "X*X" + "\n" +
"X*X*X" + "*X*" + "X*X*X*X" + "*X*" + "X*Y*Y" + "*X*" + "X*X*X*X" + "*X*" + "X*X*X*X" + "*X*" + "X" + "*X*" + "X*X*X*X" + "*X*" +  "\n",
        label: "FREAKIN2"

    },
    {
        brush:  
//  M                     E               N    
 "X*Y*X*Y*X"+ "*X*" + "X*Y*Y"+ "*X*" + "X*Y*X*X" + "\n" +
 "*X*X*X*X*"+ "X*X" + "*X*X*"+ "X*X" + "*X*X*X*" + "\n" +
 "K*X*K*X*K"+ "*X*" + "K*X*X"+ "*X*" + "K*X*K*K" + "\n" +
 "*X*X*X*X*"+ "X*X" + "*X*X*"+ "X*X" + "*X*X*X*" + "\n" +
 "K*X*X*X*K"+ "*X*" + "K*Y*Y"+ "*X*" + "K*X*Y*K" + "\n" +
 "*X*X*X*X*"+ "X*X" + "*X*X*"+ "X*X" + "*X*X*X*" + "\n" +
 "K*X*X*X*K"+ "*X*" + "K*X*X"+ "*X*" + "K*X*X*K" + "\n" +
 "*X*X*X*X*"+ "X*X" + "*X*X*"+ "X*X" + "*X*X*X*" + "\n" +
 "X*X*X*X*X"+ "*X*" + "X*Y*Y"+ "*X*" + "X*X*X*X" +  "\n",
        label: "MEN"
    },
    {
        brush:  
"X*Y*Y*X*X*X*X*X*X*X*Y*Y*X*X*Y*Y*X*Y*X*Y\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"K*X*X*X*K*X*X*X*K*K*X*X*X*K*X*X*X*X*K*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*Y*Y*X*K*X*X*X*K*K*Y*Y*X*K*Y*Y*X*X*K*Y\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*X*X*K*K*X*K*X*K*K*X*X*X*K*X*X*X*X*K*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*Y*Y*X*X*Y*X*Y*X*X*Y*Y*X*X*Y*Y*X*X*X*X\n",
        label: "SWEET"

    },
    {
        brush:  
//  S                    W                   E                 E                 T  
"X*Y*Y*X" + "*X*" + "X*X*X*X*X" + "*X*" + "X*Y*Y" + "*X*" + "X*Y*Y" + "*X*" + "Y*X*Y" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "\n" +
"K*X*X*X" + "*X*" + "K*X*X*X*K" + "*X*" + "K*X*X" + "*X*" + "K*X*X" + "*X*" + "X*K*X" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "\n" +
"X*Y*Y*X" + "*X*" + "K*X*X*X*K" + "*X*" + "K*Y*Y" + "*X*" + "K*Y*Y" + "*X*" + "X*K*X" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "\n" +
"X*X*X*K" + "*X*" + "K*X*K*X*K" + "*X*" + "K*X*X" + "*X*" + "K*X*X" + "*X*" + "X*K*X" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*" + "\n" +
"X*Y*Y*X" + "*X*" + "X*Y*X*Y*X" + "*X*" + "X*Y*Y" + "*X*" + "X*Y*Y" + "*X*" + "X*X*X" +  "\n",
        label: "SWEET2"

    },
    {
        brush:  
"X*X*X*X*X*Y*X*X*X*Y*Y*X*Y*X*Y*X*Y*Y*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"K*X*X*K*K*X*K*K*K*X*X*K*X*K*X*K*X*X*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"K*Y*Y*X*K*X*Y*K*K*X*X*K*X*K*Y*X*Y*Y*X\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"K*X*X*K*K*X*X*K*K*X*X*K*X*K*X*X*X*X*K\n" +
"*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
"X*X*X*X*X*X*X*X*X*Y*Y*X*X*X*X*X*Y*Y*X\n",
        label: "KNOTS"

    },
    {
        brush:  
//  K                   N                   O                  T                  S  
"X*X*X*X" + "*X*" + "X*Y*X*X" + "*X*" + "X*Y*Y*X" + "*X*" + "Y*X*Y" + "*X*" + "X*Y*Y*X" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "\n" +
"K*X*X*K" + "*X*" + "K*X*K*K" + "*X*" + "K*X*X*K" + "*X*" + "X*K*X" + "*X*" + "K*X*X*X" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "\n" +
"K*Y*Y*X" + "*X*" + "K*X*Y*K" + "*X*" + "K*X*X*K" + "*X*" + "X*K*X" + "*X*" + "X*Y*Y*X" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "\n" +
"K*X*X*K" + "*X*" + "K*X*X*K" + "*X*" + "K*X*X*K" + "*X*" + "X*K*X" + "*X*" + "X*X*X*K" + "\n" +
"*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*X*" + "X*X" + "*X*X*" + "X*X" + "*X*X*X*" + "\n" +
"X*X*X*X" + "*X*" + "X*X*X*X" + "*X*" + "X*Y*Y*X" + "*X*" + "X*X*X" + "*X*" + "X*Y*Y*X" +  "\n",
        label: "KNOTS2"

    },
    {
        brush:  "X*v*\n" +
                "*>*<\n" +
                "X*^*\n",
        label: "hole"
    },
    {
        brush:  "^*.*^*.*^*.*^*.*\n" +
                "*\\*/*\\*/*\\*/*\\*/\n" +
                "^*X*^*X*^*X*^*X*\n" +
                "*X*X*X*X*X*X*X*X\n" +
                "X*X*X*X*X*X*X*X*\n" +
                "*X*v*X*v*X*v*X*v\n",
        label: "dog bone top"
    },
    {
        brush:  "*X*^*X*^*X*^*X*^\n" +
                "X*X*X*X*X*X*X*X*\n" +
                "*X*X*X*X*X*X*X*X\n" +
                "v*X*v*X*v*X*v*X*\n" +
                "*/*\\*/*\\*/*\\*/*\\\n" +
                "v*.*v*.*v*.*v*.*\n",
        label: "dog bone bottom"
    },
    {
        brush:   "\\*^*^*/\n" +
                 "*X*X*X*\n" +
                 "<*X*X*>\n" +
                 "*X*X*X*\n" +
                 "/*v*v*\\\n",
        label: "Carric Bend"
    },
    {
        brush:  "\\*^*/\n" +
                "*X*X*\n" +
                "<*X*>\n" +
                "*X*X*\n" +
                "<*X*>\n" +
                "*X*X*\n" +
                "/*v*\\\n",
        label: "Vertical Carric Bend"
    },
    {
         brush: "X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*X*\n" +
                "*v*v*v*X*X*X*v*v*v*X*X*X*v*v*v*X*X*X\n" +
                "\\*^*^*/*X*X*\\*^*^*/*X*X*\\*^*^*/*X*X*\n" +
                "*X*X*X*<*X*>*X*X*X*<*X*>*X*X*X*<*X*>\n" +
                "<*X*X*>*X*X*<*X*X*>*X*X*<*X*X*>*X*X*\n" +
                "*X*X*X*/*v*\\*X*X*X*/*v*\\*X*X*X*/*v*\\\n" +
                "X*v*v*X*^*^*X*v*v*X*^*^*X*v*v*X*^*^*\n" +
                "*\\*^*/*X*X*X*\\*^*/*X*X*X*\\*^*/*X*X*X\n" +
                ">*X*X*<*X*X*>*X*X*<*X*X*>*X*X*<*X*X*\n" +
                "*<*X*>*X*X*X*<*X*>*X*X*X*<*X*>*X*X*X\n" +
                "\\*X*X*/*v*v*\\*X*X*/*v*v*\\*X*X*/*v*v*\n" +
                "*X*X*X*^*^*^*X*X*X*^*^*^*X*X*X*^*^*^\n",
        label: "Carric Bend Pattern"
    }

];

// turn brush strings into nested arrays
for(var i = 0; i < KnotCanvasBrushes.length; i++) {
    var brush_str = KnotCanvasBrushes[i].brush;
    var brush_rows = brush_str.split("\n");
    var brush = [];
    for(var j = 0; j < brush_rows.length; j++) {
        brush.push(brush_rows[j].split(""));
    }
    KnotCanvasBrushes[i].brush = brush;
}

KnotCanvasResizeMode = {
    RESIZE: "resize",
    STRETCH: "stretch"
};

KnotCanvasController.prototype = {
    init: function(canvas, grid) {
        this.do_letter_pins = false;
        this.canvas = canvas;
        this.grid = grid;

        this.undos = [];
        this.redos = [];

        this.cursor_row = -1;
        this.cursor_col = -1;

        this.show_pins = true;
        this.show_grid_points = true;

        this.colors = [ "peru" ];
        this.shadow_colors = [ "saddlebrown" ];
        this.outline_colors = [ "black " ];

        this.canvas.setController(this);

        this.body = document.getElementsByTagName("body")[0];

        this.click_mode = KnotCanvasClickMode.TOGGLE_CODING;
        this.resize_mode = KnotCanvasResizeMode.RESIZE;
        this.resize_side = "none";
        this.resize_size = {};
        this.resizing = false;

        this.autofill = true;

        this.DPI = 90;
       
//        this.strand_width = 1/8*this.DPI;
//        log(this.strand_width);
//        this.strand_gap_size = 2;
//        this.shadow_width = 1;
        this.strand_width = 1/8*this.DPI;
        this.strand_height = this.strand_width;
        this.strand_gap_size = 1/8*this.DPI;
//        this.shadow_width = 20;
        this.shadow_width = .045*this.DPI;

        this.grid_spacing = {
            row: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2,
            col: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2
        }
        this.padding = {
            x: 0,
            y: 10
        };

        this.last_coords = { x: 0, y: 0 };

        this.connectSignals();

        var size = this.calcWidthHeight(this.grid.rows, this.grid.cols);
//        log("initial size: " + size.width + ", " + size.height);
        this.canvas.resize(size.width, size.height);
        signal(this, "canvas_resized");
    },

    setDPI: function(dpi) {
        var sw = this.strand_width/this.DPI;
        var sg = this.strand_gap_size/this.DPI;
        this.DPI = dpi;
        this.strand_width = sw*this.DPI;
        this.strand_height = this.strand_width;
        this.strand_gap_size = sg*this.DPI;
        this.shadow_width = .045*this.DPI;
        this.padding = {
            x: 0,
            y: 10/90*this.DPI
        };

        this.grid_spacing = {
            row: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2,
            col: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2
        }
        knot_app.update();
    },

    setStrandWidth: function(sw) {
        this.strand_width = sw;
        this.strand_height = this.strand_width;

        this.grid_spacing = {
            row: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2,
            col: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2
        }
        knot_app.update();
    },
    setGapSize: function(s) {
        this.strand_gap_size = s;

        this.grid_spacing = {
            row: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2,
            col: (this.strand_width+this.strand_gap_size)*Math.sqrt(2)/2
        }
        knot_app.update();
    },

    saveUndo: function() {
        this.undos.push(this.grid.copy());
        this.redos = [];
    },
    
    update: function() {
        this.grid.updateKnotInfo();
        var wh = this.calcWidthHeight(this.grid.rows, this.grid.cols);
        this.canvas.resize(wh.width, wh.height);
        this.canvas.render();
    },

    undo: function() {
        if(this.undos.length) {
            this.redos.push(this.grid);
            this.grid = this.undos.pop();
            knot_app.update();
        }
    },

    strandLengths: function(start_locs) {
        var lengths = [];

        // very approximate length of a single piece, in pixels
        var piece = Math.sqrt(this.grid_spacing.row*this.grid_spacing.row+this.grid_spacing.col*this.grid_spacing.col+this.strand_height*this.strand_height);

        for(var i = 0; i < start_locs.length; i++) {
            var start_loc = start_locs[i];
            var walker = new KnotGridWalker(this.grid, start_loc);
            var len = 0;
            while(walker.next()) {
                len += piece;
            }
            lengths.push(len);
        }
        return lengths;
    },

    redo: function() {
        if(this.redos.length) {
            this.undos.push(this.grid);
            this.grid = this.redos.pop();
            knot_app.update();
        }
    },

    getColors: function(row,col) {
        var info = this.grid.knot_info[row][col];
        var select_strand = false;
        var cursor_info;
        if(this.cursor_row != -1 && this.cursor_col != -1) {
            cursor_info = this.grid.knot_info[this.cursor_row][this.cursor_col];
            if(cursor_info) {
                if(cursor_info.length > 1) {
                    cursor_info = cursor_info[this.alt_down ? 0 : 1];
                } else {
                    cursor_info = cursor_info[0];
                }
                if(this.click_mode == KnotCanvasClickMode.REMOVE_STRAND ||
                    this.click_mode == KnotCanvasClickMode.TOGGLE_STRAND_CODING) {
                    select_strand = true;
                }
            }
        }
        if(this.grid.grid[row][col] == KnotGridValues.X) {
            var colors = {
                outline: "black"
            };
            if(this.grid.coding[row][col] == CodingValues.O) {
                for(var i = 0; i < info.length; i++) {
                    switch(info[i].dir) {
                        case KnotDirection.UP_RIGHT:
                        case KnotDirection.DOWN_LEFT:
                            if(select_strand && info[i].strand == cursor_info.strand) {
                                colors.under = 'yellow';
                                colors.shadow = 'yellow';
                            } else {
                                colors.under = this.colors[info[i].strand%this.colors.length];
                                colors.shadow = this.shadow_colors[info[i].strand%this.shadow_colors.length];
                            }
                            break;
                        case KnotDirection.DOWN_RIGHT:
                        case KnotDirection.UP_LEFT:
                            if(select_strand && info[i].strand == cursor_info.strand) {
                                colors.over = 'yellow';
                            } else {
                                colors.over = this.colors[info[i].strand%this.colors.length];
                            }
                            break;
                    }
                }
            } else {
                for(var i = 0; i < info.length; i++) {
                    switch(info[i].dir) {
                        case KnotDirection.UP_RIGHT:
                        case KnotDirection.DOWN_LEFT:
                            if(select_strand && info[i].strand == cursor_info.strand) {
                                colors.over = 'yellow';
                            } else {
                                colors.over = this.colors[info[i].strand%this.colors.length];
                            }
                            break;
                        case KnotDirection.DOWN_RIGHT:
                        case KnotDirection.UP_LEFT:
                            if(select_strand && info[i].strand == cursor_info.strand) {
                                colors.under = 'yellow';
                                colors.shadow = 'yellow';
                            } else {
                                colors.under = this.colors[info[i].strand%this.colors.length];
                                colors.shadow = this.shadow_colors[info[i].strand%this.shadow_colors.length];
                            }
                            break;
                    }
                }
            }

            if(this.partial_grid.grid[row][col] == KnotGridValues.SLASH &&
                this.grid.coding[row][col] == CodingValues.O) {
                colors.over = colors.under;
            } else if(this.partial_grid.grid[row][col] == KnotGridValues.BACKSLASH &&
                this.grid.coding[row][col] == CodingValues.U) {
                colors.over = colors.under;
            }

            return colors;
        } else {
            if(info) {
                var colors = {
                    over: this.colors[info[0].strand%this.colors.length],
                    outline: "black"
                };
                if(select_strand && info[0].strand == cursor_info.strand) {
                    colors.over = 'yellow';
                }

                return colors;
            } else {
                return {
                    over: "pink",
                    under: "pink",
                    shadow: "pink",
                    outline: "pink"
                };
            }
        }
    },

    getHalfCycle: function() {
        return this.draw_hc || 0;
    },
    setHalfCycle: function(hc) {
        this.draw_hc = hc;
        if(!this.instructions || this.instructions.getNumHalfCycles() == 0) {
            this.partial_grid = this.grid;
        } else {
            this.partial_grid = this.instructions.getPartialGrid(this.draw_hc);
        }
    },

    getPinKnotGrid: function() {
        return this.grid;
    },

    getKnotGrid: function() {
        return this.partial_grid;
    },

    getLastCoords: function() {
        return this.last_coords;
    },

    connectSignals: function() {
        connect(document, "onmousemove", bind(this.mouseMove, this));
        connect(document, "onmousedown", bind(this.mouseDown, this));
        connect(document, "onmouseup", bind(this.mouseUp, this));
    },

    mouseUp: function(e) {
        var coords = this.canvas.getRelativeCoordinates(e.mouse().page);
        if(this.click_mode == KnotCanvasClickMode.COPY) {
            var row;
            var col;
            if(this.rows_wrap) {
                row = Math.floor((coords.y-this.padding.y)/this.grid_spacing.row);
            } else {
                row = Math.floor((coords.y-.5*this.strand_width-this.padding.y+this.grid_spacing.row*.5)/this.grid_spacing.row);
            }
            if(this.cols_wrap) {
                col = Math.floor((coords.x-this.padding.x)/this.grid_spacing.col);
            } else {
                col = Math.floor((coords.x-.5*this.strand_width-this.padding.x+this.grid_spacing.col*.5)/this.grid_spacing.col);
            }
            if(row >= 0 && row < this.grid.rows && col >= 0 && col < this.grid.cols && this.grid.grid[row][col] != KnotGridValues.INVALID) {
                var from_row;
                var from_col;
                var to_row;
                var to_col;
                if(row > this.copy_from_row) {
                    from_row = this.copy_from_row;
                    to_row = row;
                } else {
                    to_row = this.copy_from_row;
                    from_row = row;
                }

                if(col > this.copy_from_col) {
                    from_col = this.copy_from_col;
                    to_col = col;
                } else {
                    from_col = col;
                    to_col = this.copy_from_col;
                }

                var brush = {
                    brush: [],
                    label: "copy"
                };

                for(var r = from_row; r <= to_row; r++) {
                    brush.brush[r-from_row] = [];
                    for(var c = from_col; c <= to_col; c++) {
                        brush.brush[r-from_row][c-from_col] = this.grid.grid[r][c];
                    }
                }
                console.log(brush);

                this.copy_brush = brush;
            }
        } else {
            this.resizing = false;
            this.canvas.render();
        }
    },

    mouseDown: function(e) {
        var coords = this.canvas.getRelativeCoordinates(e.mouse().page);

        var size = this.canvas.getSize();
        var rc = this.calcMaxRowsCols(size.width, size.height);
        var wh = this.calcWidthHeight(rc.rows, rc.cols);
        var rc2 = this.calcMaxRowsCols(wh.width, wh.height);
        var wh2 = this.calcWidthHeight(rc2.rows, rc2.cols);

        if(this.resize_side != "none") {
            this.saveUndo();
            this.resize_coords = coords;
            this.resizing = true;
            this.resize_size = this.canvas.getSize();
            knot_app.update();
        } else {
            var row;
            var col;
            if(this.rows_wrap) {
                row = Math.floor((coords.y-this.padding.y)/this.grid_spacing.row);
            } else {
                row = Math.floor((coords.y-.5*this.strand_width-this.padding.y+this.grid_spacing.row*.5)/this.grid_spacing.row);
            }
            if(this.cols_wrap) {
                col = Math.floor((coords.x-this.padding.x)/this.grid_spacing.col);
            } else {
                col = Math.floor((coords.x-.5*this.strand_width-this.padding.x+this.grid_spacing.col*.5)/this.grid_spacing.col);
            }
            if(row >= 0 && row < this.grid.rows && col >= 0 && col < this.grid.cols && this.grid.grid[row][col] != KnotGridValues.INVALID) {
                this.saveUndo();
                switch(this.click_mode) {
                    case KnotCanvasClickMode.TOGGLE_CODING:
                        this.grid.coding[row][col] = this.grid.coding[row][col] == "O" ? "U" : "O";
                        break;
                    case KnotCanvasClickMode.SET_OVER:
                        this.grid.coding[row][col] = CodingValues.O;
                        break;
                    case KnotCanvasClickMode.SET_UNDER:
                        this.grid.coding[row][col] = CodingValues.U;
                        break;
                    case KnotCanvasClickMode.SET_UPPER_BIGHT:
                        this.grid.grid[row][col] = KnotGridValues.UPPER_BIGHT;
                        break;
                    case KnotCanvasClickMode.SET_LOWER_BIGHT:
                        this.grid.grid[row][col] = KnotGridValues.LOWER_BIGHT;
                        break;
                    case KnotCanvasClickMode.SET_LEFT_BIGHT:
                        this.grid.grid[row][col] = KnotGridValues.LEFT_BIGHT;
                        break;
                    case KnotCanvasClickMode.SET_RIGHT_BIGHT:
                        this.grid.grid[row][col] = KnotGridValues.RIGHT_BIGHT;
                        break;
                    case KnotCanvasClickMode.SET_HORIZONTAL_BIGHTS:
                        this.grid.grid[row][col] = KnotGridValues.HORIZONTAL_BIGHTS;
                        break;
                    case KnotCanvasClickMode.SET_VERTICAL_BIGHTS:
                        this.grid.grid[row][col] = KnotGridValues.VERTICAL_BIGHTS;
                        break;
                    case KnotCanvasClickMode.SET_SLASH:
                        this.grid.grid[row][col] = KnotGridValues.SLASH;
                        break;
                    case KnotCanvasClickMode.SET_BACKSLASH:
                        this.grid.grid[row][col] = KnotGridValues.BACKSLASH;
                        break;
                    case KnotCanvasClickMode.SET_EMPTY:
                        this.grid.grid[row][col] = KnotGridValues.EMPTY;
                        break;
                    case KnotCanvasClickMode.SET_X:
                        this.grid.grid[row][col] = KnotGridValues.X;
                        break;
                    case KnotCanvasClickMode.REMOVE_STRAND:
                        var cursor_info = this.grid.knot_info[row][col];
                        if(cursor_info.length > 1) {
                            cursor_info = cursor_info[this.alt_down ? 0 : 1];
                        } else {
                            cursor_info = cursor_info[0];
                        }
                        var loc = new KnotLocation(row, col, cursor_info.dir);
                        this.grid.removeStrand(loc);
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    case KnotCanvasClickMode.TOGGLE_STRAND_CODING:
                        var cursor_info = this.grid.knot_info[row][col];
                        if(cursor_info.length > 1) {
                            cursor_info = cursor_info[this.alt_down ? 0 : 1];
                        } else {
                            cursor_info = cursor_info[0];
                        }
                        var loc = new KnotLocation(row, col, cursor_info.dir);
                        this.grid.toggleStrandCoding(loc);
                        e.preventDefault();
                        e.stopPropagation();
                        break;
                    case KnotCanvasClickMode.SET_BRUSH:
                        var brush = this.brush.brush;
                        for(var r = 0; r < brush.length; r++) {
                            for(var c = 0; c < brush[r].length; c++) {
                                var brush_row = r+row;
                                if(this.grid.rows_wrap) {
                                    brush_row = brush_row%this.grid.rows;
                                }
                                var brush_col = c+col;
                                if(this.grid.cols_wrap) {
                                    brush_col = brush_col%this.grid.cols;
                                }
                                if(brush[r][c] != KnotGridValues.INVALID &&
                                    brush_row < this.grid.rows &&
                                    brush_col < this.grid.cols) {
                                    this.grid.grid[brush_row][brush_col] = brush[r][c];
                                }
                            }
                        }
                        break;
                    case KnotCanvasClickMode.COPY:
                        this.copy_from_row = row;
                        this.copy_from_col = col; 
                        return;
                        break;
                }
                this.grid.updateKnotInfo();
                knot_app.update();
            }
        }

    },

    calcMaxRowsCols: function(width, height) {
        var rows;
        var cols;
        if(this.grid.rows_wrap) {
            rows = Math.floor((height-2*this.padding.y)/this.grid_spacing.row);
            rows = Math.floor(rows*.5)*2; // must be even
        } else {
            rows = Math.floor((height-this.strand_width-2*this.padding.y)/this.grid_spacing.row+1);
        }
        if(this.grid.cols_wrap) {
            cols = Math.floor((width-2*this.padding.x)/this.grid_spacing.col);
            cols = Math.floor(cols*.5)*2; // must be even
//            cols = (width-2*this.padding.x)/this.grid_spacing.col;
        } else {
            cols = Math.floor((width-this.strand_width-2*this.padding.x)/this.grid_spacing.col+1);
        }

        return {
            rows: rows,
            cols: cols
        };
    },

    calcWidthHeight: function(rows,cols) {
        if(this.grid.rows_wrap) {
            height = rows*this.grid_spacing.row+2*this.padding.y;
        } else {
            height = (rows-1)*this.grid_spacing.row+this.strand_width+2*this.padding.y;
        }
        if(this.grid.cols_wrap) {
            width = cols*this.grid_spacing.col+2*this.padding.x;
        } else {
            width = (cols-1)*this.grid_spacing.col+this.strand_width+2*this.padding.x;
        }

        width = Math.floor(width)+1;
        height = Math.floor(height)+1;

        return {
            width: width,
            height: height
        };
    },

    setRowsCols: function(rows,cols) {
        var oldrows = this.grid.rows;
        var oldcols = this.grid.cols;
        rc = this.calcMaxRowsCols(width, height);
        this.grid.resize(rows,cols);
        if(this.autofill) {
            this.grid.fill();
            this.grid.updateKnotInfo();
        }
        signal(this, "grid_resized");

        wh = this.calcWidthHeight(rows, cols);
        width = wh.width;
        height = wh.height;

        this.strand_gap_size = this.grid_spacing.row*2/Math.sqrt(2)-this.strand_width;

        this.canvas.resize(width, height);
        signal(this, "canvas_resized");
        this.canvas.render();
    },

    mouseMove: function(e) {
        var coords = this.canvas.getRelativeCoordinates(e.mouse().page);
        var size = this.canvas.getSize();

        if(this.resizing) {
            var width = this.resize_size.width;
            var height = this.resize_size.height;

            if(this.resize_side == "e" || this.resize_side == "se") {
                width += coords.x-this.resize_coords.x;
            }
            if(this.resize_side == "s" || this.resize_side == "se") {
                height += coords.y-this.resize_coords.y;
            }

            if(this.resize_mode == KnotCanvasResizeMode.RESIZE) {
                var oldrows = this.grid.rows;
                var oldcols = this.grid.cols;
                rc = this.calcMaxRowsCols(width, height);
                this.grid.resize(rc.rows,rc.cols);
                if(this.autofill) {
                    this.grid.fill();
                    this.grid.updateKnotInfo();
                }
                signal(this, "grid_resized");

                wh = this.calcWidthHeight(rc.rows, rc.cols);
                width = wh.width;
                height = wh.height;
            } else {
                if(this.grid.cols_wrap) {
                    this.grid_spacing.col = (width-2*this.padding.x)/this.grid.cols;
                } else {
                    this.grid_spacing.col = (width-this.strand_width-2*this.padding.x)/(this.grid.cols-1);
                }

                if(this.grid.rows_wrap) {
                    this.grid_spacing.row = (height-2*this.padding.y)/this.grid.rows;
                } else {
                    this.grid_spacing.row = (height-this.strand_width-2*this.padding.y)/(this.grid.rows-1);
                }
            }
            this.strand_gap_size = this.grid_spacing.row*2/Math.sqrt(2)-this.strand_width;

            this.canvas.resize(width, height);
            signal(this, "canvas_resized");
            this.canvas.render();
            e.preventDefault();
            e.stopPropagation();
        } else {
            if(Math.abs(size.width-coords.x) <= 5 &&
                Math.abs(size.height-coords.y) <= 5) {
                this.body.style.cursor = "nwse-resize";
                this.resize_side = "se";
            } else if(Math.abs(size.width-coords.x) <= 5 &&
                        coords.y > 5 && coords.y < size.height-5) {
                this.body.style.cursor = "ew-resize";
                this.resize_side = "e";
            } else if(Math.abs(size.height-coords.y) <= 5 &&
                         coords.x > 5 && coords.x < size.width-5) {
                this.body.style.cursor = "ns-resize";
                this.resize_side = "s";
            } else {
                this.body.style.cursor = "auto";
                this.resize_side = "none";
                var row;
                var col;
                if(this.rows_wrap) {
                    row = Math.floor((coords.y-this.padding.y)/this.grid_spacing.row);
                } else {
                    row = Math.floor((coords.y-.5*this.strand_width-this.padding.y+this.grid_spacing.row*.5)/this.grid_spacing.row);
                }
                if(this.cols_wrap) {
                    col = Math.floor((coords.x-this.padding.x)/this.grid_spacing.col);
                } else {
                    col = Math.floor((coords.x-.5*this.strand_width-this.padding.x+this.grid_spacing.col*.5)/this.grid_spacing.col);
                }
                if(row >= 0 && row < this.grid.rows && col >= 0 && col < this.grid.cols && this.grid.grid[row][col] != KnotGridValues.INVALID) {
                    this.cursor_row = row;
                    this.cursor_col = col;
                    this.canvas.render();
                } else {
                    this.cursor_row = -1;
                    this.cursor_col = -1;
                    this.canvas.render();
                }
            }
        }

        this.last_coords = coords;
    },

    setClickMode: function(mode) {
        this.click_mode = mode;
    }
};
