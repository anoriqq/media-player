/**
 * @fileoverview メディアプレイヤーのスクリプト｡
 * <br>動作環境 windows10(x64) GoogleChrome(v69.0)
 * @author show0317sw
 */

/* global mediaVolume showOverlay */

/**
 * クリックしてから200ms間だけtrueになる変数｡その間にもう一度クリックされるかを監視して､ダブルクリックを実現する｡
 * @type {boolean}
 */
var clicked = false;

/**
 * ダブルクリックと判定されたときにtrueになる変数｡ダブルクリック時に再生状態を保持する目的｡
 * type {boolean}
 */
var doubleFlag = false;

/**
 * ボリュームを調整中かどうかを保存する変数｡
 * <br>変更中はfalse｡
 * @type {boolean}
 */
var volumeHoverShow = true;

/**
 * seekPointerがドラックされているかを保存する変数｡
 * <br>ドラックされているときtrue｡
 * @type {boolean}
 */
var seekPointerDragFlag = false;

/**
 * volumePointerがドラックされているかを保存する変数｡
 * <br>ドラックされているときtrue｡
 * @type {boolean}
 */
var volumePointerDragFlag = false;

/**
 * マウスポインターのX座標を保存する変数｡
 * <br>マウスが動く度に更新される｡
 * @type {number}
 */
var clientX;

/**
 * マウスの動作を監視して､一定期間動きが無かった場合にオーバーレイを消すインターバル｡
 * <br>開始 => checkMouse = setInterval(mouseMoving,100);
 * <br>停止 => clearInterval(checkMouse);
 */
var checkMouse;

/**
 * シークバーにホバーしたときに表示するバーの処理を実行するインターバル｡
 * <br>開始 => hoverSeekInterval = setInterval(hoverSeek,10);
 * <br>停止 => clearInterval(hoverSeekInterval);
 */
var hoverSeekInterval;

/**
 * フルスクリーン状態をトグルする関数
 * @returns {void}
 */
function changeFullscreen(){
	/* フルスクリーン表示されていなければtrue */
	if (document.webkitFullscreenElement === null){
		document.documentElement.webkitRequestFullScreen(); // フルスクリーンをリクエストする
		document.getElementById("FS_1").style.display = "none";
		document.getElementById("FS_2").style.display = "inline";
	} else {
		document.webkitExitFullscreen(); // フルスクリーンを解除する
		document.getElementById("FS_1").style.display = "inline";
		document.getElementById("FS_2").style.display = "none";
	}
}

/* フルスクリーンボタンがクリックされたときにchangeFullscreenを実行するイベントリスナー */
document.getElementById("fullscreen").addEventListener("click",changeFullscreen);

/**
 * centerがクリックされた時じ実行される関数
 * フルスクリーン/フルスクリーン解除
 * コントローラーをクリックしたときにメディアの再生と一時停止をトグル
 * @returns {void}
 */
document.getElementById("center").onclick = function(){
	/* 200ms後に実行する関数をdoubleClickに保存 */
	var doubleClick = setTimeout(function(){
		clicked = false;
		if (!doubleFlag && document.getElementById("video").src != ""){
			if (document.getElementById("video").paused){
				document.getElementById("video").play();
			} else {
				document.getElementById("video").pause();
				clearInterval(checkMouse);
				showOverlay();
			}
		}
	},200);

	/* ダブルクリック判定時間(200ms)内(=ダブルクリックされた)ならtrue */
	if (clicked){
		clearTimeout(doubleClick); // doubleClickに保存されていたタイムアウトをクリア シングルクリック時の処理は行わない
		changeFullscreen(); // フルスクリーン状態をトグル
		clicked = false;
		doubleFlag = true;
	}else{
		clicked = true;
		doubleFlag = false;
	}
};

/**
 * ミュート状態とトグルする関数
 * @returns {void}
 */
document.getElementById("volumeImageSpace").onclick = function(){
	document.getElementById("video").volume = document.getElementById("video").volume == 0 ? mediaVolume : 0;
};

/**
 * ループ/ループ解除
 * @returns {void}
 */
document.getElementById("loop").onclick = function(){
	document.getElementById("video").loop = !document.getElementById("video").loop;
	document.getElementById("LP_1").style.display = document.getElementById("video").loop ? "none" : "inline";
	document.getElementById("LP_2").style.display = document.getElementById("video").loop ? "inline" : "none";
};

/**
 * volumeSpaceにマウスがのったときにvolumeHoverを表示する関数
 * @returns {void}
 */
document.getElementById("volumeSpace").onmouseenter = function(){
	document.getElementById("volumeHover").classList.add("show");
	document.getElementById("volumePointer").classList.add("show");
};

/**
 * volumeSpaceからマウスが離れたときにvolumeHoverを非表示する関数
 * @returns {void}
 */
document.getElementById("volumeSpace").onmouseleave = function(){
	if(volumeHoverShow){
		document.getElementById("volumeHover").classList.remove("show");
		document.getElementById("volumePointer").classList.remove("show");
	}
};

/**
 * volumeSpaceでマウスホイールが回されたときに実行される関数｡
 * <br>それぞれの方向に音量を更新する｡
 * @param {object} e mousewheelEventオブジェクト
 * @returns {void}
 */
