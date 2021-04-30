reg_dist.onclick = function () {
    document.getElementById('region').style.display = 'block';
    document.getElementById('district').style.display = 'none';
}

reg_s.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('region').style.display = 'block';
}
dist_s.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('district').style.display = 'block';
}

logo_admin.onclick = function () {
    document.getElementById('auth').style.display = 'block';
}

let regCollection =  document.getElementsByClassName('reg');
let i;
for (i = 0; i < regCollection.length; i++) {
    regCollection[i].onclick = function () {
        document.getElementById('region').style.display = 'none';
        document.getElementById('district').style.display = 'block';
    }
}

let mregCollection =  document.getElementsByClassName('map-region');
for (i = 0; i < mregCollection.length; i++) {
    mregCollection[i].onclick = function () {
        document.getElementById('region').style.display = 'none';
        document.getElementById('district').style.display = 'block';
    }
}

let sCollection =  document.getElementsByClassName('s');
for (i = 0; i < sCollection.length; i++) {
    sCollection[i].onclick = function () {
        document.getElementById('district').style.display = 'none';
        document.getElementById('school').style.display = 'block';
    }
}

