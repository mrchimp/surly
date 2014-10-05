
/**
 * Swap words for their equivalents.
 */
	var subs = {
		gender: {
			// Masculine to feminine
			'he': 'she',
			'him': 'her',
			'his': 'her',
			'himself': 'herself',

			// Feminine to masculine
			'she': 'he',
			'her': 'him',
			'her': 'his',
			'herself': 'himself',
		},
		person: {
			// first to third (masculine)
			'i': 'he',
			'me': 'him',
			'my': 'his',
			'mine': 'his',
			'myself': 'himself',

			// third to first (masculine)
			'i': 'he',
			'me': 'him',
			'mine': 'his',
			'myself': 'himself',

			// third to first (feminine)
			'she': 'I',
			'i': 'me',
			'hers': 'mine',
			'herself': 'myself'
		},
		person2: {
			// first to third
			'i': 'you',
			'me': 'you',
			'my': 'your',
			'mine': 'yours',
			'myself': 'yourself',

			// third to first
			'you': 'me',
			'your': 'my',
			'yours': 'mine',
			'yourself': 'myself',
		},
		abbrev: {
			"can't": 'can not',
			'cannot': 'can not'
			// @todo - add more
		}
	};

/**
 * Swap words in a given sentence from a given set of pairs.
 * @param  {String} sentence Sentence to update
 * @param  {String} set      Set of substitutions to use
 * @return {String}          Updated sentence
 */
exports.swap = function (sentence, set) {
	var x,
		y,
		chunks = sentence.split(' ');

	if (typeof subs[set] === 'undefined') {
		throw 'Invalid set.';
	}

	for (x = 0; x < chunks.length; x++) {
		if (typeof subs[set][chunks[x].toLowerCase()] !== 'undefined') {
			chunks[x] = subs[set][chunks[x].toLowerCase()];
			continue;
		}
	}

	return chunks.join(' ');
};

