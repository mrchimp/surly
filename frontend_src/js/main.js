$('#mouth').on('submit', function (e) {
	e.preventDefault();

	$('#mouth [type="submit"]').prop('disabled', true);

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
			$('#mouth [type="submit"]').prop('disabled', false).focus();
			$("html, body").animate({ scrollTop: $(document).height() }, "fast");
			$('#mouth [type="text"]').focus();
		},
		error: function (a,b,c) {
			alert('It broke. Check the console for info.');
			$('#mouth [type="submit"]').prop('disabled', false);
			console.log(a);
			console.log(b);
			console.log(c);
		}
	});
});