const handleTouchMove = (event) => {
    event.preventDefault();
};

document.addEventListener('touchmove', handleTouchMove, { passive: false });

let gridSize = 11; // amount of cells on a smallest screen's side
let paletteSize = 8;
let palette = [
  //"#2F2F2F",
  "#000000",
  "#E76F51",
  "#F4A261",
  "#FFCC00", //"#E9C46A",
  "#2A9D8F",
  "#5386E4",
  "#664E4C",
  "#EAE8FF",
];

let shortSideSize;
let longSideSize;

let gridWidth; // amount of cells on a width side
let gridHeight; // amount of cells on a height side

let gridCellSize; // diameter of a cell (dot) in pixels
let gridCellOffset; // offset from screen edge for cell's placement

let interfaceGridCellSize;
let paletteButtons;

let brushColor;

//sound
let polySynth;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  if (window.width < window.height) {
    shortSideSize = window.width;
    longSideSize = window.height;
  } else {
    shortSideSize = window.height;
    longSideSize = window.width;
  }

  // size of a cell and offset chosed from size of minimal side of screen
  gridCellSize = shortSideSize / gridSize;
  gridCellOffset = gridCellSize / 2;

  brushColor = color(255, 204, 0);

  // screen's side dependent parameters
  //
  if (window.width < window.height) {
    // book orientation
    gridWidth = gridSize;
    gridHeight = floor(window.height / gridCellSize) - 3;
    interfaceGridCellSize = window.height - gridHeight * gridCellSize;

    for (let i = 0; i < paletteSize; i++) {
      //fill(random(255), random(255), random(255));
      fill(color(palette[i]));

      rect(
        i * (window.width / paletteSize),
        window.height - interfaceGridCellSize,
        interfaceGridCellSize,
        interfaceGridCellSize,
        20,
        20,
        0,
        0
      );
    }
  } else {
    // album orientation
    gridHeight = gridSize;
    gridWidth = floor(window.width / gridCellSize) - 3;
    interfaceGridCellSize = window.width - gridWidth * gridCellSize;

    for (let i = 0; i < paletteSize; i++) {
      //fill(random(255), random(255), random(255));
      fill(color(palette[i]));

      rect(
        window.width - interfaceGridCellSize,
        i * (window.height / paletteSize),
        interfaceGridCellSize,
        interfaceGridCellSize,
        20,
        20,
        0,
        0
      );
    }
  }

  // draw inicial circles
  for (let w = 0; w < gridWidth; w++) {
    for (let h = 0; h < gridHeight; h++) {
      drawCircle(w, h, brushColor);
    }
  }

  //sound in setup
  polySynth = new p5.PolySynth();

}

function drawCircle(w, h, circleColor) {
  ellipseMode(CENTER);
  fill(circleColor);
  circle(
    w * gridCellSize + gridCellOffset,
    h * gridCellSize + gridCellOffset,
    gridCellSize
  );
}

function mouseCentered(mousePosition) {
  return floor(mousePosition / gridCellSize);
}

function mousePressed() {
  if (mouseCentered(mouseX) < gridWidth && mouseCentered(mouseY) < gridHeight) {
    let c = get(
      mouseCentered(mouseX) * gridCellSize + gridCellOffset,
      mouseCentered(mouseY) * gridCellSize + gridCellOffset
    );

    drawCircle(mouseCentered(mouseX), mouseCentered(mouseY), brushColor);

    if (
      brushColor.levels[0] != c[0] ||
      brushColor.levels[1] != c[1] ||
      brushColor.levels[2] != c[2] ||
      brushColor.levels[3] != c[3]
    ) {
      playSynth();
    }
  } else {
    let c = get(mouseX, mouseY);
    brushColor = color(c[0], c[1], c[2], c[3]);
  }
}

function mouseDragged() {
  if (mouseCentered(mouseX) < gridWidth && mouseCentered(mouseY) < gridHeight) {
    let c = get(
      mouseCentered(mouseX) * gridCellSize + gridCellOffset,
      mouseCentered(mouseY) * gridCellSize + gridCellOffset
    );
    drawCircle(mouseCentered(mouseX), mouseCentered(mouseY), brushColor);

    if (
      brushColor.levels[0] != c[0] ||
      brushColor.levels[1] != c[1] ||
      brushColor.levels[2] != c[2] ||
      brushColor.levels[3] != c[3]
    ) {
      playSynth();
    }
  }
}

function playSynth() {
  userStartAudio();

  let note = random(["C4", "D4", "E4", "F4", "G4", "A4", "B4"]);
  // note velocity (volume, from 0 to 1)
  let velocity = 0.2; //random();
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 0.2;

  polySynth.play(note, velocity, 0, dur);
}
