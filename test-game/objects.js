objects.titlescreen = function () {
    this.update = function () {
        canvas.draw_image("mainbg", gamedata.ticks % 2, gamedata.ticks % 2)
        if (keys[13]) console.log("Y")
    }
}
