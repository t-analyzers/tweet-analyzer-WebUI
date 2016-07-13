$(document).ready(function(){
    console.log("start!");

    var DATA_FOLDER_PATH = "data/";
    var DEFAULT_FILE_NAME = "feature_words_20160706-20160712.json";

    var q = get_url_queries();
    var file_name = "";

    if(q["p"] != undefined){
	file_name = "feature_words_"+q["p"]+".json";
    }else{
	file_name = DEFAULT_FILE_NAME;
    }

    var file_path = DATA_FOLDER_PATH + file_name;

    $.getJSON(file_path , function(data) {

	var table_contents_html = "";
	var graph_data = [['年月日', 'ツイート件数', 'リツイート件数']];
	for(var i = 0; i < data.length; i++){

	    // HTML
	    str_date = (data[i].date).replace(/\//g, "");
	    table_contents_html += "<tr id='"+ str_date +"'>" + 
		"<td>"+ data[i].date + "</td>"+ 
		"<td>"+ data[i].tweets_count + "</td>";

	    var words = data[i].feature_words;
	    for(var j = 0; j < words.length; j++) {
		table_contents_html += "<td class='words'>"+ words[j] + "</td>";
	    }
	    table_contents_html += "</tr>";

	    //グラフ用データ
	    graph_data.push([data[i].date,data[i].tweets_count,data[i].retweets_count]);
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

    });

});


function show_tweets_with_filter(str_date, word){

    var tweets_file_path = "data/tweets_" + str_date + ".json";

    $.getJSON(tweets_file_path , function(tweets) {

	$("#tweets-table-head").show();
	$("#loading").hide();

	var table_contents_html = "";
	for(var i = 0; i < tweets.length; i++) {
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

    $("#tweets-table-head").hide();
    $("#loading").show();
}

function draw_chart(graph_data){
    // この辺おまじない
    google.charts.load('current', {'packages':['corechart']});

    google.charts.setOnLoadCallback(function(){
	// この辺データ
	var data = google.visualization.arrayToDataTable(graph_data);
	// この辺グラフの描画オプション
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