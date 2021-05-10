add_school.onclick = function () {
    console.log(1);
    document.getElementById('district').style.display = 'none';
    document.getElementById('school').style.display = 'block';
}

cancel.onclick = function () {
    document.getElementById('school').style.display = 'none';
    document.getElementById('district').style.display = 'block';
}

let editCollection =  document.getElementsByClassName('fas fa-edit');
for (i = 0; i < editCollection.length; i++) {
    editCollection[i].onclick = function () {
        document.getElementById('school').style.display = 'block';
        document.getElementById('district').style.display = 'none';
    }
}

let delCollection =  document.getElementsByClassName('fas  fa-times');
let schoolCollection =  document.getElementsByClassName('s');
for (i = 0; i < delCollection.length; i++) {
    delCollection[i].onclick = function () {

    }
}