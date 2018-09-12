/**
 * @fileoverview メディアプレイヤーのスクリプト｡
 * <br>動作環境 windows10(x64) GoogleChrome(v69.0)
 * @author show0317sw
 */

/**
 * マウスが動いているとき5以下で､止まっているとき6以上になる変数｡
 * @type {number}
 */
var mouseEventCount = 0;

/**
 * 現在位置は全長の何%の位置なのかを入れる変数｡
 * @type {number}
 */
var progress = 0;

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
 * マウスの動作を監視して､一定期間動きが無かった場合にオーバーレイを消す関数｡
 * <br>開始 => checkMouse = setInterval(mouseMoving,100);
 * <br>停止 => clearInterval(checkMouse);
 */
var checkMouse;

/**
 * メディアの全長と再生位置を監視して長さ表示とシークバー動作を更新する関数｡
 * <br>開始 => checkProgres = setInterval(playback,10);
 * <br>停止 => clearInterval(checkProgres);
 */
var checkProgres;

/**
 * イベントオブジェクトから取得した再生状態を保存する変数｡
 * @type {boolean}
 */
var noPlayFlag;

/**
 * イベントオブジェクトから取得したマウスが操作領域にのっているかの状態を保存する変数｡
 * @type {boolean}
 */
var noMouseFlag;

/**
 * 新たにメディアを読み込んだとき音量を保持しておくために現在の音量を保存する変数｡
 * <br>初期設定は1
 * @type {number}
 */
var mediaVolume = 1;

/**
 * マウスがdocument上の操作領域の上にのっているかどうかを管理する関数｡
 * <br>documenntがロードされたときに実行｡
 * @returns {void}
 */
window.onload = function(){
	document.dispatchEvent(new this.Event("change"));

	/* upperPartに入ったときに実行される関数 */
	document.getElementById("upperPart").onmouseover = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: false
			}
		}));
	};

	/* fileNameに入ったときに実行される関数 */
	document.getElementById("fileName").onmouseover = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: false
			}
		}));
	};

	/* bottomに入ったときに実行される関数 */
	document.getElementById("bottom").onmouseover = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: false
			}
		}));
	};

	/* controlPanelに入ったときに実行される関数 */
	document.getElementById("controlPanel").onmouseover = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: false
			}
		}));
	};

	/* upperPartから出たときに実行される関数 */
	document.getElementById("upperPart").onmouseout = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: true
			}
		}));
	};

	/* fileNameから出たときに実行される関数 */
	document.getElementById("fileName").onmouseout = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: true
			}
		}));
	};

	/* bottomから出たときに実行される関数 */
	document.getElementById("bottom").onmouseout = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: true
			}
		}));
	};

	/* controlPanelから出たときに実行される関数 */
	document.getElementById("controlPanel").onmouseout = function(){
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: null,
				noMouseFlag: true
			}
		}));
	};
};

/**
 * showクラスを付加してオーバーレイを表示する関数｡
 * @returns {void}
 */
function showOverlay(){
	document.getElementById("overlay").classList.add("show");
	document.getElementById("controlPanel").classList.add("show");
	document.getElementById("fileName").classList.add("show");
}

/**
 * showクラスを剥奪してオーバーレイを非表示にする関数｡
 * @returns {void}
 */
function hideOverlay(){
	document.getElementById("overlay").classList.remove("show");
	document.getElementById("controlPanel").classList.remove("show");
	document.getElementById("fileName").classList.remove("show");
}

/**
 * マウスが動いているときmouseEventCountをリセットし､オーバーレイを表示する｡
 * @returns {void}
 */
function monitoringMouse(){
	mouseEventCount = 0;
	showOverlay();
}

/**
 * マウスの動きを監視する関数｡100msインターバルで実行される｡
 * <br>500ms(100ms*5回)動きがない場合オーバーレイを消す｡
 * @returns {void}
 */
function mouseMoving(){
	/* マウスが動いた時にmonitoringMouseを実行するイベントリスナーを作成 */
	document.body.addEventListener("mousemove",monitoringMouse);
	if(mouseEventCount <= 5){
		mouseEventCount++;
	}else{
		hideOverlay();
	}
}

