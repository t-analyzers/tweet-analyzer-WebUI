$(document).ready(function(){

    var DATA_FOLDER_PATH = "data/";
    var FILELIST_NAME = "filelist-feature_words.json";
    var filelist_path = DATA_FOLDER_PATH + FILELIST_NAME;

    $.getJSON(filelist_path , function(data) {

	var q = get_url_queries();
	var file_name = "";

	if(q["p"] == undefined){
	    file_name = data[0];
	}else{
	    file_name = "feature_words_"+q["p"]+".json";
	}

	var file_path = DATA_FOLDER_PATH + file_name;
	show_feature_words(file_path);
    });

});

function show_feature_words(file_path){
    $.getJSON(file_path , function(data) {

	var table_contents_html = "";
	var N = data.length
	var graph_data = [['年月日', 'ツイート件数(リツイート含む)', 'リツイート件数']];
	for(var i = 0; i < N; i++){

	    // HTML
	    str_date = (data[i].date).replace(/\//g, "");
	    table_contents_html += "<tr id='"+ str_date +"'>" + 
		"<td class='wordcloud'>"+ data[i].date + "</td>"+ 
		"<td>"+ data[i].tweets_count + "</td>";

	    var words = data[i].feature_words;
	    for(var j = 0; j < words.length; j++) {
		table_contents_html += "<td class='words'>"+ words[j] + "</td>";
	    }
	    table_contents_html += "</tr>";

	    //グラフ用データ
	    graph_data.push([data[(N-1)-i].date,data[(N-1)-i].tweets_count,data[(N-1)-i].retweets_count]);

	}

	//テーブルデータ表示
	var tableContents = $("#feature_words");
  	tableContents.html(table_contents_html);
	//グラフ描画
	draw_chart(graph_data);

	//クリックイベント
	$('td.words').on('click',function(elem){

	    var date = elem.target.parentNode.id;
	    var word = elem.target.innerText;

	    show_tweets_with_filter(date, word);
	});

	//クリックイベント
	$('td.wordcloud').on('click',function(elem){

	    var date = elem.target.parentNode.id;
	    show_wordcloud(date);

	});

	//クリックイベント
	$('#wordcloud').on('click',function(){
	    $('#wordcloud').hide();
	});

    });
}

function show_tweets_with_filter(str_date, word){

    var tweets_file_path = "data/tweets_" + str_date + ".json";

    $.getJSON(tweets_file_path , function(tweets) {
	$("#tweets-table").show();
	$("#loading").hide();

	$("#feature_word").text("【特徴語：" + word + "】");

	var table_contents_html = "";
	var N = tweets.length;
	for(var i = 0; i < N; i++) {
	    //tweetの名詞群(nouns)にwordが含まれている場合に表示する
	    if( (tweets[i].nouns).indexOf(word) != -1){
		table_contents_html +="<tr><td>" + tweets[i].created_datetime + "</td>" +
		    "<td>" + tweets[i].retweet_count + "</td>" + 
		    "<td>" + tweets[i].text + "</td>";
		var img_link = "";
		if(tweets[i].media_urls != undefined){
		    img_link = "<a href='" + tweets[i].media_urls + "' target='_blank'><i class='material-icons'>photo</i></a>";
		}
		table_contents_html += "<td>" + img_link + "</td>" +
		    "<td>" + tweets[i].PrintID + "</td></tr>";
	    }
	}

	var tableContents = $("#tweets");
	tableContents.html(table_contents_html);

    });

    $("#tweets-table").hide();
    $("#loading").show();

    move_in_page("#top");
}

function draw_chart(graph_data){
    // この辺おまじない
    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(function(){
	// データ
	var data = google.visualization.arrayToDataTable(graph_data);
	// グラフの描画オプション設定
	var options = {
	    title: '日次ツイート件数',
	    chartArea: {'width':'70%', 'height':'65%', 'left':65 },
	    hAxis: { title:'年月日', titleTextStyle:{italic:false} },
	    vAxis: { title:'ツイート/リツイート件数',  titleTextStyle:{italic:false} },
	    crosshair: { trigger: 'both' }
	};
	// この辺おまじない
	var chart = new google.visualization.LineChart(document.getElementById('chart'));
	chart.draw(data, options);
    });
}


/**
 * URL解析して、クエリ文字列を返す
 * @returns {連想配列} クエリ文字列
 * 参考：　http://qiita.com/ma_me/items/03aaebb5dc440b380244
 */
function get_url_queries()
{
    var queries = {}, max = 0, hash = "", array = "";
    var url = window.location.search;

    //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
    hash  = url.slice(1).split('&');    
    for (var i = 0; i < hash.length; i++) {
        array = hash[i].split('=');    //keyと値に分割。
        queries[array[0]]=array[1];
    }

    return queries;
}

function show_wordcloud(str_date){
    var img_path = "data/wordcloud_" + str_date + ".png";
    $("#wordcloud").show();
    $("#wordcloud_img").attr("src",img_path);
    move_in_page("#wordcloud");
}

/**
   ページ内でアニメーション付き遷移する
   target_id: 移動先のid（セレクタ形式： #XXXX）
*/
function move_in_page(target_id){
    // 移動先のタグ
    var target = $(target_id);
    // 移動先となる値
    var targetY = target.offset().top;

    // スクロールにかかる時間
    var time = 500;

    // スクロールアニメーション
    $('html,body').animate({scrollTop: targetY}, time, 'swing');
}