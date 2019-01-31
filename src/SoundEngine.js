
console.log('in music');

// var sound = new Howl({
//  src: ['sound/kashyyyk.mp3']
// });
// sound.play();

var sound = new Howl({
    src: ['sound/kashyyyk.mp3'],
    autoplay: true,
    loop: true,
    volume: 5,
    onend: function() {
      console.log('Finished!');
    }
});

//todo not linked up yet
// document.getElementById("playPause").onclick( () => {
//   console.log('clicked');
//   if(sound.playing()) {
//     sound.pause();
//   } else {
//     sound.play();
//   }
// });
