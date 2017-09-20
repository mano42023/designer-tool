//to change product color
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
// preload image
$.preload('img/babytshirt.png', 'img/maletshirt.png', 'img/femaletshirt.png');

// upload img
function HandleBrowseClick() {
	var fileinput = $("#imgLoader");
	fileinput.click();
}
canvas = new fabric.Canvas('c');
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
			image.scaleToWidth(canvas.getWidth());
			canvas.add(image);
		}
	}
	reader.readAsDataURL(e.target.files[0]);
}

// to find active object type
function activeobjecttype() {
	return canvas.getActiveObject().get('type');
}

$('#d3').click(function(e) {
	var type = activeobjecttype();
	if (type != "undifine" || type != 'null')
		shownav(type);
});
