# tweet-analyzer-WebUI

[tweet-analyzer](https://github.com/t-analyzers/tweet-analyzer "tweet-analyzer")の
feature_words_extractor.pyで生成したJSONファイルと画像データを表示するためのWeb UIです。

デザインは[Materialize CSS](http://materializecss.com/ "Materialize CSS")を使用しています。（このリポジトリに含まれています）

グラフには[Google Charts](https://developers.google.com/chart/ "Google Charts")を使用しています。

## 構成
### 特徴語サイト
* *featurewords.html*：　
	情報表示用のHTML。クエリパラメータp=YYYYMMDD1-YYYYMMDD2を指定することにより、その分析期間の日別特徴語データファイルを指定することができます。
* *js/show-analyzed-results.js*：　
	featurewords.htmlで使用。日別特徴語とツイート数のグラフを表示し、特徴語をクリックするとそのツイートを表示する。

### 画像一覧サイト
* *imagelist.html*：
	日にち単位の画像をretweet数の降順で表示するHTML。
* *js/show-tweets-img.js*：
	imagelist.htmlで使用。指定された日のツイートの画像を表示する。

### 共通素材
* *その他のjs,css,font,fontsなどのデータ*：　
	jQueryとMateriaizeCSSです。

## データ
feature_words_extractor.pyで生成するデータはdataフォルダ以下に格納してください。
* data/feature_words_YYYYMMDD1-YYYYMMDD2.json：　日別特徴語データ(YYYYMMDD1-YYYYMMDD2：分析期間)
* data/filelist-feature_words.json：　dataフォルダに存在する日別特徴語データのファイル名リスト（降順）。最初のファイルをindex.html表示の初期値に使用。
* data/tweets_YYYYMMDD.json：　日別ツイートデータ(YYYYMMDD：年月日)
* data/wordcloud_YYYYMMDD.png：　日別ワードクラウドの画像データ(YYYYMMDD：年月日)

## 起動方法
* feature_words_extractor.pyを動作させて必要なデータファイルをdataフォルダ以下に生成またはコピーしてください。
* Webサーバー配下にindex.html及びjs,cssなど一式を格納してください。WebアプリケーションサーバーでなくてもOKです。
なお、ローカルのHTMLファイルをブラウザで表示してもjavascriptが動作しません。
* 表示する日別特徴語データはshow-analyzed-results.jsにベタ書きしているので、DEFAULT_FILE_NAMEを準備した日別特徴語データファイルに書き換えてください。

## ToDo
今後の改修予定。
* 日別特徴語データファイルをプルダウンで選択できるようにする。
