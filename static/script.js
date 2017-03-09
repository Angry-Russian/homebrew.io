angular.module(
	'ngHomebrew', ['ngTagsInput']

).controller('homebrewController', function($scope, $http){
	console.log('123123123');

	$scope.showEditor = false;
	$scope.isLoggedIn = true;
	$scope.user = {
		name: "Tester Testingson",	
		avatar: "//www.gravatar.com/avatar/00000000000000000000000000000000"
	}

	$scope.editorOverlay = $('div#editor');
	$('div#editor .container textarea').froalaEditor({
		heightMin: 350,
		heightMax: window.innerHeight * 0.85,
	});

	$('li.button-new').on('click', function(){
		$scope.showEditor = !$scope.showEditor;
		$scope.$apply();
	});

	$(document).on('keydown', function(e){
		if(e.which == 27)
			$scope.showEditor = false;
		$scope.$apply();
	});

	$scope.tags = [
		{ text: 'Tag1' },
		{ text: 'Tag2' },
		{ text: 'Tag3' }
	];

	$scope.loadTags = function(query) {
		return $http.get('tags.json');
	};
});