objects.titlescreen = function () {
    this.update = function () {
        canvas.draw_image("mainbg", 0, 0)
        canvas.draw_image("version", 0, 430)
        if (keypresses.enter) select_screen (1)
    }
}

objects.randomscreen = function () {
    this.update = function () {
        canvas.draw_image("keytest", 0, 0)
        if (keypresses.enter && keys.alt) alert("A")
    }
}
