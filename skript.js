import apikey from "./apikey";

let schoolname = "아름고등학교";
const apiUrlBase = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
let atptCode = "";
let sdSchulCode = "";
const apikey = 'apikey';

function schoolNameInput(fixedSchoolName = '') {
    const input = document.getElementById('schoolnameinput').value;
    schoolname = input ? input : schoolname;
    schoolname = fixedSchoolName ? fixedSchoolName : input;
    main();
}

async function getSchoolInfo(schoolName) {
    let apiUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${apikey}&Type=json&pIndex=1&pSize=100&SCHUL_NM=${schoolName}`;
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        console.log(data);
        atptCode = data.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE;
        sdSchulCode = data.schoolInfo[1].row[0].SD_SCHUL_CODE;
        console.log(atptCode, sdSchulCode);
    } catch (error) {
        console.log(error);
    }
}
function getMealInfo() {
    let date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let apiUrl = `${apiUrlBase}?KEY=${apikey}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${atptCode}&SD_SCHUL_CODE=${sdSchulCode}&MLSV_YMD=${date}`;
    const container = document.getElementById('container');
    const lunch = document.getElementById('menuList');
    const title = document.getElementById('title');
    const menu = document.getElementById('menuList');
    const otherSchool = document.getElementById('otherschoolcheak');
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            title.innerHTML = `${data.mealServiceDietInfo[1].row[0].SCHUL_NM}의<br>오늘의 급식`
            menu.innerHTML = "";
            for (let i = 0; i < data.mealServiceDietInfo[1].row.length; i++) {
                menu.innerHTML += `<h3>${data.mealServiceDietInfo[1].row[i].MMEAL_SC_NM}:</h3>${data.mealServiceDietInfo[1].row[i].DDISH_NM}`;
            }
            otherSchool.style.visibility = `visible`;
            container.style.visibility = `visible`;
        })
        .catch(error => {
            console.log(error);
        });
}

async function main() {
    await getSchoolInfo(schoolname);
    getMealInfo();
}

main();