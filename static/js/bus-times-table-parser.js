class nextBusTime {

    constructor() {
        this.bus = new busTime();
        this.busTimesInSeconds = null;
    }

    async humanFormat() {
        var out = {};
        await this.getBusTimeInSeconds();
        for (let school in this.busTimesInSeconds) {
            var times = this.busTimesInSeconds[school];
            out[school] = times.map((time) => {
                return this.toDateFormat(time, true);
            });
        }
        return out;
    }

    //Converts seconds relative to Sunday at midnight into date format
    toDateFormat(num_seconds, includeDay) {
        //Calculate equivalent Day, Hour, and Minute based on Seconds
        var secondsInMinute = 60;
        var secondsInHour = 60 * secondsInMinute;
        var secondsInDay = 24 * secondsInHour;
        var secondsInWeek = 7 * secondsInDay;
        num_seconds = num_seconds % secondsInWeek;
        var day = Math.floor(num_seconds / secondsInDay);
        num_seconds = num_seconds % secondsInDay;
        var hour = Math.floor(num_seconds / secondsInHour);
        num_seconds = num_seconds % secondsInHour;
        var minute = Math.floor(num_seconds / secondsInMinute);
        var dayAsString = "";
        switch (day) {
            case 0: dayAsString = "Sun"; break;
            case 1: dayAsString = "Mon"; break;
            case 2: dayAsString = "Tue"; break;
            case 3: dayAsString = "Wed"; break;
            case 4: dayAsString = "Thu"; break;
            case 5: dayAsString = "Fri"; break;
            case 6: dayAsString = "Sat"; break;
        }
        //Convert to non-military time
        var AmPm = "AM";
        if (hour >= 12) {
            AmPm = "PM";
        }

        if (hour == 0 || hour == 12) {
            hour = 12;
        }
        else {
            hour = hour % 12;
        }
        if (includeDay) {
            return dayAsString + " " + hour + ":" + ('0' + minute).slice(-2) + " " + AmPm;
        }
        return hour + ":" + ('0' + minute).slice(-2) + " " + AmPm;
    }

    //Get next bus from a given school
    async getNextBusIndex(school) {
        //wait to load data form website

        await this.getBusTimeInSeconds();

        var times = this.busTimesInSeconds[school];
        //calculate number of seconds since Sunday 12 am to compare to array
        var now = new Date();
        var day = now.getDay();

        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
        var totalSeconds = day * (24 * 60 * 60) + hours * (60 * 60) + minutes * 60 + seconds;
        //brute force search for the next time
        //Want the first one whose time in seconds since Sunday 12 am is greater than current one
        //Since otherwise the bus has already left
        for (var i = 0; i < times.length; i++) {
            if (times[i] > totalSeconds) {
                return i;
            }
        }
        if (i == times.length) {
            return 0;
        }
    }

    //use the singular version, and then once we have the first index
    //Can simply increment index x times to get x+1 times all pushed into an array
    async getNextBuses(school, num_buses) {
        var nextBusIndex = await this.getNextBusIndex(school);
        var num_times = this.busTimesInSeconds[school].length;
        var times = [];
        var now = new Date();
        for (var i = 0; i < num_buses; i++) {
            times.push(this.busTimesInSeconds[school][(nextBusIndex + i) % num_times]);
        }
        return times;
    }

    async getBusTimeInSeconds() {
        if (this.busTimesInSeconds == null) {
            var res = await fetch("busdata.json");
            this.busTimesInSeconds = await res.json();
        }
    }
}
