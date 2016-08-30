// calendar.js

var MyApp = angular.module('calendarApp',['ui.bootstrap']);

MyApp.controller('CalendarCtrl', ['$scope', '$modal', '$http', '$httpParamSerializerJQLike',  function($scope, $modal, $http, $httpParamSerializerJQLike){

	$scope.year = new Date().getFullYear();
	$scope.month = new Date().getMonth() + 1;
	$scope.reserveDay = 0;
	$scope.result = "nothing";

	// 曜日テーブル
	$scope.header = ["月","火","水","木","金","土","日"];

	$scope.calendar = [];

	$scope.members = ['けいすけ', 'としお', 'としえ']; 
	$scope.timeZone = ['朝', '昼', '夜']; 
	$scope.purpose = ['ゴルフ', 'スノボ', '旅行', 'つり']; 

	// 予約フォームボタン識別
	$scope.formButtuon = {
	    regist: 0,		// 登録
	    delete: 1,		// 削除
	}

	const MAX_MONTH_NUM = 31;

	function ReserveData(member, timeZone, purpose, visible){


		this.member = member;
		this.timeZone = timeZone;
		this.purpose = purpose;
		this.visible = false;
		this.title = '';

		this.makeTitle = function(){
			if(this.visible){
				this.title = this.member + ' ' + this.timeZone + ' ' + this.purpose;
			}
			else{
				this.title = '';
			}
		}
	}

	$scope.rData = [];

	for(var i=0; i<=MAX_MONTH_NUM; i++){
		$scope.rData[i] = new ReserveData($scope.members[0], $scope.timeZone[0], $scope.purpose[0], false);
	}


		// データベースから予約情報を取得
		$http({
			method: 'POST',
			url: 'fetch.php',
		}).success(function(response) {
			// レスポンスが有効の場合に、非同期で呼び出されるコールバックです。
			//データ取得
			var reserveData = response.data;

			for(var i = 0; i < reserveData.length; i++){
				// フロント側テーブルに値を格納するために、日にちを取得
				var date = reserveData[i].date;

				if( reserveData[i].member     &&
					reserveData[i].timezone   &&
					reserveData[i].purpose       ){
					// データが登録されている場合、フロントエンド側テーブルに予約データを格納する。
					// データベースは0番目から、フロントエンド側テーブルは１番目から格納されているため1を足す。
					$scope.rData[date].visible = true;
					$scope.rData[date].member   = reserveData[i].member;
					$scope.rData[date].timeZone = reserveData[i].timezone;
					$scope.rData[date].purpose  = reserveData[i].purpose;
					$scope.rData[date].makeTitle();
				}
				else{
					$scope.rData[date].visible = false;
				}
			}
		}).error(function(response) {
		// エラーが発生、またはサーバからエラーステータスが返された場合に、
		// 非同期で呼び出されます。
		});
	
	// カレンダーテーブル クリア関数
	$scope.clearCalendar = function(){
		$scope.calendar = [];
	}

	// カレンダー更新関数
	$scope.updateCalendar = function(updateDate){

		// 月曜始まりにするための変換テーブル
		var weekConvTable = [6, 0, 1, 2, 3, 4, 5];

		var monthdays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

		var year = updateDate.getFullYear();

		// うるう年計算
		if(((year%4) == 0 && (year%100) != 0) || (year%400) == 0){
			monthdays[1] = 29;
		}

		//　月を取得
		var month = updateDate.getMonth();
		var date = updateDate.getDate();

		var dateIndex = 1;

		for(var weekIndex = 0; weekIndex < 6; weekIndex++){
			var tableLine = [];

			for(var dayIndex = 0; dayIndex < 7 ; dayIndex++){

				// dateIndexが指す日にちの曜日を取得
				updateDate.setDate(dateIndex);
				var day = updateDate.getDay();

				// 月用始まりのカレンダー用の順番に変換
				// 例)　dayが日曜の場合、月曜始まりカレンダーは最も右に位置するので6に変換する。
				// day=0(日曜) ⇨ convertedDay=6
				convertedDay = weekConvTable[day]; 

				if(weekIndex==0 && dayIndex < convertedDay){
					tableLine[dayIndex] = {dd:"", color:"none"};
				}
				else if(dateIndex > monthdays[month]){
					tableLine[dayIndex] = {dd:"", color:"none"};
					dateIndex++;
				}
				else{
					var color = "";
					var thisMonth = new Date().getMonth();		// 現在の月を取得
					var thisYear = new Date().getFullYear();	// 現在の年を取得
					var today = new Date().getDate();

					if( (year == thisYear) && (month == thisMonth) && (dateIndex == today) )
					{
						// 更新する月が現在の月且つ、指定されている日付が今日である場合
						// カレンダー上で色を変更させる。
						color = "today";
					}
					else{
						color = "none";
					}
					tableLine[dayIndex]  = {dd:updateDate.getDate(), color:color};
					dateIndex++;
				}
			}
			$scope.calendar.push(tableLine);
		}
	}

	// 今日の月を表示する
	$scope.dispToday = function(){
		$scope.year = new Date().getFullYear();
		$scope.month = new Date().getMonth() + 1;
		$scope.clearCalendar();
		$scope.updateCalendar(new Date());
	}

	// 次の月を表示
	$scope.nextMonth = function(){
		$scope.clearCalendar();

		if($scope.month == 12){
			$scope.month = 1;
			$scope.year++;
		}
		else{
			$scope.month++;		
		}
		$scope.updateCalendar(new Date($scope.year, $scope.month, 0));
	}

	// 前の月を表示
	$scope.prevMonth = function(){
		$scope.clearCalendar();

		if($scope.month == 1){
			$scope.month = 12;
			$scope.year--;
		}
		else{
			$scope.month--;		
		}
		$scope.updateCalendar(new Date($scope.year, $scope.month, 0));
	}



	$scope.openRegistForm = function(clickDate){
		if(!clickDate) return;

		$scope.reserveDay = clickDate;
		$scope.newGuest = {};
		var modalInstance = $modal.open({
			templateUrl: "T_registForm",
			scope: $scope,
			controller: 'ModalCtrl'
		});

		modalInstance.result.then(
			function(button) {
			if(button == $scope.formButtuon.regist){
				 // 1サーバーに対してHTTP POSTでリクエストを送信
				$scope.rData[clickDate].visible = true;
				$scope.rData[clickDate].makeTitle();
				$http({
					method: 'POST',
					headers: {
						// 1リクエストヘッダーを設定
						'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
					},
					// 2リクエストデータをjQueryと同様の形式で送信
					transformRequest: $httpParamSerializerJQLike,
					url: 'post.php',
					// data: { member: $scope.rData[clickDate].member }
					data: { 
						member: $scope.rData[clickDate].member,
						timeZone: $scope.rData[clickDate].timeZone,
						purpose: $scope.rData[clickDate].purpose,
						date: clickDate
					}
				})
			}
			else if(button == $scope.formButtuon.delete){
				//フロント側テーブルを初期化する
				$scope.rData[clickDate].member   = $scope.members[0];
				$scope.rData[clickDate].timeZone = $scope.timeZone[0];
				$scope.rData[clickDate].purpose  = $scope.purpose[0];
				$scope.rData[clickDate].visible  = false;
				$scope.rData[clickDate].makeTitle();
				$http({
					method: 'POST',
					headers: {
						// 1リクエストヘッダーを設定
						'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
					},
					// 2リクエストデータをjQueryと同様の形式で送信
					transformRequest: $httpParamSerializerJQLike,
					url: 'delete.php',
					// data: { member: $scope.rData[clickDate].member }
					data: { 
						date: clickDate
					}
				})
			}
		})
	}

	//　カレンダー初期化
	$scope.dispToday();

}]);

MyApp.controller('ModalCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
	$scope.registReserve = function(){
		$modalInstance.close($scope.formButtuon.regist);
	}
	$scope.deleteReserve = function() {
		$modalInstance.close($scope.formButtuon.delete);
    }
    // $scope.cancel = function() {
    //   $modalInstance.dismiss();
    // }
}]);