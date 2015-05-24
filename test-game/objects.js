objects.titlescreen = function () {
    this.update = function () {
        canvas.draw_image("mainbg", gamedata.ticks % 2, gamedata.ticks % 2)
        if (keypresses.enter) console.log("X")
    }
}
