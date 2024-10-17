let schoolname = "아름고등학교";
let atptCode = "";
let sdSchulCode = "";
const apiurl = 'https://gubsicmenu.overjjang99.workers.dev/api/todos';
let isReturing = "";
let date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

function schoolNameInput(fixedSchoolName = '') {
    const input = document.getElementById('schoolnameinput').value;
    const otherSchool = document.getElementById('otherschoolcheak');
    const container = document.getElementById('container');
    const title = document.getElementById('title');
    const dateinput = document.getElementById('dateinput').value.replace(/-/g, '');
    console.log(dateinput);
    date = dateinput ? dateinput : date;
    title.innerHTML = `오늘의 급식은?`;
    container.style.visibility = `hidden`;
    otherSchool.style.visibility = `hidden`;
    schoolname = fixedSchoolName ? fixedSchoolName : (input ? input : schoolname);
    main()
}

async function getSchoolInfo(schoolName) {
    let apiUrl = `https://gubsicmenu.overjjang99.workers.dev/api?mode=name&schoolName=${schoolName}`;
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
    let apiUrl = `https://gubsicmenu.overjjang99.workers.dev/api?mode=menu&atptCode=${atptCode}&schoolCode=${sdSchulCode}&date=${date}`;
    const container = document.getElementById('container');
    const lunch = document.getElementById('menuList');
    const title = document.getElementById('title');
    const menu = document.getElementById('menuList');
    const otherSchool = document.getElementById('otherschoolcheak');
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            title.innerHTML = `${data.mealServiceDietInfo[1].row[0].SCHUL_NM}의<br>`
            if(date === new Date().toISOString().slice(0, 10).replace(/-/g, '')) {
                title.innerHTML += `오늘의 급식은?`;
            }
            else {
                title.innerHTML += `${date.slice(0, 4)}년 ${date.slice(4, 6)}월 ${date.slice(6, 8)}일 급식은?`;
            }
            menu.innerHTML = "";
            for (let i = 0; i < data.mealServiceDietInfo[1].row.length; i++) {
                menu.innerHTML += `<h3>${data.mealServiceDietInfo[1].row[i].MMEAL_SC_NM}:</h3>${data.mealServiceDietInfo[1].row[i].DDISH_NM}`;
            }
            otherSchool.style.visibility = `visible`;
            container.style.visibility = `visible`;
            title.classList.remove('error');
        })
        .catch(error => {
            title.classList.add('error');
            console.log(error);
            otherSchool.style.visibility = `visible`;
            title.innerHTML = `급식 정보가 없습니다.`;
            menu.innerHTML = "";
        });
}

async function main() {
    await getSchoolInfo(schoolname);
    console.log(isReturing);
    if(isReturing === "INFO-200") {
        const container = document.getElementById('container');
        const title = document.getElementById('title');
        const menu = document.getElementById('menuList');
        const otherSchool = document.getElementById('otherschoolcheak');
        otherSchool.style.visibility = `visible`;
        console.log("school not found");
        container.style.visibility = `hidden`;
        title.innerHTML = `해당 학교를 찾을 수 없습니다`;
        menu.innerHTML = "";
        title.classList.add('error');
    }
    else {
        getMealInfo();
    }
}

main();