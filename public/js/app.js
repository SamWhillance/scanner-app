var app = angular.module("myApp", []);

// Service
app.service("Entries", function ($http) {
	this.getEntries = function () {
		return $http.get("/entries");
	}
	this.createEntry = function (entry) {
		return $http.post("/entries", entry);
	}
});

// Controller
app.controller("appController", ['$scope', '$log', '$timeout', '$interval', 'Entries', function ($scope, $log, $timeout, $interval, Entries) {
	$scope.barcode = null;
	$scope.inUse = [];
	$scope.notInUse = [];
	$scope.alert = null;
	$scope.loading = false;

	var alertTimer = null;

	$interval(function() {
		$scope.getEntries();
	}, 1000*60*5);

	$scope.getEntries = function () {
		$scope.loading = true;

		$scope.inUse = [];
		$scope.notInUse = [];

		Entries.getEntries().then(function (response) {
			$log.info("Entries", response.data);

			angular.forEach(response.data, function(aEntry){
				if (aEntry.inUse){
					$scope.inUse.push(aEntry);
				} else {
					$scope.notInUse.push(aEntry);
				}
			});
		}, function (error) {
			$scope.setAlert("alert-danger", "Failed to get items");
			$log.error(error);
		}).finally(function(){
			$scope.loading = false;
		});
	};

	$scope.createEntry = function () {
		$scope.loading = true;

		// Create entry object
		var payload = {
			barcode: $scope.barcode
		};

		// Find existing object
		var item = null;
		angular.forEach($scope.inUse, function(entry){
			if (entry.barcode == $scope.barcode){
				item = entry;
			}
		});
		angular.forEach($scope.notInUse, function(entry){
			if (entry.barcode == $scope.barcode){
				item = entry;
			}
		});

		// If the item already exists
		if (item){
			// Swap lists
			payload.inUse = !item.inUse;
		} else {
			payload.inUse = true;
		}

		// Create entry
		Entries.createEntry(payload).then(function (response) {
			$scope.setAlert("alert-success", $scope.barcode + " was updated");
			$scope.getEntries();
			$scope.barcode = "";
		}, function (error) {
			$log.error("Error creating entry", error);

			if (item){
				$scope.setAlert("alert-danger", "Failed to add item");
			} else {
				$scope.setAlert("alert-danger", "Failed to update item");
			}

			$scope.loading = false;
		});
	};

	// Set the alert
	$scope.setAlert = function(aClass, aMessage){
		$scope.alert = {
			class: aClass,
			message: aMessage
		};
		alertEndLife();
	};

	function alertEndLife(){
		if (alertTimer){
			$timeout.cancel(alertTimer);
			alertTimer = null;
		}

		alertTimer = $timeout(function(){
			$scope.alert = null;
		}, 5000);
	}

}]);
