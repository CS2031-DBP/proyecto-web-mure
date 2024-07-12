const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const playAudioWithFade = (url, fadeDuration = 1) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    const track = audioContext.createMediaElementSource(audio);
    const gainNode = audioContext.createGain();
    track.connect(gainNode).connect(audioContext.destination);

    audio.addEventListener('canplaythrough', () => {
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
      audio.play();
      resolve(audio);
    });

    audio.addEventListener('error', (e) => {
      reject(e);
    });
  });
};

export const stopAudioWithFade = (audio, fadeDuration = 1) => {
  return new Promise((resolve) => {
    const gainNode = audioContext.createGain();
    const track = audioContext.createMediaElementSource(audio);
    track.connect(gainNode).connect(audioContext.destination);

    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);

    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      resolve();
    }, fadeDuration * 1000);
  });
};
