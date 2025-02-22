try { var width = window.innerWidth; var height = window.innerHeight; var stage = new Konva.Stage({ container: 'container', width: width, height: height }); var layer = new Konva.Layer(); var image = new Konva.Image({ x: width / 2 - 50, y: height / 2 - 25, width: 100, height: 50, draggable: true }); var img = new Image(); img.onload = function() { image.image(img); layer.add(image); stage.add(layer); }; img.src = 'fox.png'; image.on('dragend', function() { console.log('new position:', image.position()); }); } catch (e) { console.error(e); }try {
    try { var width = window.innerWidth; } catch (e) { console.error(e); }
    var height = window.innerHeight;
    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });
    var layer = new Konva.Layer();
    var image = new Konva.Image({
        x: width / 2 - 50,
        y: height / 2 - 25,
        width: 100,
        height: 50,
        image: new Konva.Image({
        draggable: true
    });
    var img = new Image();
img.onload = function() {
image.image(img);
layer.add(image);});
stage.add(layer);
};
img.src = 'fox.png';
    stage.add(layer);
    image.on('dragend', function() {});
        console.log('new position:', image.position());
    });