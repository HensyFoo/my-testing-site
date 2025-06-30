// click 音效
export function playClick() {
  const audio = new Audio('/sounds/click.mp3');
  audio.play();
}

// 胜利音效
export function playWin() {
  const audio = new Audio('/sounds/win.mp3');
  audio.play();
}

// 平局音效
export function playDraw() {
  const audio = new Audio('/sounds/draw.mp3');
  audio.play();
}

// 背景音乐 —— 创建一个可控的 Audio 实例
const bgAudio = new Audio('/sounds/bg.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.5;

export function playBackground() {
  bgAudio.play();
}

export function stopBackground() {
  bgAudio.pause();
  bgAudio.currentTime = 0;
}
