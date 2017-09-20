//design name
var d = new Date();
var filename = d.getTime();
var cus_id;
var yetVisited = localStorage['visited'];
if (!yetVisited) {
	localStorage['visited'] = "yes";
	localStorage['cus_id'] = makeid();
}
cus_id = localStorage['cus_id'];

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 3; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

// preload image
$.preload('img/babytshirt.png', 'img/maletshirt.png', 'img/femaletshirt.png',
		'img/collartshirt.png');

// canvas initialize
canvas = new fabric.Canvas('c');
if (screen.width < 480) {
	canvas.setHeight(260);
	canvas.setWidth(180);
	canvas.renderAll();
} else {
	canvas.setHeight(270);
	canvas.setWidth(240);
	canvas.renderAll();
}
var targetDiv = $("#d3");
var X = targetDiv.position().left;
var Y = targetDiv.position().top;
$("#c").css({
	top : Y,
	left : X,
	position : 'absolute'
});
$(".upper-canvas").css({
	top : Y,
	left : X,
	position : 'absolute'
});

// save img
var saveimageurl = {};
var current_cus_id = cus_id;
function saveimg() {
	deselectAllObjects();
	html2canvas([ document.getElementById('designarea') ], {
		onrendered : function(Canvas) {
			var data = Canvas.toDataURL('png');
			$.ajax({
				async : false,
				type : "POST",
				url : 'toimage.php',
				data : {
					id   : filename,
					imgi : data,
					cus_id : current_cus_id
				}
			}).done(function(msg) {
				saveimageurl[current_cus_id] = msg;
				console.log(msg);
				$('#downloaddsgn').attr('href', msg);
			});
		}
	});
}

// deselect Objects
function deselectAllObjects() {
	canvas.discardActiveObject().renderAll();
}

// to change product color
function changcolor(color) {
	$('.tshirtcolor').css("background-color", color);
}

// hide navbar when click outside
function hidenav() {
	$('.nav').animate({
		top : 25
	});
	setTimeout(function() {
		$('.nav').hide();
	}, 350);
}

// 2nd navigaion pop-up div
var i = 0;
var n = [];
function shownav(name) {
	n[i] = name;
	if (n[i - 1] != n[i]) {
		$('.nav').hide();
		$('.nav').css({
			top : '25px'
		});
		$('#' + name).show();
		$('#' + name).animate({
			top : -35
		});
	}
	i++;
}
// change gender image
function changegender(name) {
	$('.col-sm-4.tshirtcolor').css('background-image',
			'url(img/' + name + 'tshirt.png)');
}

// upload img
function HandleBrowseClick() {
	var fileinput = $("#imgLoader");
	fileinput.click();
}

document.getElementById('imgLoader').onchange = function handleImage(e) {
	var reader = new FileReader();
	reader.onload = function(event) {
		var imgObj = new Image();
		imgObj.src = event.target.result;
		imgObj.onload = function() {
			var image = new fabric.Image(imgObj);
			image.set({
				rotatingPointOffset : 16
			});
			image.scaleToWidth(canvas.getWidth() - 100);
			canvas.centerObject(image);
			canvas.add(image);
			canvas.renderAll();
		}
	}
	reader.readAsDataURL(e.target.files[0]);
}

// to find active object type
function activeobjecttype() {
	if (canvas.getActiveObjects().length != 0)
		return canvas.getActiveObject().get('type');
}

$('.upper-canvas').click(function(e) {
	var type = activeobjecttype();
	if (type != "undifine" || type != 'null')
		shownav(type);
});

// delete active object
function deleteactiveobj() {
	canvas.remove(canvas.getActiveObject());
}

// add new text
$('#filedset').keypress(function(e) {
	var key = e.which;
	if ($('#filedset').val() != '') // to check text field not empty
		if (key == 13)// the enter key code
		{
			$('#filedset').blur();
			e.preventDefault();
			var text = $('#filedset').val();
			var txt = new fabric.IText(text);
			txt.set({
				rotatingPointOffset : 16
			});
			canvas.centerObject(txt);
			canvas.setActiveObject(txt);
			canvas.add(txt);
			canvas.renderAll();
			$('#filedset').val('');
		}
});

// color picker
var color = "#000";
$("#colorpicker1").spectrum({ // spectrum config
	color : "#000",
	showPalette : true,
	showInput : true,
	showAlpha : true,
	chooseText : "Pick",
	cancelText : "Cancel",
	togglePaletteOnly : true,
	showPaletteOnly : true,
	change : function(colorSelected) {
		color = colorSelected.toHexString();
		if (canvas.getActiveObject()) {
			canvas.getActiveObject().set({
				fill : color
			});
			canvas.renderAll();
		}
	}
});

// editText('underline');
// editText('bold');
// editText('italic');

// Functions
function editText(action) {
	var a = action;
	var o = canvas.getActiveObject();
	console.log(o);
	var t;
	// If object selected, what type?
	if (o) {
		t = o.get('type');
	}
	if (o && t === 'i-text') {
		switch (a) {
		case 'bold':
			var isBold = dtGetStyle(o, 'fontWeight') === 'bold';
			dtSetStyle(o, 'fontWeight', isBold ? '' : 'bold');
			break;

		case 'italic':
			var isItalic = dtGetStyle(o, 'fontStyle') === 'italic';
			dtSetStyle(o, 'fontStyle', isItalic ? '' : 'italic');
			break;

		case 'underline':
			var isUnderline = dtGetStyle(o, 'textDecoration') === 'underline';
			dtSetStyle(o, 'textDecoration', isUnderline ? '' : 'underline');
			break;
		canvas.renderAll();
	}
}
}

// Get the text style
function dtGetStyle(object, styleName) {
return object[styleName];
}

// Set text the style
function dtSetStyle(object, styleName, value) {
object[styleName] = value;
object.set({
	dirty : true
});
canvas.renderAll();
}

// save json
var json_data;
function savejson() {
json_data = JSON.stringify(canvas.toDatalessJSON());
console.log(json_data);
}

// load from json
function loadjson() {
canvas.loadFromJSON(JSON.parse(json_data), function(obj) {
	canvas.renderAll();
	canvas.forEachObject(function(obj) {
	});
});
}
// ]]>

