export function playClick() {
  const audio = new Audio('/sounds/click.mp3');
  audio.play();
}

export function playWin() {
  const audio = new Audio('/sounds/win.mp3');
  audio.play();
}

export function playDraw() {
  const audio = new Audio('/sounds/draw.mp3');
  audio.play();
}

export function playBackground() {
  const audio = new Audio('/sounds/bg.mp3');
  audio.loop = true;
  audio.volume = 0.5;
  audio.play();
  return audio;
}
