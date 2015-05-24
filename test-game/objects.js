objects.titlescreen = function () {
    this.update = function () {
        canvas.draw_image("mainbg", gamedata.ticks % 2, gamedata.ticks % 2)
        if (keys.enter) console.log("Y")
        if (keypresses.enter) console.log("X")
    }
}
