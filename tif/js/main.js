/*
 * main.js
 * 
 */
(function($){
    var storageKey = "fukubaya.github.io/tif";

    var CheckStatus = function(storage, storageKey) {
	this.storage = storage;
	this.storageKey = storageKey;
	this.status = JSON.parse(this.storage.getItem(this.storageKey)) || [];
    };
    CheckStatus.prototype.addId = function(id){
	if(this.status.indexOf(id) < 0){
	    this.status.push(id);
	}
	this.storage.setItem(this.storageKey, JSON.stringify(this.status));
    };
    CheckStatus.prototype.removeId = function(id){
	if(this.status.indexOf(id) > -1){
	    this.status.splice(this.status.indexOf(id), 1);
	}
	this.storage.setItem(this.storageKey, JSON.stringify(this.status));
    };
    CheckStatus.prototype.setStatus = function(status){
	this.status = status;
    };
    CheckStatus.prototype.hasId = function(id){
	return this.status.indexOf(id) > -1;
    };
    var checkStatus = new CheckStatus(localStorage, storageKey);

    var headers = [
	"HOT STAGE", "HEAT GARAGE", "SMILE GARDEN",
	"DOLL FACTORY", "SKY STAGE", "FESTIVAL STAGE",
	"DREAM STAGE", "フジさんのヨコ STAGE", "INFO CENTRE",
	"A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T"];

    // "HHMM" を 時間に変換
    var strToHour = function(dtStr){
	return parseFloat(dtStr.substring(0, 2)) + parseFloat(dtStr.substring(2, 4)) / 60.0;
    };

    // HH:MM 〜 HH:MM
    var toPeriod = function(start, end){
	return parseInt(start.substring(0, 2)) + ":" +
	    start.substring(2, 4) + "〜" +
	    parseInt(end.substring(0, 2)) + ":" +
	    end.substring(2, 4);
    };

    var convertToTasks = function(day, data){
	var tasks = [];
	for(var stage in data){
	    var column = headers.indexOf(stage);
	    if(column < 0){
		continue;
	    }
	    for(var i = 0; i < data[stage].length; i++){
		var event = data[stage][i];
		var id = [day, event.start, event.end, event.artist].join("-");
		tasks.push({
		    id: id,
		    className: checkStatus.hasId(id) ? "checked": null,
		    startTime: strToHour(event.start),
		    duration: strToHour(event.end) - strToHour(event.start),
		    column: column,
		    period: toPeriod(event.start, event.end),
		    title: event.artist,
		    detail: event.detail == "null" ? "" : event.detail
		});
	    }
	}
	return tasks;
    };
    var createConf = function(tasks){
	return {
	    headers: headers,
	    cardTemplate: '<div>${period}<br/>${title}<br/><br/>${detail}</div>',
	    lineHeight: 100,
	    tasks: tasks,
	    lowerHour: 9,
	    upperHour: 22,
	    columnWidth: 120,
	    onClick: function(e, t){
		var self = e.currentTarget;
		console.log(e, t);
		$(self).toggleClass("checked");
		if($(self).hasClass("checked")){
		    t.className = "checked";
		    checkStatus.addId(t.id);
		} else {
		    t.className = null;
		    checkStatus.removeId(t.id);
		}
	    }
	};
    };

    $(document).ready(function(){
	$.ajax({
	    type: 'GET',
	    url: 'js/time.min.json',
	    dataType: 'json',
	    success: function(json){
		$.ajax({
		    type: 'GET',
		    url: 'js/greeting.time.json',
		    dataType: 'json',
		    success: function(gjson){
			var task1 = convertToTasks("day1", json["day1"]).concat(convertToTasks("day1", gjson["day1"]));
			var task2 = convertToTasks("day2", json["day2"]).concat(convertToTasks("day2", gjson["day2"]));
			var task3 = convertToTasks("day3", json["day3"]).concat(convertToTasks("day3", gjson["day3"]));
			$("#timetable-container1").skeduler(createConf(task1));
			$("#timetable-container2").skeduler(createConf(task2));
			$("#timetable-container3").skeduler(createConf(task3));
		    }
		});
	    }
	});
    });

})(jQuery);
