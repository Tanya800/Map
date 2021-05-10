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
const temp_main_links="/index.phtml";

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
function regVisible(className,targetBounding){
	
	let allPath=document.querySelectorAll('path');
	
	let currentReg ;//= allPath.querySelector(`a[href="${className}"]`);

	for (let elem of $mapLinks) {
		if (elem.matches(`a[href="${className}"]`)) {
		    	currentReg=elem;
		}
	}
		
	let currentPath = currentReg.querySelector('path');
	if(targetBounding){
		let viewXY=targetBounding.x-5+' '+(targetBounding.y-10)+' '+(targetBounding.width+10)+' '+(targetBounding.height+20);
		svg.setAttribute('viewBox',viewXY);
	}
		
	svg.style.transformOrigin = "50% 20%";
	svg.setAttribute('transform','scale(0.5)');
	allPath.forEach(function(item,i,allPath){
		if(item.id!=currentPath.id ) item.setAttribute('visibility','hidden');
	});

	let schools = document.createElement('g');
	
	let circle = document.createElement('circle');
	let cx = targetBounding.x + 15;
	let cy = targetBounding.y + 15;
	circle.setAttribute("visibility","visible");
	circle.setAttribute("cx",cx);
	circle.setAttribute("cy",cy);
	circle.setAttribute("r","30");
	circle.setAttribute("fill","#d00");
	schools.innerHTML = ' <circle r="1363" cx="93" cy="65" />';
	svg_main.insertAdjacentElement("beforeEnd",schools);
    //schools.append(circle);
    //svg_main.append(schools);
    
}


$mapLinks.forEach(function (item,i,$mapLinks){
	item.setAttribute("visibility","visible");
	let titleForDist= document.createElement('title');
	let districts = JSON.parse(data);
	let currentTitle="<title>"+ districts[i].name+"</title>"
	//titleForDist.textContent(districts[i].name);
	item.insertAdjacentHTML("beforeend",currentTitle);
});

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
		let allPath=document.querySelectorAll('path');
		let targetBounding = self.getBBox();
		let texts=document.querySelectorAll('tspan');
		
		if(clickOn){
			regVisible(selfClass,targetBounding);
		}else{
			showMap();
			document.location.replace(temp_main_links);
		}

		// ANIMATION HERE
   		// var transformOriginXPercent = (50 - transformOriginX * 100 / mapBounding.width) * scale;
   		// var transformOriginYPercent = (50 - transformOriginY * 100 / mapBounding.height) * scale;
    	// var scaleText = "scale(" + scale + ")";
    	// var translateText = "translate(" + transformOriginXPercent + "%," + transformOriginYPercent + "%)";

     //    map.style.transformOrigin = "50% 50%";
     //    map.style.transform = translateText + " " + scaleText;
		
	});
});

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
});

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

		document.getElementById('region').style.display = 'none';
        document.getElementById('district').style.display = 'block';
        document.getElementById('school').style.display = 'none';
        
        let self = e.currentTarget;
		let selfLink = self.querySelector('a');
		let selfClass = selfLink.getAttribute('href');

		// отображение региона на карте 
		let currentElement = document.querySelector(`.map a[href="${selfClass}"]`);
        let newBox = currentElement.getBBox();
        regVisible(selfClass,newBox);


        // отображение левого меню


    });
});


    reg_dist.onclick = function () {
        document.getElementById('region').style.display = 'block';
        document.getElementById('district').style.display = 'none';
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



    let mregCollection =  document.getElementsByClassName('map-region');
    for (i = 0; i < mregCollection.length; i++) {
        mregCollection[i].onclick = function () {
            document.getElementById('region').style.display = 'none';
            document.getElementById('district').style.display = 'block';
            document.getElementById('school').style.display = 'none';
        }
    }

    let sCollection =  document.getElementsByClassName('s');
    for (i = 0; i < sCollection.length; i++) {
        sCollection[i].onclick = function () {
            document.getElementById('region').style.display = 'none';
            document.getElementById('district').style.display = 'none';
            document.getElementById('school').style.display = 'block';
        }
    }
