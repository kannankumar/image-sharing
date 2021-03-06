$('.image-share-container').hide();
$('.upload-btn').on('click', function () {
	$('.image-share-container').hide();
	$('#upload-input').click();
	$('.progress-bar').text('0%');
	$('.progress-bar').width('0%');
});


$('.show-image-btn').on('click', function () {
	var imgName = $('#image-name-input').val();
	$('#image-container').attr('src', location.href + 'uploads/' + imgName);
});

$('.fetch-btn').on('click', function () {
	$.ajax({
		url: '/images',
		type: 'GET',
		processData: false,
		contentType: false,
		success: function (data) {
			var files = data.split(",");
			console.log(files);
			console.log('Fetched all image links successfully !\n');
			$(".gallery_image_container").html("");

			for (var i = 0; i < files.length; i++) {
				$(".gallery_image_container").append('<img src=' + files[i] + ' class="gallery-thumbs" width="200px" height="200px"/>');
			}
		}
	});
});

$('#upload-input').on('change', function () {

	var files = $(this).get(0).files;

	if (files.length > 0) {
		// create a FormData object which will be sent as the data payload in the
		// AJAX request
		var formData = new FormData();

		// loop through all the selected files and add them to the formData object
		for (var i = 0; i < files.length; i++) {
			var file = files[i];

			// add the files to formData object for the data payload
			formData.append('uploads[]', file, file.name);
		}

		$.ajax({
			url: '/upload',
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			success: function (data) {
				$('.image-share-container').show();
				$('#image-link').val(location.href + 'uploads/' + file.name);
				console.log('upload successful!\n');
				console.log(data.split(' ')[0]);
			},

			xhr: function () {
				// create an XMLHttpRequest
				var xhr = new XMLHttpRequest();

				// listen to the 'progress' event
				xhr.upload.addEventListener('progress', function (evt) {

					if (evt.lengthComputable) {
						// calculate the percentage of upload completed
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);

						// update the Bootstrap progress bar with the new percentage
						$('.progress-bar').text(percentComplete + '%');
						$('.progress-bar').width(percentComplete + '%');

						// once the upload reaches 100%, set the progress bar text to done
						if (percentComplete === 100) {
							$('.progress-bar').html('Done');
						}

					}

				}, false);

				return xhr;
			}
		});

	}
});