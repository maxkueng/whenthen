"use strict";

exports = module.exports = whenthen;

function noop () {}

function whenthen (when) {
	if (!when) { when = noop; }

	var queue = [],
		results,
		state = 'waiting';

	function done () {
		state = 'ready';
		results = arguments;
		completeQueue();
	}

	function completeQueue () {
		while (queue.length > 0) {
			queue.shift().apply(null, results);
		}
	}

	function add (done) {
		queue.push(done);
		if (state === 'waiting') {
			state = 'running';
			when(done);
		} else if (state == 'ready') {
			completeQueue();
		}
	}

	return {
		do: add,
		resolve: done
	};
}
