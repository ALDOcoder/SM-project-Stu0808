// /*---------- Deal Countdown ----------*/
// //日期输出样式
// let futureCountdown = new Date("dec 31, 2024 00:00:00").getTime();
//
// function countDown(){
//     let now = new Date().getTime();
//     gap = now - futureCountdown;
//
//     let seconds = 1000;
//     let minutes = seconds * 60;
//     let hours = minutes * 60;
//     let day = hours * 24;
//
//     let d = Math.floor(gap / day);
//     let h = Math.floor((gap % day) / hours);
//     let m = Math.floor((gap % hours) / minutes);
//     let s = Math.floor((gap % minutes) / seconds);
//
//     document.getElementById("day").innerText = d;
//     document.getElementById("hour").innerText = h;
//     document.getElementById("minute").innerText = m;
//     document.getElementById("second").innerText = s;
// }
//
// setInterval(countDown, 1000);


 /*---------- Deal Countdown ----------*/
//输出当前日期时间

function getNowDate(){
    let d = new Date().getDate();
    let h = new Date().getHours();
    let m = new Date().getMinutes();
    let s = new Date().getSeconds();
    let w = new Date().getDay();//获取今天是星期几（0表示星期日，1表示星期一，...，6表示星期六）。
    // 将数字转换为星期几的字符串
    const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
    const dayString = daysOfWeek[w];

    document.getElementById("day").innerText = d;
    document.getElementById("hour").innerText = h;
    document.getElementById("minute").innerText = m;
    document.getElementById("second").innerText = s;
    document.getElementById("week").innerText = dayString;

}

setInterval(getNowDate, 1000);