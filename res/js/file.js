/**
 * @fileoverview ファイル処理のスクリプト｡
 * <br>動作環境 windows10(x64) GoogleChrome(v69.0)
 * @author show0317sw
 */

/**
 * ドラッグ状態を保存する変数｡0のときドラックはdocument外にある｡
 */
var dragCount = 0;

/**
 * ドラッグされたカーソルがdocumennt内にあるかどうかを判定する関数｡
 * <br>document外にあると判定したときdragNdropAreaを非表示にする｡
 * @param {number} increase 加算される数値
 * @param {number} decrease 減算される数値
 * @returns {void}
 */
function checkDrag(increase,decrease){
	dragCount = dragCount + increase - decrease;
	if (dragCount == 0){
		document.getElementById("dragNdropArea").classList.remove("show");
	}
}
/**
 * 稀に高速でドラッグした場合に正しくイベントが発生せず､dragNdropAreaが表示されたままになってしまう現象の解決策として､
 * <br>dragNdropAreaをクリックしたときにdragNdropAreaを非表示にする関数｡
 * @returns {void}
 */
document.getElementById("dragNdropArea").onclick = function(){
	document.getElementById("dragNdropArea").classList.remove("show"); // dragNdropAreaを非表示にする
	dragCount = 0; // カウントの不整合が原因なので0にリセットする
};

/**
 * overlayにドラッグしたまま入ったときに実行される関数｡
 * <br>オーバーレイが含まれる場所の時､一括してdragNdropAreaを表示する｡
 * @param {object} e dragenterEventオブジェクト
 * @returns {void}
 */
document.getElementById("overlay").ondragenter = function(e){
	if (e.path[0].id == "overlay" || e.path[1].id == "overlay" || e.path[2].id == "overlay"){
		document.getElementById("dragNdropArea").classList.add("show");
	}
};

/**
 * dragNdropAreaにドラッグしたまま入ったときに実行される関数｡
 * <br>侵入したときの階層をdragCountに足す｡
 * @param {object} e dragenterEventオブジェクト
 * @returns {void}
 */
document.getElementById("dragNdropArea").ondragenter = function(e){
	if (e.path[0].id == "dragNdropArea"){
		checkDrag(1,0);
	} else if (e.path[1].id == "dragNdropArea"){
		checkDrag(2,0);
	} else if (e.path[2].id == "dragNdropArea"){
		checkDrag(3,0);
	}
};

/**
 * dragNdropAreaにドラッグしたまま出たときに実行される関数｡
 * <br>侵入したときの階層をdragCountから引く｡
 * @param {object} e dragenterEventオブジェクト
 * @returns {void}
 */
document.getElementById("dragNdropArea").ondragleave = function(e){
	if (e.path[0].id == "dragNdropArea"){
		checkDrag(0,1);
	} else if (e.path[1].id == "dragNdropArea"){
		checkDrag(0,2);
	} else if (e.path[2].id == "dragNdropArea"){
		checkDrag(0,3);
	}
};

/**
 * dragNdropAreaの上にドラッグされた状態でのっているとき､chrome標準の動作を防ぐため､preventDefault()する関数｡
 * @param {object} e dragoverEventオブジェクト
 * @returns {void}
 */
document.getElementById("dragNdropArea").ondragover = function(e){
	e.preventDefault();
	e.dataTransfer.dropEffect = "copy";
};

/**
 * dragNdropAreaにドロップされたときに実行される関数｡
 * @param {object} e dropEventオブジェクト
 * @returns {void}
 */
document.getElementById("dragNdropArea").ondrop = function(e){
	e.preventDefault();
	dragCount = 0;
	document.getElementById("dragNdropArea").classList.remove("show"); // dragNdropAreaを非表示にする
	document.getElementById("mediaFileInput").files = e.dataTransfer.files; // inputのファイルを更新
};

/* fikeNameをクリックしたときに､inputをクリックしたときと同じ動作をするように設定 */
document.getElementById("fileName").onclick = function(){
	document.getElementById("mediaFileInput").click(); // inputのクリックイベントを発行
};

/**
 * inputに更新があったときに実行
 * @param {object} e onchangeイベントオブジェクト
 * @returns {void}
 */
document.getElementById("mediaFileInput").onchange = function(e){
	/**
	 * 新たに選択されたファイル
	 * @type {object}
	 */
	var files = e.srcElement.files;

	/* onchangeイベントオブジェクトのファイル数が0以上のときtrue */
	if (files.length){
		document.getElementById("infoMessage").innerText = "";

		var videoElem = document.createElement("video"); // 新たにvideoを生成する
		videoElem.setAttribute("id","video"); // id="video"を追加
		videoElem.setAttribute("class","video"); // class="video"を追加
		videoElem.src = window.URL.createObjectURL(files[0]);

		/**
		 * videoElemのロードが終わったらvideoElemのURLを削除する関数
		 * @returns {void}
		 */
		videoElem.onload = function(){
			window.URL.revokeObjectURL(this.src);
		};
		document.getElementById("mediaList").removeChild(document.getElementById("video"));
		document.getElementById("mediaList").appendChild(videoElem);
		document.getElementById("fileName").innerText = files[0].name;
		if (document.getElementById("video").readyState > 0){
			document.getElementById("seekbar").max = document.getElementById("video").duration;
			document.getElementById("seekbar").value = 0;
			document.getElementById("progressBar").style.width = "0%";
			document.getElementById("seekPointer").style.left = -7 + "px";
		} else {
			document.getElementById("video").addEventListener("loadedmetadata",function(){
				document.getElementById("seekbar").max = document.getElementById("video").duration;
				document.getElementById("seekbar").value = 0;
				document.getElementById("progressBar").style.width = "0%";
				document.getElementById("seekPointer").style.left = -7 + "px";
			});
		}
	}
};