document.getElementById("volumeSpace").onmousewheel = function(e){
	/* マイナス方向にホイール回したとき､かつ､現在の音量が1未満のときtrue */
	if(e.deltaY < 0){
		if(Math.round(document.getElementById("video").volume * 100) < 99){
			document.getElementById("video").volume = (Math.round(document.getElementById("video").volume * 100) + 2) / 100;
		}else{
			document.getElementById("video").volume = 1;
		}
	}

	/* プラス方向にホイールを回したとき､かつ､現在の音量が0より大きいときtrue */
	if(e.deltaY > 0){
		if(Math.round(document.getElementById("video").volume * 100) > 1){
			document.getElementById("video").volume = (Math.round(document.getElementById("video").volume * 100) - 2) / 100;
		}else{
			document.getElementById("video").volume = 0;
		}
	}
};

/**
 * シークバーをクリックしたときに実行される関数｡
 * <br>クリックされた位置のX座標をもとに再生位置を更新する｡
 * @param {object} e onmousedownEventオブジェクト
 * @returns {void}
 */
document.getElementById("seekbarFrame").onmousedown = function(){
	if(document.getElementById("video").src != ""){
		seekPointerDragFlag = true;
		document.getElementById("video").currentTime = document.getElementById("video").duration * Math.round(clientX / window.innerWidth * 10000) / 10000;
	}
};

/**
 * seekPointerがクリックされたときに実行される関数｡
 * @param {object} e mousedownEventオブジェクト
 * @returns {void}
 */
document.getElementById("seekPointer").onmousedown = function(){
	seekPointerDragFlag = true;
	document.getElementById("seekbarFrame").classList.add("show");
	document.getElementById("seekPointer").classList.add("show");
};

/**
 * volumeFrameをクリックしたときに実行される関数｡
 * <br>クリックされた位置のX座標をもとに音量を更新する｡
 * @param {object} e clickイベントオブジェクト
 * @returns {void}
 */
document.getElementById("volumeFrame").onmousedown = function(e){
	volumePointerDragFlag = true;
	document.getElementById("video").volume = Math.round((e.clientX - 50)/150*100)/100;
};

/**
 * volumePointerがクリックされたときに実行される関数｡
 * @param {object} e mousedownEventオブジェクト
 * @returns {void}
 */
document.getElementById("volumePointer").onmousedown = function(){
	volumePointerDragFlag = true;
	volumeHoverShow = false;
	document.getElementById("volumeHover").classList.add("show");
	document.getElementById("volumePointer").classList.add("show");
};

/**
 * volumePointerをクリックしたままマウスを動かしたとき]に実行される関数｡
 * <br>volumePointerを左右にドラッグされたときに音量を更新する｡
 * @param {object} e mousedownEventオブジェクト
 * @returns {void}
 */
window.onmousemove = function(e){
	clientX = e.clientX;
	var volumePointerX;
	if(volumePointerDragFlag && e.clientX != 0){
		if(e.clientX >= 45 && e.clientX <= 195){
			volumePointerX = e.clientX;
		}else if(e.clientX <= 45){
			volumePointerX = 45;
		}else{
			volumePointerX = 195;
		}
		document.getElementById("volumePointer").style.left = volumePointerX + "px";
		document.getElementById("video").volume = Math.round((volumePointerX - 45) / 150 * 100) / 100;
	}else if(seekPointerDragFlag){
		document.getElementById("video").currentTime = document.getElementById("video").duration * Math.round(clientX / window.innerWidth * 10000) / 10000;
	}
};

/**
 * volumePointerからクリックを解除したときに実行される関数｡
 * @param {object} e mousedownEventオブジェクト
 * @returns {void}
 */
window.onmouseup = function(){
	if(volumePointerDragFlag){
		volumeHoverShow = true;
		volumePointerDragFlag = false;
		document.getElementById("volumeHover").classList.remove("show");
		document.getElementById("volumePointer").classList.remove("show");
	}else if(seekPointerDragFlag){
		seekPointerDragFlag = false;
		document.getElementById("seekbarFrame").classList.remove("show");
		document.getElementById("seekPointer").classList.remove("show");
	}
};

/**
 * シークバーにホバーしているときにポインターの位置までバーを表示する関数｡
 * @returns {void}
 */
function hoverSeek(){
	document.getElementById("progressHover").style.width = clientX + "px";
}

/**
 * seekbarにマウスがのったときに実行される関数｡
 * <br>seekPointerとseekbarFrameにhoverクラスを付与して強調表示させる｡
 * @param {object} e onmouseenterEventオブジェクト
 * @returns {void}
 */
document.getElementById("seekbar").onmouseenter = function(){
	document.getElementById("seekPointer").classList.add("hover");
	document.getElementById("seekbarFrame").classList.add("hover");
	hoverSeekInterval = setInterval(hoverSeek,10);
};

/**
 * seekbarにマウスがのったときに実行される関数｡
 * <br>seekPointerとseekbarFrameからhoverクラスを剥奪して通常表示にする｡
 * @param {object} e onmouseleaveEventオブジェクト
 * @returns {void}
 */
document.getElementById("seekbar").onmouseleave = function(){
	clearInterval(hoverSeekInterval);
	document.getElementById("seekPointer").classList.remove("hover");
	document.getElementById("seekbarFrame").classList.remove("hover");
	document.getElementById("progressHover").style.width = "0px";
};
