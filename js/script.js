downloadDistTitles();

const
    $regionLiLinks = document.querySelectorAll('.region li'),
    $mapLinks = document.querySelectorAll('.map a');

var $schoolLinks = document.querySelectorAll('.district li');


let clickOn = false;
let $currentRegView = '';
let $currentRegId = -1;
let $currentRegElement;

//стили для карты
const standStyle = `fill:#B5E2FF;stroke:#000000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;paint-order:markers stroke fill;`;
const chosenStyle = `fill: #79CAFF; stroke:#000000;stroke-width: 3px;`;

const colorCircle = "#0700dd";
const svg = document.getElementById('svg_main');
const viewB = svg.getAttribute('viewBox');
const temp_main_links = "/";

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

//отследить изменения в блоке d_group и вызвать функцию для обновления слушателей элементов
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            var list_values = [].slice.call(d_group.children)
                .map(function (node) {
                    return node.innerHTML;
                })
                .filter(function (s) {
                    if (s === '<br>') {
                        return false;
                    } else {
                        return true;
                    }
                });
            updateSchoolsLinks();
        }
    });
});

//отследить изменения в блоке sh_info и вызвать функцию для обновления слушателей элементов
var observerSchoolInfo = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            var list_values = [].slice.call(sh_info.children)
                .map(function (node) {
                    return node.innerHTML;
                })
                .filter(function (s) {
                    if (s === '<br>') {
                        return false;
                    } else {
                        return true;
                    }
                });
            updateSchoolInfo();
        }
    });
});

observer.observe(d_group, {
    attributes: true,
    childList: true,
    characterData: true
});

observerSchoolInfo.observe(sh_info, {
    attributes: true,
    childList: true,
    characterData: true
});

