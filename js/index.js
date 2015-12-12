$(document).ready(function() {
	$('.menu-button').on('click', function() {
		if ($(this).hasClass('first-button')) {
			$('.third-button').removeClass('third-button')
												.addClass('first-button');
			$('.second-button').removeClass('second-button')
												 .addClass('third-button');
			$(this).removeClass('first-button')
					 	 .addClass('second-button');
		} else if ($(this).hasClass('third-button')) {
			$('.first-button').removeClass('first-button')
												.addClass('third-button');
			$('.second-button').removeClass('second-button')
												 .addClass('first-button');
			$(this).removeClass('third-button')
					 	 .addClass('second-button');
		}
		if ($(this).hasClass('working-collie-button')) {
			$('.content').animate({'opacity': 0},
														500,
														function() {
				$('.content').hide();
				$('#working-collie').show()
													 .animate({'opacity': 1}, 500);
			});
		} else if ($(this).hasClass('popularity-button')) {
			$('.content').animate({'opacity': 0},
														500,
														function() {
				$('.content').hide();
				$('#friends').show()
													 .animate({'opacity': 1}, 500);
			});
		} else if ($(this).hasClass('many-faces-button')) {
			$('.content').animate({'opacity': 0},
														500,
														function() {
				$('.content').hide();
				$('#many-faces').show()
													 .animate({'opacity': 1}, 500);
			});
		}
	});
});