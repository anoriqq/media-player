
/* global checkProgres:true, playback, checkMouse, showOverlay */

/**
 * キーボードショートカット
 * @param {object} e KeyboardEventオブジェクト
 * @returns {void}
 */
document.onkeydown = function(e){
	/* onkeydownしたキーがspaceで､videoが存在する時true */
	if(e.keyCode == 32 && document.getElementById("video").src != ""){
		/* 再生中ならtrue */
		if (document.getElementById("video").paused){
			document.getElementById("video").play();
			checkProgres = setInterval(playback,10);
		} else {
			document.getElementById("video").pause();
			clearInterval(checkMouse);
			clearInterval(checkProgres);
			showOverlay();
		}
	}

	/* upキーを押したときに音量を上げる */
	if(e.keyCode == 38){
		if(Math.round(document.getElementById("video").volume * 100) < 99){
			document.getElementById("video").volume = (Math.round(document.getElementById("video").volume * 100) + 2) / 100;
		}else{
			document.getElementById("video").volume = 1;
		}
		setTimeout(function(){
			document.getElementById("volumeHover").classList.remove("show");
			document.getElementById("volumePointer").classList.remove("show");
		},1000);
	}

	/* downキーを押したときに音量を下げる */
	if(e.keyCode == 40){
		if(Math.round(document.getElementById("video").volume * 100) > 1){
			document.getElementById("video").volume = (Math.round(document.getElementById("video").volume * 100) - 2) / 100;
		}else{
			document.getElementById("video").volume = 0;
		}
		setTimeout(function(){
			document.getElementById("volumeHover").classList.remove("show");
			document.getElementById("volumePointer").classList.remove("show");
		},1000);
	}
};
