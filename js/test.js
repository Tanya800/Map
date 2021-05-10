
function loadDistrict(){
	let districts = JSON.parse(data);

    for (let i = 0; i < districts.length; i++) {
        let div = document.createElement('div');
        div.innerHTML = '<li class="list-group-item" data-id= "#reg'+ i +'"><a class="reg"  href="#reg'+ i +'" style="text-decoration: none;" id="reg'+ i +'">' + districts[i].name + '</a></li>';
        region.append(div);
	}

}


function testFunc() {
	let districts = JSON.parse(data);
	alert(districts[0].name);
	alert(districts[1].name);
}