/* noMouseNnoPlayカスタムイベントが発火したときに実行されるイベントリスナー */
document.addEventListener("noMouseNnoPlay",function(e){
	if(e.detail.noMouseFlag == null){
		noPlayFlag = e.detail.noPlayFlag; // e.detail.noMouseFlagがnullのイベントは再生状態監視のイベントなのでnoPlayFlagのみ保存する
	}else{
		noMouseFlag = e.detail.noMouseFlag; // e.detail.noMouseFlagが!nullのイベントはマウス状態監視のイベントなのでnoMouseFlagのみ保存する
	}
	if(noMouseFlag && noPlayFlag){
		checkMouse = setInterval(mouseMoving,100); // mouseMoving関数を100msインターバルで実行
	}else{
		clearInterval(checkMouse); // mouseMoving関数のインターバル実行を停止
		document.body.removeEventListener("mousemove",monitoringMouse); // monitoringMouse関数のイベントリスナーを削除
	}
});

/**
 * 秒をHH:MM:SS.mm表記に変換する関数
 * @param {number} time ミリ秒の時間
 * @returns {string} HH:MM:SS.mmにフォーマットされた文字列
 */
function formatTime(time){
	/**
	 * 0を00に変換する
	 * @param {number} v フォーマットする
	 * @returns {string} vが一桁だった場合0と追加した二桁で返される
	 */
	function padZero(v){
		if (v < 10) return "0" + v;
		else return v;
	}
	var mm = Math.floor((time - Math.floor(time)) * 100); // 小数部分(ms)を抽出する
	var t = Math.floor(time); // 小数部分を切り捨てて秒単位に変換する
	var SS = t % 60; // 合計秒数を60で割った余り
	var MM = Math.floor(t/60)%60; // 合計秒数を60秒で割った小数部分を切り捨てた数(合計分数)を60で割った余り
	var HH = Math.floor(t/3600); // 合計秒数を3600秒で割った数 24(時間)を超えることもある
	return padZero(HH) + ":" + padZero(MM) + ":" + padZero(SS) + "." + padZero(mm);
}

/**
 * 再生位置/メディア全長
 * シークバーの動作
 * @returns {void}
 */
