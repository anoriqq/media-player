/**
 * @fileoverview 新しいファイルが読み込まれたときの処理用スクリプト｡
 * <br>メディア状態更新じの反映用スクリプト｡
 * <br>動作環境 windows10(x64) GoogleChrome(v69.0)
 * @author show0317sw
 */
/* global showOverlay, formatTime, playback */

/**
 * 新たにメディアを読み込んだとき音量を保持しておくために現在の音量を保存する変数｡
 * <br>初期設定は1
 * @type {number}
 */
var mediaVolume = 1;

/**
 * 現在位置は全長の何%の位置なのかを入れる変数｡
 * @type {number}
 */
var progress = 0;

/**
 * メディアの全長と再生位置を監視して長さ表示とシークバー動作を更新するインターバル｡
 * <br>開始 => checkProgres = setInterval(playback,10);
 * <br>停止 => clearInterval(checkProgres);
 */
var checkProgres;

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
	progress = Math.floor(document.getElementById("video").currentTime / document.getElementById("video").duration * 100000) / 1000;
	if (!document.getElementById("video").paused){
		document.getElementById("playbackTime").innerText = formatTime(document.getElementById("video").currentTime) + " / " + formatTime(document.getElementById("video").duration);
		document.getElementById("progressBar").style.width = progress + "%";
		document.getElementById("seekPointer").style.left = -7 + window.innerWidth * (progress / 100) + "px";
	}else{
		document.getElementById("progressBar").style.width = progress + "%";
		document.getElementById("seekPointer").style.left = -7 + window.innerWidth * (progress / 100) + "px";
	}
}

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
		checkProgres = setInterval(playback,10);
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
		clearInterval(checkProgres);
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
		document.getElementById("volumeHover").classList.add("show");
		document.getElementById("volumePointer").classList.add("show");
		if(document.getElementById("video").volume != 0){
			mediaVolume = document.getElementById("video").volume; // 現在の音量を保存する[0.00 ~ 1.00]
			document.getElementById("volume").innerText = Math.round(mediaVolume * 100); // 現在の音量を表示する[0 ~ 100]
			document.getElementById("volumeInside").style.width = mediaVolume * 100 + "%";
			document.getElementById("volumePointer").style.left = 45 + 150 * mediaVolume + "px";
			document.getElementById("VM_1").style.display = "inline";
			document.getElementById("VM_2").style.display = "none";
		}else{
			document.getElementById("volume").innerText = "0";
			document.getElementById("volumeInside").style.width = "0%";
			document.getElementById("volumePointer").style.left = "45px";
			document.getElementById("VM_1").style.display = "none";
			document.getElementById("VM_2").style.display = "inline";
		}
	};

	/**
	 * onended 再生位置が変わったときに実行される関数
	 * @returns {void}
	 */
	document.getElementById("video").ontimeupdate = function(){
		playback();
	};
};
