$.fn.mask = function(a, e) {
	var g = this;
	var d = $('<div name="mask"></div>');
	var i = parseInt(g.css("z-index"));
	i = i ? (i + 1) : 90000;
	var c = {
		zindex: i
	};
	if (!e) {
		e = {}
	}
	e = $.extend(c, e);
	var b = g.innerHeight() == 0 ? $(window).height() : g.innerHeight();
	d.css({
		filter: "alpha(opacity=30)",
		"-moz-opacity": "0.5",
		"-khtml-opacity": "0.5",
		opacity: "0.5",
		top: "0",
		left: "0",
		position: "absolute",
		width: g.innerWidth(),
		height: b,
		background: "#fff",
		"z-index": e.zindex
	});
	var h = null;
	if (a != null) {
		h = $('<div name="textContainer"><div>');
		h.css({
			"background-color": "none",
			"background-image": "none",
			border: "none",
			padding: "2px",
			position: "absolute",
			"z-index": e.zindex + 1
		});
		var f = $("<div>" + a + "</div>");
		f.css({
			"background-color": "none",
			"background-image": 'url("' + eastcom.baseURL + '/static/jslibSelfReport/inas/jquery/ux/loading_new.gif")',
			"background-position": "5px center",
			"background-repeat": "no-repeat",
			border: "none",
			color: "#222222",
			cursor: "wait",
			height: "36px",
			font: "14px tahoma,arial,verdana,sans-serif",
			padding: "9px 10px 5px 45px"
		});
		h.append(f);
		g.append(h)
	}
	g.append(d);
	if (h) {
		h.css({
			left: (g.width() - h.width() - 4) / 2,
			top: (b - h.height() - 4) / 2
		})
	}
};
$.fn.unmask = function() {
	var b = this;
	var a = b.children("[name=mask]");
	var c = b.children("[name=textContainer]");
	a.remove();
	c.remove()
};