function playback(){
	if (!document.getElementById("video").paused){
		document.getElementById("playbackTime").innerText = formatTime(document.getElementById("video").currentTime) + " / " + formatTime(document.getElementById("video").duration);
		progress = Math.floor(document.getElementById("video").currentTime / document.getElementById("video").duration * 100000) / 1000;
		document.getElementById("progressBar").style.width = progress + "%";
		document.getElementById("progressPoint").style.transform = "translateX(" + window.innerWidth * (progress / 100) + "px)";
	}
}
document.getElementById("seekbar").addEventListener("change",function(){// スライダー位置の変化に合わせて再生位置を更新する
	document.getElementById("video").currentTime = document.getElementById("seekbar").value;
},false);
document.getElementById("video").addEventListener("timeupdate",function(){// 再生時間の変化に合わせてスライダーの位置を更新する
	document.getElementById("seekbar").value = document.getElementById("video").currentTime;
},false);
document.getElementById("seekbarSpace").addEventListener("mouseover",function(){
	document.getElementById("seekbar").classList.add("hover");
	document.getElementById("progressBar").classList.add("hover");
	document.getElementById("progressPoint").classList.add("hover");
});
document.getElementById("seekbarSpace").addEventListener("mouseout",function(){
	document.getElementById("seekbar").classList.remove("hover");
	document.getElementById("progressBar").classList.remove("hover");
	document.getElementById("progressPoint").classList.remove("hover");
});

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
				checkProgres = setInterval(playback,10);
			} else {
				document.getElementById("video").pause();
				clearInterval(checkMouse);
				clearInterval(checkProgres);
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
	document.getElementById("video").muted = !document.getElementById("video").muted;
	document.getElementById("VM_1").style.display = document.getElementById("video").muted ? "none" : "inline";
	document.getElementById("VM_2").style.display = document.getElementById("video").muted ? "inline" : "none";
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
 * キーボードショートカット
 * @param {object} e KeyboardEventオブジェクト
 * @returns {void}
 */
document.onkeydown = function(e){
	/* onkeydownしたキーがspaceで､videoが存在する時true */
	if (e.keyCode == 32 && document.getElementById("video").src != ""){
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
};

/**
 * documentが更新される度に各videoEventハンドラを上書きする関数｡
 * @fires document#onchange
 * @returns {void}
 */
document.onchange = function(){
	showOverlay(); // オーバーレイ表示
	document.getElementById("video").volume = mediaVolume; // 直前のメディアの音量を引き継ぐ
	document.getElementById("volume").innerText = Math.round(mediaVolume * 100); // 表示する

	/**
	 * onplay 再生開始されたときに実行される関数
	 * @returns {void}
	 */
	document.getElementById("video").onplay = function(){
		/* noMouseNnoPlayカスタムイベントにtrueを入れて発火 */
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: true,
				noMouseFlag: null
			}
		}));
	};

	/**
	 * onpause 一時停止したときに実行される関数
	 * @returns {void}
	 */
	document.getElementById("video").onpause = function(){
		/* noMouseNnoPlayカスタムイベントにtrueを入れて発火 */
		document.dispatchEvent(new CustomEvent("noMouseNnoPlay",{
			detail: {
				noPlayFlag: false,
				noMouseFlag: null
			}
		}));
	};

	/**
	 * onended 最後まで再生されたときに実行される関数 ループ時は無視される
	 * @returns {void}
	 */
	document.getElementById("video").onended = function(){
		showOverlay();
	};

	/**
	 * onended メディアの長さが変わったときに実行される関数
	 * @returns {void}
	 */
	document.getElementById("video").ondurationchange = function(){
		document.getElementById("playbackTime").innerText = formatTime(document.getElementById("video").currentTime) + " / " + formatTime(document.getElementById("video").duration);
	};

	/**
	 * onended 音量が変わったときに実行される関数
	 * @returns {void}
	 */
	document.getElementById("video").onvolumechange = function(){
		mediaVolume = document.getElementById("video").volume; // 現在の音量を保存する[0.00 ~ 1.00]
		document.getElementById("volume").innerText = Math.round(mediaVolume * 100); // 現在の音量を表示する[0 ~ 100]
		document.getElementById("volumeInside").style.width = mediaVolume * 100 + "%";
		document.getElementById("volumePointer").style.left = 45 + 150 * mediaVolume + "px";
	};
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
	document.getElementById("volumeHover").classList.remove("show");
	document.getElementById("volumePointer").classList.remove("show");
};

document.getElementById("volumeSpace").onmousewheel = function(e){
	/* プラス方向にホイールを回したとき､かつ､現在の音量が0より大きいときtrue */
	if(e.deltaY > 0){
		if(Math.round(document.getElementById("video").volume * 100) > 1){
			document.getElementById("video").volume = (Math.round(document.getElementById("video").volume * 100) - 2) / 100;
		}else{
			document.getElementById("video").volume = 0;
		}
	}

	/* マイナス方向にホイール回したとき､かつ､現在の音量が1未満のときtrue */
	if(e.deltaY < 0){
		if(Math.round(document.getElementById("video").volume * 100) < 99){
			document.getElementById("video").volume = (Math.round(document.getElementById("video").volume * 100) + 2) / 100;
		}else{
			document.getElementById("video").volume = 1;
		}
	}
};

/**
 * ボリュームバーをクリックしたときに実行される関数｡
 * <br>クリックされた位置のX座標をもとに音量を更新する｡
 * @param {object} e clickイベントオブジェクト
 * @returns {void}
 */
document.getElementById("volumeFrame").onclick = function(e){
	var clickVolume = Math.round((e.clientX - 50)/150*100)/100;
	document.getElementById("video").volume = clickVolume;
};
