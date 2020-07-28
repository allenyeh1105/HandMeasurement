let imageInput;
let handImage;
let paperSizeSelect;
let rectifyButton;

let paperWidth = [216, 216, 279, 148, 210, 297];
let paperHeight = [279, 356, 432, 210, 297, 420];
let sizeSelectOption = ['Letter (216 x 279 mm)', 'Legal (216 x 356 mm)', 'Ledger (279 x 432 mm)', 'A5 (148 x 210 mm)', 'A4 (210 x 297 mm)', 'A3 (297 x 420 mm)' ];

let rectifyWidth, rectifyHeight;
let rectified = false;
let rectifiedImage;
let paperCorner = [];
let rectifiedCorner = [];

let startLocation, endLocation;

function setup() {
  createCanvas(1024, 900);
  
  
  // file input
  imageInput = createFileInput(gotFile);
  imageInput.position(0, 0);
  
  // paper size
  paperSizeSelect = createSelect();
  paperSizeSelect.position(800, 50);
  for(let i=0;i<sizeSelectOption.length;i++){
    paperSizeSelect.option(sizeSelectOption[i]);
  }
  paperSizeSelect.selected(sizeSelectOption[4]);
  paperSizeSelect.changed(paperSizeSelectEvent);
  rectifyWidth = paperWidth[4];
  rectifyHeight = paperHeight[4];
  
  // rectify
  rectifyButton = createButton('Rectify Image');
  rectifyButton.position(800, 80);
  rectifyButton.mousePressed(rectifyImage);
  
  
}

function draw() {
  background(255);
  //translate(-width/2, -height/2);
  if(!rectified){
    if(handImage){
      image(handImage,10,30);
    }
    stroke( 243, 156, 18); // Change the color
    strokeWeight(10); // Make the points 10 pixels in size
    for(let i=0; i<paperCorner.length;i++){
      point(10+paperCorner[i].x, 30+paperCorner[i].y);
    }
    
    rectMode(CORNER);
    fill( 33, 47, 61 );
    noStroke();
    textSize(15);
    textAlign(LEFT, TOP);
    let description = "To use it,\n* select the photo showed hand on top of one white paper(specific size).\n* select the paper size by the drop-down list.\n* click the paper corner on the photo, the sequence need to be Top-Left, Top-right, Bottom-Left, and Bottom-Right.\n* click rectify image button."
    text(description, 800, 120, 200, 600);
  } else if(rectifiedImage) {
      image(rectifiedImage, 10, 30);
      if(startLocation && endLocation){
        print("drawline");
        print(startLocation);
        print(endLocation);
        stroke(236, 112, 99); // Change the color
        strokeWeight(5); // Make the points 10 pixels in size
        line(startLocation.x, startLocation.y, endLocation.x, endLocation.y);
        
        // calculate the real length
        let lineLength = dist(startLocation.x, startLocation.y, endLocation.x, endLocation.y) / 2;
        let lineLengthString = int(lineLength) + " mm";
        noStroke();
        fill(93, 173, 226);
        textAlign(CENTER, CENTER);
        textSize(20);
        push();
        translate(endLocation.x, endLocation.y + 20);
        text(lineLengthString, 0, 0);
        pop();
      }
      rectMode(CORNER);
        fill( 33, 47, 61 );
        noStroke();
        textSize(15);
        textAlign(LEFT, TOP);
        let description = "To use it,\n* click and drag the cursor on the rectified image, the measurement will show.";
        text(description, 800, 120, 200, 600);
  } else {
    // create rectified graphic
    rectifiedImage = createGraphics(rectifyWidth * 2, rectifyHeight * 2, WEBGL);
    rectifiedImage.background(255);
    rectifiedImage.textureWrap(CLAMP);
    rectifiedImage.texture(handImage);
    rectifiedImage.beginShape();  
    rectifiedImage.vertex(rectifiedCorner[0].x, rectifiedCorner[0].y, 0, paperCorner[0].x, paperCorner[0].y);
    rectifiedImage.vertex(rectifiedCorner[1].x, rectifiedCorner[1].y, 0, paperCorner[1].x, paperCorner[1].y);
    rectifiedImage.vertex(rectifiedCorner[3].x, rectifiedCorner[3].y, 0, paperCorner[3].x, paperCorner[3].y);
    rectifiedImage.vertex(rectifiedCorner[2].x, rectifiedCorner[2].y, 0, paperCorner[2].x, paperCorner[2].y);
    rectifiedImage.endShape(CLOSE);
  }
}

function gotFile(file) {
  if (file.type === 'image') {
    handImage = loadImage(file.data, resizeImage);
  } else {
    handImage = null;
  }
}

function resizeImage(){
  print(handImage.width + "," + handImage.height);
  if(handImage.width<=handImage.height){
    handImage.resize(0, 720);
  } else {
    handImage.resize(720, 0);
  }
  paperCorner = [];
  rectifiedCorner = [];
  imageInput.hide();
}

function paperSizeSelectEvent() {
  let item = paperSizeSelect.value();
  for(let i=0;i<sizeSelectOption.length;i++){
    if(item === sizeSelectOption[i]){
      rectifyWidth = paperWidth[i];
      rectifyHeight = paperHeight[i];
      break;
    }
  }
  
}

function mouseClicked() {
  if(!rectified && handImage){
    if(mouseX >= 10 && mouseX < 10+handImage.width && mouseY >= 30 && mouseY < 30+handImage.height){
      append(paperCorner, createVector(mouseX-10, mouseY-30));
    }
  }
}

function mousePressed() {
  if(rectified && rectifiedImage){
    if(mouseX >= 10 && mouseX < 10+rectifiedImage.width && mouseY >= 30 && mouseY < 30+rectifiedImage.height){
      startLocation = createVector(mouseX, mouseY);

    }
  }
}

function mouseDragged() {
  if(rectified && rectifiedImage){
    if(mouseX >= 10 && mouseX < 10+rectifiedImage.width && mouseY >= 30 && mouseY < 30+rectifiedImage.height){
      endLocation = createVector(mouseX, mouseY);
      
    }
  }
}

function mouseReleased() {
  if(rectified && handImage){
    startLocation = null;
    endLocation = null;
  }
}

function rectifyImage(){
  append(rectifiedCorner, createVector(-rectifyWidth, -rectifyHeight));
  append(rectifiedCorner, createVector(rectifyWidth, -rectifyHeight));
  append(rectifiedCorner, createVector(-rectifyWidth, rectifyHeight));
  append(rectifiedCorner, createVector(rectifyWidth, rectifyHeight));
  //print(rectifiedCorner);
  //print(paperCorner);
  rectified = true;
  rectifyButton.hide();
  paperSizeSelect.hide();
  

}
