let schoolname = "아름고등학교";
let atptCode = "";
let sdSchulCode = "";
const urlbase = 'https://gubsicmenu.overjjang99.workers.dev/api';
let isReturing = "";
let date = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
console.log(date);



const container = document.getElementById('container');
const title = document.getElementById('title');
const menu = document.getElementById('menuList');
const otherSchool = document.getElementById('otherschoolcheak');
const schoollist = document.getElementById('schoolList');


function setDate(){
    document.getElementById('dateinput').value = new Date().toISOString().slice(0, 10);
}
setDate()

function schoolNameInput(fixedSchoolName = '') {
    const input = document.getElementById('schoolnameinput').value;
    const dateinput = document.getElementById('dateinput').value.replace(/-/g, '');
    console.log(dateinput);
    title.classList.remove('error');
    date = dateinput ? dateinput : date;
    title.innerHTML = `오늘의 급식은?`;
    container.style.visibility = `hidden`;
    otherSchool.style.visibility = `hidden`;
    otherSchool.style.display = `none`;
    schoolname = fixedSchoolName ? fixedSchoolName : (input ? input : schoolname);
    main()
}


async function getSchoolInfo(schoolName) {
    let apiUrl = `${urlbase}?mode=name&schoolName=${schoolName}`;
    listLabel = document.getElementById('listLabel');
    const schoolSelect = document.getElementById('schoolSelect');
    try {
        let response = await fetch(apiUrl);
        let data = await response.json();
        console.log(data);
        //학교 정보가 있을 경우 atptCode, sdSchulCode를 저장
        if(data.schoolInfo) {
            if (data.schoolInfo[0].head[0].list_total_count === 1) {
                atptCode = data.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE;
                sdSchulCode = data.schoolInfo[1].row[0].SD_SCHUL_CODE;
                isReturing = data.schoolInfo[0].head[1].RESULT.CODE;
            }
            else{
                listLabel.innerHTML = `학교 이름이 ${schoolName}인 학교가 ${data.schoolInfo[0].head[0].list_total_count}개 입니다. 선택해주세요.`;
                schoolSelect.innerHTML = "";
                schoolSelect.innerHTML += `<option value="">학교를 선택해주세요</option>`;
                for(let i = 0; i < data.schoolInfo[0].head[0].list_total_count; i++) {
                    schoolSelect.innerHTML += `<option value="${data.schoolInfo[1].row[i].ATPT_OFCDC_SC_CODE},${data.schoolInfo[1].row[i].SD_SCHUL_CODE}">${data.schoolInfo[1].row[i].SCHUL_NM}(${data.schoolInfo[1].row[i].ATPT_OFCDC_SC_NM})</option>`;
                }
                schoollist.style.visibility = `visible`;
                schoollist.style.display = `block`;
                isReturing="needSelect";
            }
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


function getMealInfo(inAtptCode, inSdSchulCode) {
    console.log(inAtptCode, inSdSchulCode);
    let apiUrl = `${urlbase}?mode=menu&atptCode=${inAtptCode}&schoolCode=${inSdSchulCode}&date=${date}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            title.innerHTML = `${data.mealServiceDietInfo[1].row[0].SCHUL_NM}의<br>`
            if (date === new Date().toISOString().slice(0, 10).replace(/-/g, '')) {
                title.innerHTML += `오늘의 급식은?`;
            } else {
                title.innerHTML += `${date.slice(0, 4)}년 ${date.slice(4, 6)}월 ${date.slice(6, 8)}일 급식은?`;
            }
            if (data.mealServiceDietInfo) {
                menu.innerHTML = "";
                for (let i = 0; i < data.mealServiceDietInfo[1].row.length; i++) {
                    menu.innerHTML += `<h3 class="fs-3 fw-bold" align="center">${data.mealServiceDietInfo[1].row[i].MMEAL_SC_NM}</h3>${data.mealServiceDietInfo[1].row[i].DDISH_NM}`;
                }
                otherSchool.style.visibility = `visible`;
                otherSchool.style.display = `block`;
                container.style.visibility = `visible`;
                container.style.display = `block`;
                schoollist.style.visibility = `hidden`;
                schoollist.style.display = `none`;
                title.classList.remove('error');
        } else{
            title.classList.add('error');
            console.log(apiUrl);
            otherSchool.style.visibility = `visible`;
            otherSchool.style.display = `block`;
            title.innerHTML = `급식 정보가 없습니다.`;
            menu.innerHTML = "";
            }
        })
        .catch(error => {
            title.classList.add('error');
            console.log(error);
            console.log(apiUrl);
            otherSchool.style.visibility = `visible`;
            otherSchool.style.display = `block`;
            title.innerHTML = `급식 정보가 없습니다.`;
            menu.innerHTML = "";
        });
}


async function main() {
    await getSchoolInfo(schoolname);
    console.log(isReturing);
    if(isReturing === "INFO-200") {
        otherSchool.style.visibility = `visible`;
        otherSchool.style.display = `block`;
        console.log("school not found");
        container.style.visibility = `hidden`;
        title.innerHTML = `해당 학교를 찾을 수 없습니다`;
        menu.innerHTML = "";
        title.classList.add('error');
    }
    else if(isReturing === "needSelect") {
        console.log("need select");
        title.innerHTML = `중복되는 학교명이 있습니다. 선택해주세요.`;
        container.style.visibility = `hidden`;
        container.style.display = `none`;
    }
    else {
        getMealInfo(atptCode, sdSchulCode);
    }
}


main();