window.addEventListener("load", windowLoad);

let apiUrl = ("http://worldtimeapi.org/api/timezone/Europe/Kiev")

function Data() {
    fetch(apiUrl)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const { datetime, timezone, day_of_year} = data;
            const dates = document.querySelector('.date');
            const times = document.querySelector('.clock');
            const timeZone = document.querySelector('.timezone');
            const dayYear = document.querySelector('.day_of_year');

            const [date, time] = datetime.split('T');
            dates.innerHTML = `Current date: ${date}`;
            times.innerHTML = `Current time: ${time.slice(0,8)}`;
            timeZone.innerHTML = `Time zone ${timezone}`;
            dayYear.innerHTML = `Day of year: ${day_of_year}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        })
}

   //setInterval(Data, 1000);
Data();

