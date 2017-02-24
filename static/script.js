angular.module(
	'ngHomebrew', []

).controller('homebrewController', function($scope){
	console.log('123123123');

	$scope.isLoggedIn = true;
	$scope.user = {
		name: "Tester Testingson",	
		avatar: "//www.gravatar.com/avatar/00000000000000000000000000000000"
	}

	$scope.editorOverlay = $('<div id="editor"/>')
	.addClass('modal-editor')
	.append(
		$('<div/>').froalaEditor({
			heightMin: 350,
			heightMax: window.innerHeight * 0.85,
		}).prepend($('<input id="title" placeholder="Title" />'))
	).hide();

	$('body').append($scope.editorOverlay);

	$('li.button-new').on('click', function(){
		console.log($scope.editorOverlay.fadeIn(80));
	});

	$(document).on('keydown', function(e){
		if(e.which == 27)
			$scope.editorOverlay.fadeOut(80);
	})

});