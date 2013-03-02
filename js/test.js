addLoadEvent(function(e) {
    test = $("test");

    test.width = 500;
    test.height = 500;
    elem_pos = getElementPosition(test);

    connect(test, "onmousemove", function(e) {
        page_pos = e.mouse().page;

        $("pagex").innerHTML = page_pos.x;
        $("pagey").innerHTML = page_pos.y;

        $("x").innerHTML = page_pos.x-elem_pos.x;
        $("y").innerHTML = page_pos.y-elem_pos.y;

        log(e);
    });
});