//загрузка информации о школе по id_school
function downloadSchoolInfo(id_school) {

    // отправка в php id выбранной школе
    if (admin) {
        $.ajax({
            type: 'POST',
            url: 'db/db_infoschooladmin.phtml',
            data: {id_school: id_school},
            success: function (data) {
                //console.log("data");
                //console.log(data);
                sh_info.innerHTML = data;
                sh_info.setAttribute('id_school', id_school);
            },
            error: function (response) {
                console.log(response);
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: 'db/db_infoschool.phtml',
            data: {id_school: id_school},
            success: function (data) {
                //console.log("data");
                //console.log(data);
                sh_info.innerHTML = data;
                sh_info.setAttribute('id_school', id_school);
            },
            error: function (response) {
                console.log(response);
            }
        });
    }
}

if(admin){
    add_school.addEventListener('click', (e) => {
        sh_info.setAttribute('id_school', '-500');
    });
}

//загрузить список школ по id региона
function downloadSchoolLinks(id_district) {

    $.ajax({
        type: 'POST',
        url: 'db/db_school.phtml',
        data: {id_dist: id_district},
        dataType: 'json',
        success: function (data) {
            showSchoolsLinks(data);
        }
    });
}

//показать массив школ в правом блоке
function showSchoolsLinks(schoolData) {
    d_group.textContent = '';
    d_group.innerHTML = "<p id='id_dist' style='display: none'>" + $currentRegId + "</p>";

    if (schoolData) {

        schoolData.forEach(function (item, i, schoolData) {
            //console.log(item);
            let currentLi = document.createElement('li');
            currentLi.setAttribute('class', 'list-group-item');
            currentLi.setAttribute('data-id', "#s" + item.id_school);
            let currentLink = document.createElement('a');
            currentLink.setAttribute('href', "#s" + item.id_school);
            currentLink.style.textDecoration = 'none';
            currentLink.setAttribute('id', "#s" + item.id_school);
            currentLink.setAttribute('data_x', item.point_x);
            currentLink.setAttribute('data_y', item.point_y);
            currentLink.setAttribute('id_district', item.id_district);
            currentLink.textContent = item.name;

            currentLi.append(currentLink);
            d_group.append(currentLi);
        });
    }
}

//загрузить названия регионов
function downloadDistTitles(titles) {

    // отправка в php id выбранной школе
    $.ajax({
        type: 'POST',
        url: 'db/db_titleDistrict.phtml',
        data: "",
        dataType: 'json',
        success: function (data) {
            setTitles(data);
        }
    });
}

//проверить изменения в правом блоке школ .district
function updateSchoolsLinks() {

    $schoolLinks = d_group.querySelectorAll('li');
    let targetBounding = $currentRegView;
    let id_dist = $currentRegId;
    let currentElement = $currentRegElement;

    // отображение школ на карте
    if (id_dist !== '-1' && currentElement) {
        showMapSchools(id_dist, currentElement, targetBounding);
        setSchoolTitles();
    }

    //устанавливаем слушателей для всех элементов списка школ
    addSchoolsLicteners();
    // устанавливаем слушателей для всех точек-школ на карте
    addPointsListeners();
}

//обработчик события перемещения курсора мыши при добавлении точки на карте
function moved(evt) {
	let svgSchool = document.querySelector('.svgSchools');
	let pt = svgSchool.createSVGPoint();

	pt.x = evt.clientX;
	pt.y = evt.clientY;

	var loc = pt.matrixTransform(svgSchool.getScreenCTM().inverse());

	let currentCircle = svgSchool.querySelector('.circle-added');
	currentCircle.setAttribute('cx', loc.x);
	currentCircle.setAttribute('cy', loc.y);

}

//реагирование на изменение и загрузку блока Описание школы
function updateSchoolInfo() {
    if(!admin) return;
    let addPointButton = add_point_button;
    let saveBut = saveButton;

	var idCircle = sh_info.getAttribute('id_school');

	if(idCircle!==-500) add_point_button.textContent="Изменить координаты";

	let svgSchool = document.querySelector('.svg');
    currentSvg = d3.select('svg.svgSchools');

    addPointButton.addEventListener('click', (e) => {
		var circleMoved = false;
        {
            $mapLinks.forEach(function (item) {
                item.style.pointerEvents = 'none';
            });
            $pointLinks = document.querySelectorAll('a.circle');
            $pointLinks.forEach(function (item) {
                if (item.getAttribute('href') !== ('#s' + idCircle)) item.style.pointerEvents = 'none';
            });
        }
        svgSchool.addEventListener('mousemove', moved);

        //school exist
        if (idCircle !== 500) {

            currentCircle = currentSvg.select('#circl' + idCircle)
				.classed("circle-stand", false)
				.classed("circle-chosen", false)
				.classed("circle-added", true)
				.on("mousedown", function (d) {
					circleMoved = !circleMoved;
					if (circleMoved) {
						svgSchool.removeEventListener('mousemove', moved);
						d3.select(this).classed("circle-added", false);

					} else {
						d3.select(this).classed("circle-added", true);
						svgSchool.addEventListener('mousemove', moved);
					}

				});

            startSpyingForCircle('on',idCircle);//отслеживать изменения у определенной точки
        }
        else { //school not exist
            console.log('not exist point');
            addPointButton.setAttribute('disabled');
            d3.selectAll('a.circle').style("pointerEvents", "none");

            currentSvg = d3.select('svg.svgSchools');
            currentCircle = currentSvg.append('circle')
                .attr("class", "circle-added")
                .attr("cx", "10")
                .attr("cy", "10")
                .attr("r", "2")
                .on("mousedown", function (d) {
                    circleMoved = !circleMoved;
                    if (circleMoved) {
                        svgSchool.removeEventListener('mousemove', moved);
                        d3.select(this).attr("class", "circle-stand");
                    } else {
                        svgSchool.addEventListener('mousemove', moved);
                        d3.select(this).attr("class", "circle-added");
                    }
                });
            svgSchool.addEventListener('mousemove', moved);
        }
    });

    saveBut.addEventListener('mousedown',function (d) {
        startSpyingForCircle('off',currentCircle);
    });
}


function startSpyingForCircle(turn,idCircle) {
    if(!admin) return;

    var spyCircle = new MutationObserver(function (mutations) {
        mutations.forEach(function(mutation){
            if (mutation.type ==='attributes') console.log('attr');
            changeInputs(idCircle);
        });
    });

    if(turn==='on'){

        console.log('spyCircle On');
        var circl=document.querySelector('#circl' + idCircle);
        spyCircle.observe(circl, {attributes: true});

    }else if (turn ==='off'){
        spyCircle.disconnect();
    }
}

//изменить значения input_x input_y в форме заполнения в соотвествии с точкой на карте по idCircle
function changeInputs(idCircle) {
    if(!admin) return;
    var circl=document.querySelector('#circl' + idCircle);
    var currentX=circl.getAttribute('cx');
    var currentY=circl.getAttribute('cy');
    var inputX=document.querySelector('input#point_x');
    var inputY=document.querySelector('input#point_y');
    inputX.setAttribute('value',currentX);
    inputY.setAttribute('value',currentY);
}



//обработчик добавления координат для новой школы
add_point_button.addEventListener('click', (e) => {

    let idSchool = sh_info.getAttribute('id_school');

    if (idSchool == -500) {

        add_point_button.textContent="Добавить школу на карте";
        add_point_button.setAttribute('disabled','disabled');
        if($mapLinks){
            $mapLinks.forEach(function (item) {
                item.style.pointerEvents = 'none';
            });
        }
		d3.selectAll('a.circle').style("pointerEvents", "none");

        let svgSchool = document.querySelector('.svg');
        let circleMoved = false;

        currentSvg = d3.select('svg.svgSchools');
        currentCircle = currentSvg.append('circle')
            .attr("cx", "10")
            .attr("cy", "10")
            .attr("r", "1.5")
            .attr("style", "fill:grey;")
            .on("mousedown", function (d) {
                circleMoved = !circleMoved;
                if (circleMoved) {

                    // сохранение координат точки
                    x = d3.select(this).attr('cx');
                    y = d3.select(this).attr('cy');
                    d3.select('input#point_x').attr('value', x);
                    d3.select('input#point_y').attr('value', y);

                    svgSchool.removeEventListener('mousemove', moved);
                    d3.select(this).attr("class", "circle-stand");
                } else {
                    svgSchool.addEventListener('mousemove', moved);
                    d3.select(this).attr("class", "circle-added");
                }
            });
        svgSchool.addEventListener('mousemove', moved);
    }
});


//отобразить лишь один регион по его className
function showRegion(currentPath, className, targetBounding) {

    document.getElementById('region').style.display = 'none';
    document.getElementById('district').style.display = 'block';
    document.getElementById('school').style.display = 'none';

    //изменение отображения карты
    let allPath = document.querySelectorAll('path');
    if (targetBounding) {
        let viewXY = targetBounding.x - 5 + ' ' + (targetBounding.y - 10) + ' ' + (targetBounding.width + 10) + ' ' + (targetBounding.height + 20);
        svg.setAttribute('viewBox', viewXY);
    }

    svg.style.transformOrigin = "50% 20%";
    svg.setAttribute('transform', 'scale(0.9)');
    svg.setAttribute('border', '4px silid black');
    allPath.forEach(function (item, i, allPath) {
        if (item.id !== currentPath.id) item.setAttribute('visibility', 'hidden');
    });

    let currentElement = document.querySelector(`.map a[href="${className}"]`);
    let id_dist = className.replace(/[^0-9]/g, '');

    //-----------------------------------------------------------
    title.textContent=$titlesReg[id_dist].name;

    var str = $titlesReg[id_dist].name;
    var newstr = str.replace('ий', 'ого');
    newstr = newstr.replace('ой', 'ого');


    if(id_dist>0) {newstr += "a" ;
       
    }
    else newstr='Орла';
    let titleForSchoolListd = document.querySelector('.district h4');
    titleForSchoolListd.textContent="Образовательные учреждения " +  newstr + ":";

    //сохранение данных для динамически создаваемых узлов
    $currentRegView = targetBounding;
    $currentRegId = id_dist;
    $currentRegElement = currentElement;
    
    d3.select('#patternSVG').attr('display','block').attr('height','1');
    d3.selectAll('pattern').attr('display','block');
    downloadSchoolLinks(id_dist); // загрузка школ

}

//создание внутренней svg-карты для отображения всех школ из списка элементов $schoolLinks
function showMapSchools(currentRegId, currentElement, targetBounding) {
	if(!document.querySelector('.svgSchools')){
		let svgSchools = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
		svgSchools.setAttribute("x", targetBounding.x);
		svgSchools.setAttribute("y", targetBounding.y);
		svgSchools.setAttribute("width", targetBounding.width);
		svgSchools.setAttribute("height", targetBounding.height);
		svgSchools.setAttribute('id', 'svgSchools');
		svgSchools.setAttribute('class', 'svgSchools');
		svgSchools = addPointsMap(currentRegId, $schoolLinks, svgSchools);

		currentElement.insertAdjacentElement("afterEnd", svgSchools);
	}
}

//в массиве ссылок школ $schoolLinks находим координаты точек на карте
function addPointsMap(id_dist, schoolLinks, svgSchools) {

    schoolLinks.forEach(function (item, i, schoolLinks) {

        let currentSchool = item.querySelector('a');
        let currentIdSchool = currentSchool.getAttribute('id');
        currentIdSchool = currentIdSchool.replace(/[^0-9]/g, '');

        let linkSchool = currentSchool.getAttribute('href');
        let x = currentSchool.getAttribute('data_x');
        let y = currentSchool.getAttribute('data_y');
        let radious = '2';

        if(id_dist.replace(/[^0-9]/g, '')!=='0'){
            radious='4';
        }
        

        let link = document.createElementNS("http://www.w3.org/2000/svg", 'a');
        link.setAttribute('href', linkSchool);
        link.setAttribute('class', 'circle');

        let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute("id", "circl" + currentIdSchool);
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", radious);
        circle.setAttribute("class", "circle-stand");

        link.append(circle);
        svgSchools.insertAdjacentElement("beforeEnd", link);
    });

    return svgSchools;
}

function addSchoolsLicteners() {
    $schoolLinks = d_group.querySelectorAll('li');

    if ($schoolLinks) {
        $schoolLinks.forEach(el => {

            el.addEventListener('mouseenter', (e) => {

                let self = e.currentTarget;
                let selfLink = el.querySelector('a');
                let selfClass = selfLink.getAttribute('href');
                el.classList.add('list-group-item-active');

                let currentLink = svg.querySelector(`a[href="${selfClass}"]`);

                let currentPoint = currentLink.querySelector('circle');
                currentPoint.classList.add('circle-hover');

            });

            el.addEventListener('mouseleave', (e) => {
                let self = e.currentTarget;
                let selfLink = self.querySelector('a');
                let selfClass = selfLink.getAttribute('href');
                el.classList.remove('list-group-item-active');

                let currentLink = svg.querySelector(`a[href="${selfClass}"]`);
                let currentPoint = currentLink.querySelector('circle');

                currentPoint.classList.remove('circle-hover');
            });

            el.addEventListener('click', (e) => {

                document.getElementById('region').style.display = 'none';
                document.getElementById('district').style.display = 'none';
                document.getElementById('school').style.display = 'block';
                let self = e.currentTarget;
                let selfLink = self.querySelector('a');
                let selfClass = selfLink.getAttribute('href');
                let id_school = selfClass.replace(/[^0-9]/g, '');

                let currentLink = svg.querySelector(`a[href="${selfClass}"]`);
                let currentPoint = currentLink.querySelector('circle');

                cleanStyleSchool();
                currentPoint.classList.add('circle-chosen');

                downloadSchoolInfo(id_school);

            });
        });
    }
}

function addPointsListeners() {
    $pointLinks = document.querySelectorAll('.circle');

    if ($pointLinks) {
        $pointLinks.forEach(el => {

            el.addEventListener('mouseenter', (e) => {
                let self = e.currentTarget;
                let selfLink = self.querySelector('a');
                let selfClass = el.getAttribute('href');
                let currentPoint = el.querySelector('circle');
                currentPoint.classList.add('circle-hover');

                let currentSchool = document.querySelector(`.district li[data-id="${selfClass}"]`);
                currentSchool.classList.add('list-group-item-active');

            });

            el.addEventListener('mouseleave', (e) => {
                let self = e.currentTarget;
                let selfLink = self.querySelector('a');
                let selfClass = el.getAttribute('href');
                let currentPoint = el.querySelector('circle');
                currentPoint.classList.remove('circle-hover');

                let currentSchool = document.querySelector(`.district li[data-id="${selfClass}"]`);
                currentSchool.classList.remove('list-group-item-active');

            });

            el.addEventListener('click', (e) => {
                document.getElementById('region').style.display = 'none';
                document.getElementById('district').style.display = 'none';
                document.getElementById('school').style.display = 'block';

                let selfClass = el.getAttribute('href');
                let id_school = selfClass.replace(/[^0-9]/g, '');
                let currentPoint = el.querySelector('circle');
                cleanStyleSchool();
                currentPoint.classList.add('circle-chosen');

                downloadSchoolInfo(id_school);
            });
        })
    }
}

//показать всю карту
function showMap() {
    svgSchools.removeEventListener('mousemove', moved);
    let allPath = document.querySelectorAll('path');
    allPath.forEach(function (item, i, allPath) {
        item.setAttribute('visibility', 'visible');
    });
    svg.setAttribute('viewBox', viewB);
    svg.setAttribute('transform', 'scale(1)');

    $currentRegView = '';
    $currentRegId = -1;
    $currentRegElement = '';
}

// добавление подсветки и свойства visible для всех участков карты
function setTitles(titles) {
    $mapLinks.forEach(function (item, i, $mapLinks) {
        item.setAttribute("visibility", "visible");
        let currentTitle = "<title id='t" + titles[i].id_district + "'>" + titles[i].name + "</title>";
        item.insertAdjacentHTML("beforeend", currentTitle);
    });
    $titlesReg = titles;
}

//подсветка названий школ
function setSchoolTitles() {

    let allCircleSchool = document.querySelectorAll('.circle');

    allCircleSchool.forEach(function (item, i, titles) {
		if(!item.querySelector('title')){
			let selfHref = item.getAttribute('href');
			let currenSchoolLink = d_group.querySelector(`li[data-id="${selfHref}"]`);
			let name = currenSchoolLink.querySelector('a').textContent;
			let currentTitle = "<title id='t" + selfHref.replace(/[^0-9]/g, '') + "'>" + name + "</title>";
			item.insertAdjacentHTML("beforeend", currentTitle);
		}
    });

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

        let id_dist = selfClass.replace(/[^0-9]/g, '');

    });


    el.addEventListener('mouseleave', (e) => {

        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');

        let currentPath = self.querySelectorAll('path');
        if (currentPath) currentPath.forEach(el => el.style.cssText = standStyle);

        let currentElement = document.querySelector(`li[data-id="${selfClass}"]`);
        currentElement.classList.remove('list-group-item-active');
        title_map.innerHTML = " ";

    });

    el.addEventListener('click', (e) => {

        clickOn = !clickOn;

        let self = e.currentTarget;
        let selfClass = self.getAttribute('href');
        let currentPath = self.querySelector('path');
        let targetBounding = self.getBBox();
        //получение id района
        let id_dist = selfClass.replace(/[^0-9]/g, '');

        // $.ajax({
        // 	type:'POST',
        // 	url:'db/db_getDistrict.php',
        // 	data:{id_dist:id_dist},
        // 	success:function(data){
        // 		title_map.innerHTML =data;
        // 	}
        // });

        if (clickOn) {
            showRegion(currentPath, selfClass, targetBounding);
        } else {
            showMap();
            document.location.replace(temp_main_links);
        }

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

    el.addEventListener('mouseleave', (e) => {
        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        el.classList.remove('list-group-item-active');
        let currentPath = currentElement.querySelectorAll('path');
        if (currentPath) currentPath.forEach(el => el.style.cssText = standStyle);
    });


    el.addEventListener('click', (e) => {
        clickOn = !clickOn;

        document.getElementById('region').style.display = 'none';
        document.getElementById('district').style.display = 'block';
        document.getElementById('school').style.display = 'none';

        let self = e.currentTarget;
        let selfLink = self.querySelector('a');
        let selfClass = selfLink.getAttribute('href');

        // отображение региона на карте
        let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        let currentPath = currentElement.querySelector('path');
        let newBox = currentElement.getBBox();

        showRegion(currentPath, selfClass, newBox);

    });
});


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
    cleanStyleSchool();
    svgSchools.removeEventListener('mousemove', moved);
}

function cleanStyleSchool() {
    if ($pointLinks) {
        $pointLinks.forEach(i => {
            i.querySelector('circle').classList.remove('circle-chosen');
        });
    }
}