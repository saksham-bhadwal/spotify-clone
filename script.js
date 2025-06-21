let currentsong = new Audio();

let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {


    let a = await fetch("/songs/")
    let response = await a.text()

    // console.log(response);

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs;

}

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/"+track)
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function main() {



     songs = await getsongs()

    playmusic(songs[0], true)

      let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li> 
                        <img class="invert" src="music.svg" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20", " ")}</div>
                            <div>Saksham</div>
                        </div>
                        <div class="playnow">
                          <span>Play Now</span>
                            <img class ="invert" src="play.svg"  alt="">
                        </div>
        
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })


    // to play next and previous

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = " play.svg"
        }
    })

    // for timeupdate

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    // evenlister to seekabr

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent =(e.offsetX/e.target.getBoundingClientRect().width)* 100
       document.querySelector(".circle").style.left = percent + "%";
       currentsong.currentTime = (currentsong.duration ) * percent/100
    })

    // add an event listerner for hamburgur

 // Toggle sidebar on hamburger click
document.querySelector(".hamburgur").addEventListener("click", () => {
    const sidebar = document.querySelector(".left");
    
    if (sidebar.style.left === "0px") {
        sidebar.style.left = "-110%"; // Hide sidebar
    } else {
        sidebar.style.left = "0"; // Show sidebar
    }
});
   
//    add an event lisetrner to previour and next button
         previous.addEventListener("click",()=>{
            console.log('clicked');
        
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            if((index+1) >=0){

                playmusic(songs[index-1])
            } 
            
         })

         next.addEventListener("click",()=>{
            currentsong.pause()

            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            if((index+1) < songs.length  ){

                playmusic(songs[index+1])
            } 
         })
}

main()