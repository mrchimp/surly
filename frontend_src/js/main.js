$('#mouth').on('submit', function (e) {
	e.preventDefault();

	var sentence = $('#speech_input').val();

	$.ajax({
		url: '/talk',
		type: 'POST',
		dataType: 'json',
		data: {
			sentence: sentence
		},
		success: function (data) {
			$('#conversation').append('<br><strong>You</strong>: ' + $('#speech_input').val());
			$('#conversation').append('<br><strong>Surly</strong>: ' + data.response);
			$('#speech_input').val('');
		},
		error: function (a,b,c) {
			alert('It broke. Check the console for info.');
			console.log(a);
			console.log(b);
			console.log(c);
		}
	});
});