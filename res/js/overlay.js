/**
 * @fileoverview オーバーレイ表示管理用のスクリプト｡
 * <br>動作環境 windows10(x64) GoogleChrome(v69.0)
 * @author show0317sw
 */

/* global checkMouse:true */

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
 * マウスが動いているとき5以下で､止まっているとき6以上になる変数｡
 * @type {number}
 */
var mouseEventCount = 0;

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
