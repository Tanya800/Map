const
    $regionLiLinks=document.querySelectorAll('.region li'),
    $schoolLinks=document.querySelectorAll('.district li'),
    $mapLinks = document.querySelectorAll('.map a');



let clickOn=false;
const standStyle=`fill:#B5E2FF;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;paint-order:markers stroke fill;`;
const chosenStyle=`fill: #79CAFF; stroke:#000000;stroke-width: 3px;`;

const chosenColor="#79CAFF";
const hoverColor=`background-color: #c0effa;
    text-shadow: 0 0 10px #c0effa;`
const svg=document.querySelector('svg');
const viewB=svg.getAttribute('viewBox');
const temp_main_links="/";

// добавление подсветки и свойства visible для всех участков карты
$mapLinks.forEach(function (item,i,$mapLinks){
    item.setAttribute("visibility","visible");
    let districts = JSON.parse(data);
    let currentTitle="<title>"+ districts[i].name+"</title>"
    item.insertAdjacentHTML("beforeend",currentTitle);
});

$schoolLinks.forEach(el=>{
        el.style.display='none';
    }
);

//показать всю карту
function showMap(){
    let allPath=document.querySelectorAll('path');
    allPath.forEach(function(item,i,allPath){
        item.setAttribute('visibility','visible');
    });
    svg.setAttribute('viewBox',viewB);
    svg.setAttribute('transform','scale(1)');
}

//отобразить лишь один регион по его className
function showRegion(currentPath, className, targetBounding){

    document.getElementById('region').style.display = 'none';
    document.getElementById('district').style.display = 'block';
    document.getElementById('school').style.display = 'none';

    //изменение отображения карты
    let allPath=document.querySelectorAll('path');
    if(targetBounding){
        let viewXY=targetBounding.x-5+' '+(targetBounding.y-10)+' '+(targetBounding.width+10)+' '+(targetBounding.height+20);
        svg.setAttribute('viewBox',viewXY);
    }

    svg.style.transformOrigin = "50% 20%";
    svg.setAttribute('transform','scale(0.9)');

    allPath.forEach(function(item,i,allPath){
        if(item.id!==currentPath.id ) item.setAttribute('visibility','hidden');
    });


    let currentElement = document.querySelector(`.map a[href="${className}"]`);

    let id_dist=className.replace(/[^0-9]/g, '');
    //showLinksSchool(id_dist);
    //showMapSchools(id_dist,currentElement,targetBounding);

}

//отображение школ на карте в выбранном регионе
function showMapSchools(id_dist,currentElement,targetBounding){

    let schools = document.querySelectorAll('.s');
    console.log($schoolLinks);

    let svgSchools=document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgSchools.setAttribute("x",targetBounding.x);
    svgSchools.setAttribute("y",targetBounding.y);
    svgSchools.setAttribute("width",targetBounding.width);
    svgSchools.setAttribute("height",targetBounding.height);

    $schoolLinks.forEach(function (item,i,schools) {
        let currentSchool=$schoolLinks.querySelector('a');

        if(currentSchool.getAttribute('id_district') === id_dist){
            let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
            let id = currentSchool.getAttribute('data_x');
            let x =currentSchool.getAttribute('data_x');
            let y=currentSchool.getAttribute('data_y');

            circle.setAttribute("cx",x);
            circle.setAttribute("cy",y);
            circle.setAttribute("r","3");
            circle.setAttribute("fill","#d00");
            svgSchools.insertAdjacentElement("beforeEnd",circle);
        }
    });

    currentElement.insertAdjacentElement("afterEnd",svgSchools);
}

// отображение списка школ в выбранном регионе
function showLinksSchool(id_district) {

    //listSchools=document.querySelectorAll('s');
    $schoolLinks.forEach(function (item,i,$schoolLinks) {
        let currentSchool=$schoolLinks.querySelector('a');
        console.log(currentSchool);
        console.log(currentSchool.getAttribute('id_district'));
        if(currentSchool.getAttribute('id_district') === id_district) item.style.display='block';
    })
}

// для всех участков карты отбработка событий: mouseenter, mouseleave, click
$mapLinks.forEach(el => {

    el.addEventListener('mouseenter', (e) => {

        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');

        let currentPath = self.querySelectorAll('path');
        if (currentPath) currentPath.forEach(el => el.style.cssText = chosenStyle);

        let currentElement = document.querySelector(`li[data-id="${selfClass}"]`);
        currentElement.classList.add('list-group-item-active');

    });


    el.addEventListener('mouseleave', (e) => {

        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');

        let currentPath = self.querySelectorAll('path');
        if (currentPath) currentPath.forEach(el => el.style.cssText = standStyle);

        let currentElement = document.querySelector(`li[data-id="${selfClass}"]`);
        currentElement.classList.remove('list-group-item-active');

    });


    el.addEventListener('click', (e) => {

        clickOn=!clickOn;

        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let currentPath=self.querySelector('path');
        let targetBounding = self.getBBox();

        if(clickOn){
            showRegion(currentPath,selfClass,targetBounding);
        }else{
            showMap();
            document.location.replace(temp_main_links);
        }

    });

});

// для всех элементов списка школ карты отбработка событий: mouseenter, mouseleave, click
$schoolLinks.forEach(el=>{
    el.addEventListener('mouseenter', (e) => {

        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');

        el.classList.add('list-group-item-active');

    });

    el.addEventListener('mouseleave',(e) => {
        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');

        el.classList.remove('list-group-item-active');

    });

    el.addEventListener('click',(e)=>{
        document.getElementById('region').style.display = 'none';
        document.getElementById('district').style.display = 'none';
        document.getElementById('school').style.display = 'block';
    });
});

// для всех элементов списка регионов отбработка событий: mouseenter, mouseleave, click
$regionLiLinks.forEach(el => {
    el.addEventListener('mouseenter', (e) => {

        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        el.classList.add('list-group-item-active');
        let currentPath = currentElement.querySelectorAll('path');
        if (currentPath) currentPath.forEach(el => el.style.cssText = chosenStyle);
    });

    el.addEventListener('mouseleave',(e) => {
        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        el.classList.remove('list-group-item-active');
        let currentPath = currentElement.querySelectorAll('path');
        if (currentPath) currentPath.forEach(el => el.style.cssText = standStyle);
    });


    el.addEventListener('click',(e)=>{
        clickOn=!clickOn;

        document.getElementById('region').style.display = 'none';
        document.getElementById('district').style.display = 'block';
        document.getElementById('school').style.display = 'none';
        console.log(this);
        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');

        // отображение региона на карте
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        let currentPath=currentElement.querySelector('path');
        let newBox = currentElement.getBBox();
        showRegion(currentPath,selfClass,newBox);

    });
});

//
// reg_dist.onclick = function () {
//
// }

reg_s.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('region').style.display = 'block';
    showMap();
}
dist_s.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('district').style.display = 'block';
}



reg_dist.onclick = function () {
    document.getElementById('region').style.display = 'block';
    document.getElementById('district').style.display = 'none';
    showMap();
}

reg_s.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('region').style.display = 'block';
    showMap();
}
dist_s.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('district').style.display = 'block';
}


// let mregCollection =  document.getElementsByClassName('map-region');
// for (i = 0; i < mregCollection.length; i++) {
// 	mregCollection[i].onclick = function () {
// 		document.getElementById('region').style.display = 'none';
// 		document.getElementById('district').style.display = 'block';
// 		document.getElementById('school').style.display = 'none';
// 	}
// }