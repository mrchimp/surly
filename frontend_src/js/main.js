$('#mouth').on('submit', function (e) {
	e.preventDefault();

	var sentence = $('#speech_input').val();

	$.ajax({
		url: '/talk',
		type: 'POST',
		dataType: 'json',
		success: function (data) {
			$('#conversation').append('<br>You: "' + $('#speech_input').val() + '"');
			test = data;
			$('#conversation').append('<br>Surly: "' + data.response + '"');
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