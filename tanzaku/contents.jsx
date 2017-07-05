var Contents = React.createClass({
    getInitialState() {
	var initText = "テキストが\n 縦書きで\n  表示されますように";
	var tanzakuText = TANZAKU.getTanzaku(initText);
	return {
	    rawText: initText,
	    tanzakuText: tanzakuText
	};
    },
    changeText(e) {
	this.setState(
	    {
		rawText: e.target.value,
		tanzakuText: TANZAKU.getTanzaku(e.target.value)
	    });
    },
    openTwitter(e) {
	window.open("https://twitter.com/intent/tweet?hashtags="+encodeURIComponent("七夕の願い事")+
		    "&text="+encodeURIComponent(this.state.tanzakuText+"\n"),"");
    },
    render: function(){
	var style = {
	    textAlign: "center"
	};
	var preStyle = {
	    fontFamily: "Osaka-mono, 'Osaka-等幅', 'ＭＳ ゴシック', monospace",
	    fontSize: "1em"
	};
	
	return (
	    <div className="row">
	      <div className="col-sm12 col-md-4">
		<form>
		<div className="form-group">
		  <textarea type="textarea" className="form-control" rows="5" value={this.state.rawText} onChange={this.changeText}/>
		</div>
		<div className="form-group text-right">
		  <button type="button" className="btn btn-sm btn-primary" onClick={this.openTwitter}>Twitterで開く</button>
		</div>
		</form>
	      </div>
	      <div className="col-sm12 col-md-8">
		<div style={style}>
		  <pre id="pre_tanzaku" style={preStyle}>{this.state.tanzakuText}</pre>
		</div>
	      </div>
	    </div>
	);
    }
});

React.render(
    <Contents />,
    document.getElementById('contents')
);
