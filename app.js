var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));
//var imgCounter = 99999;
var port = process.env.PORT || 8080;
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function (req, res) {

	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// store all uploads in the /uploads directory
	form.uploadDir = path.join(__dirname, '/public/uploads');

	// every time a file has been uploaded successfully,
	// rename it to it's orignal name

	form.on('file', function (field, file) {
		//imgCounter--;
		//var fileName = imgCounter + file.name;
		fs.rename(file.path, path.join(form.uploadDir, file.name));
	});

	// log any errors that occur
	form.on('error', function (err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function () {
		res.end('success');
	});

	// parse the incoming request containing the form data
	form.parse(req);

});

app.get('/image/:imageName', function (req, res) {
	//	var pathname = url.parse(req.url).pathname;
	//	var isImage = 0,
	//		contentType, fileToLoad;
	//	var extension = pathname.split('.').pop();
	//	var file = "." + pathname;
	//	var dirs = pathname.split('/');
	//	if (pathname == "/") {
	//		file = "index.html";
	//		contentType = 'text/html';
	//		isImage = 2;
	//	} else if (dirs[1] != "hidden" && pathname != "/app.js") {
	//		switch (extension) {
	//		case "jpg":
	//			contentType = 'image/jpg';
	//			isImage = 1;
	//			break;
	//		case "png":
	//			contentType = 'image/png';
	//			isImage = 1;
	//			break;
	//		case "js":
	//			contentType = 'text/javascript';
	//			isImage = 2;
	//			break;
	//		case "css":
	//			contentType = 'text/css';
	//			isImage = 2;
	//			break;
	//		case "html":
	//			contentType = 'text/html';
	//			isImage = 2;
	//			break;
	//		}
	//	}	
	//	if (isImage == 1) {
	//		fileToLoad = fs.readFileSync(file);
	//		res.writeHead(200, {
	//			'Content-Type': contentType
	//		});
	//		res.end(fileToLoad, 'binary');
	//	} else if (isImage == 2) {
	//		fileToLoad = fs.readFileSync(file, "utf8");
	//		res.writeHead(200, {
	//			'Content-Type': contentType
	//		});
	//		res.write(fileToLoad);
	//		res.end();
	//	}
	var file = "." + "/uploads/" + req.params.imageName;
	fileToLoad = fs.readFileSync(file);
	res.writeHead(200, {
		'Content-Type': contentType
	});
	res.end(fileToLoad, 'binary');
});

app.get('/images', function (req, res) {
	var uploadDir = path.join(__dirname, '/public/uploads'),
		files = [],
		i;

	fs.readdir(uploadDir, function (err, list) {
		for (i = 0; i < list.length; i++) {
			//store the file name into the array files            
			files.push('/uploads/' + encodeURI(list[i]));
		}
		res.writeHead(200, {
			'Content-type': 'text/html'
		});
		res.end(
			files.toString()
		);
	});
});

var server = app.listen(port, function () {
	console.log('Server listening on port ' + port);
});