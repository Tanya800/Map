//переписать на запрос из бд названий всех регионов
function loadDistrict(){
    let districts = "Orel";

    for (let i = 0; i < 25; i++) {
        let div = document.createElement('div');
        div.innerHTML = '<li class="list-group-item" data-id= "#reg'+ i +'"><a class="reg"  href="#reg'+ i +'" style="text-decoration: none;" id="reg'+ i +'">' + districts + '</a></li>';
        region.append(div);
    }

}