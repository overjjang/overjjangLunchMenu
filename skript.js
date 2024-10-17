let schoolname = "아름고등학교";
const apiUrlBase = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
let atptCode = "";
let sdSchulCode = "";
const apikey = 'Nzg5MzU3MDgzMjk5NGUxMWJjNDQyZDJlYjIzYTIxZTA=';
let isReturing = "";

function schoolNameInput(fixedSchoolName = '') {
    const input = document.getElementById('schoolnameinput').value;
    schoolname = input ? input : schoolname;
    schoolname = fixedSchoolName ? fixedSchoolName : input;
    main()
}

async function getSchoolInfo(schoolName) {
    let apiUrl = `https://open.neis.go.kr/hub/schoolInfo?KEY=${atob(apikey)}&Type=json&pIndex=1&pSize=100&SCHUL_NM=${schoolName}`;
    const container = document.getElementById('container');
    const title = document.getElementById('title');
    const menu = document.getElementById('menuList');
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        console.log(data);
        if(data.schoolInfo) {
            atptCode = data.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE;
            sdSchulCode = data.schoolInfo[1].row[0].SD_SCHUL_CODE;
            isReturing = data.schoolInfo[0].head[1].RESULT.CODE;
        }
        else isReturing = data.RESULT.CODE;
        console.log(atptCode, sdSchulCode);
    } catch (error) {
        console.log(error);
        container.style.visibility = `hidden`;
        title.innerHTML = `해당 학교를 찾을 수 없습니다`;
        menu.innerHTML = "";
    }
}
function getMealInfo() {
    let date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    let apiUrl = `${apiUrlBase}?KEY=${atob(apikey)}&Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${atptCode}&SD_SCHUL_CODE=${sdSchulCode}&MLSV_YMD=${date}`;
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
    console.log(isReturing);
    if(isReturing === "INFO-200") {
        container = document.getElementById('container');
        title = document.getElementById('title');
        menu = document.getElementById('menuList');
        console.log("school not found");
        container.style.visibility = `hidden`;
        title.innerHTML = `해당 학교를 찾을 수 없습니다`;
        menu.innerHTML = "";
    }
    else {
        getMealInfo();
    }
}

main();