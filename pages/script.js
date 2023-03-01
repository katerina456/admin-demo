//счетчик символов в textarea
let counter = document.querySelector('.counter');
let description = document.querySelector('.input-description');

description.addEventListener('input', () => {
    counter.textContent = description.textLength
})


//переменная для хранения списка уже выбранных фотографий
let fotoFiles = document.getElementById('foto');

document.addEventListener("DOMContentLoaded", () => {
    getRoadById(+localStorage.getItem('index'))
});

function getRoadById(id) {
    if (id !== -1) {
        console.log('yes')

        document.querySelector('h1').textContent = 'Редактирование маршрута'
        document.querySelector('.submit').textContent = 'Сохранить изменения'

        fetch(`https://api.trackingtravel.me/test-route/${id}`, {
        method: 'GET',
        })

        .then(response => response.json())

        .then(data => {
            console.log(data);

            let title = document.getElementById('title');
            title.value = data.title;

            let country = document.getElementById('country');
            country.value = data.country.id;

            setCountryName(document.querySelector('.selected-country'), data.country.id);
            setFlag(document.querySelector('.selected-country'), data.country.id);
            setCountryValue(data.country.id);

            let description = document.getElementById('description');
            description.value = data.description;
            counter.textContent = description.textLength;
            
            let previews = document.querySelectorAll('.preview')  ;   
            
            let nameArray = [] ;
            data.photo.forEach(foto => {
                nameArray.push(foto.name);
            })


            data.photo.forEach(foto => {             
                //Входные параметры:
                let input_element = document.getElementById('foto');
                let file_name = foto.name;
                let file_link = foto.uri;
                let preview = previews[0];
                let text = document.getElementById("foto-path");

                // Вызовем функцию для вставки файла:
                setFile(input_element, file_name, file_link, preview, text, nameArray);
            })

            data.mapPhoto.forEach(foto => {
                //Входные параметры:
                let input_element = document.getElementById('map');
                let file_name = foto.name;
                let file_link = foto.uri;
                let preview = previews[1];
                let text = document.getElementById("map-path");

                // Вызовем функцию для вставки файла:
                setMapFile(input_element, file_name, file_link, preview, text);

                async function setMapFile(input, name, url, preview, text) {
                try {
                    let blob = await (await fetch(url)).blob();
                    const dt  = new DataTransfer();
                    dt.items.add(new File([blob], name, {type: blob.type}));
                    input.files = dt.files;
                    console.log('Файл успешно вставлен:');
                    console.dir(input.files);

                    
                    showFiles(input.files, preview, text)
                }
                catch(err) {
                    console.log('Ошибка при вставке файла:');
                    console.dir(err);
                }
                }
            })

            let heightPeak = document.getElementById('peak')
            heightPeak.value = data.heightPeak

            let distanceRoute = document.getElementById('distance')
            distanceRoute.value = data.distanceRoute

            let durationRoute = document.getElementById('duration')
            durationRoute.value = data.durationRoute

            let linkToMap = document.getElementById('mapLink')
            linkToMap.value = data.linkToMap
        })

        .catch((error) => {
            console.log(error)
        })
    }
}


const dt  = new DataTransfer();
async function setFile(input, name, url, preview, text, nameArray) {
  try {
    let blob = await (await fetch(url)).blob();
    
    dt.items.add(new File([blob], name, {type: blob.type}));
    input.files = dt.files;

    console.log('Файл успешно вставлен:');
    console.dir(input.files);
    
    //перестроение файлов в соответствии с массивом имен
    if (input.files.length === nameArray.length) {        
        const dtOrdered  = new DataTransfer();

        nameArray.forEach(name => {
            for(let i=0; i<input.files.length; i++) {
                if (name === input.files[i].name) {
                    dtOrdered.items.add(input.files[i])
                }
            }

            console.dir(dtOrdered.files)
        })
        
        input.files = dtOrdered.files;    
    }

    showFiles(input.files, preview, text)

    //вставка файлов для хранения
    fotoFiles = input.files
    
   // return true;
  }
  catch(err) {
    console.log('Ошибка при вставке файла:');
    console.dir(err);
  }
}


//изменение цвета скрепки на кнопке при наведении курсора
const buttonFoto = document.querySelector('.button-foto')

buttonFoto.addEventListener('mouseover', setClipWhite)

buttonFoto.addEventListener('mouseout', setClipGreen)


const buttonMap = document.querySelector('.button-map')

buttonMap.addEventListener('mouseover', setClipWhite)

buttonMap.addEventListener('mouseout', setClipGreen)


function setClipWhite() {
    this.innerHTML = '<img src="../icon/clip_hover.svg" alt="clip" class="clip"> Загрузить файл'
}

function setClipGreen() {
    this.innerHTML = '<img src="../icon/clip.svg" alt="clip" class="clip"> Загрузить файл'
}




let countryButton = document.querySelector('.country-button');


let selectedCountry = document.querySelector('.selected-country');

selectedCountry.addEventListener('click', () => {
    toggleList(list);
})

function toggleList() {
    let list = document.querySelector('.country-list');
    list.classList.toggle('view');
    countryButton.classList.toggle('up');
}

function setCountryValue(index) {
    let select = document.getElementById('country');
    select.value = +index;
}

let countryArray = ['Черногия', 'Англия', 'Нидерланды'];
let flagArray = ['url(../icon/flag-montenegro.jpg)',
                'url(../icon/flag-england.jpg)', 
                'url(../icon/flag-netherland.jpg)']

function setFlag(parent, index) {
    parent.querySelector('.flag').style.backgroundImage = flagArray[+index-1];
}

function setCountryName(parent, index) {
    parent.querySelector('.label').textContent = countryArray[+index-1]
}


let list = document.querySelector('.country-list');
let countries = list.querySelectorAll('.country');

countries.forEach(country => {
    setFlag(country, country.dataset.countryId);

    country.addEventListener('click', (event) => {
        toggleList();
        
        countries.forEach(item => item.classList.remove('select'));
        country.classList.add('select');

        let index = event.currentTarget.dataset.countryId;

        let parent = document.querySelector('.selected-country');
        let newCountry = parent.querySelector('.country');
        newCountry.dataset.countryId = index;
        
        setCountryName(parent, index);
        setFlag(parent, index);
        setCountryValue(index);   
    })   
})



//вывод имени выбранного файла
const foto = document.getElementById('foto')
let previews = document.querySelectorAll('.preview')

foto.addEventListener('change', (event) => {
    let preview = previews[0]
    const fileList = event.target.files;
    
    if (fotoFiles.length === undefined) {
        console.log(event.target)
        fotoFiles = event.target.files
        
    } else {
        let newFileList = new DataTransfer()
        
        Array.from(fotoFiles).forEach(file => {

            newFileList.items.add(file)
            
        })

        Array.from(fileList).forEach(file => {
        
            newFileList.items.add(file)
        
        })

        fotoFiles = newFileList.files
        foto.files = newFileList.files
    }

    
    let text = document.getElementById("foto-path")
    showFiles(event.target.files, preview, text)
})


function showFiles(fileList, preview, text) {
    preview.innerHTML = ''
    text.innerHTML = ''
    
    Array.from(fileList).forEach(file => {
        addFileName(file.name, text)
        addPrviewFile(file, preview)
    })
}


function addFileName(fileName, text) {
    let paragraph = document.createElement('p')
    paragraph.classList.add('label', 'words')
    paragraph.innerHTML = fileName
    text.appendChild(paragraph)    
}


function addPrviewFile(file, preview) {
    let box = document.createElement("div");
    box.classList.add('box-foto')
    box.dataset.name = file.name

    let button = document.createElement("button");
    button.textContent = 'x'
    button.classList.add('box-button')
    button.addEventListener('click', deleteFotoBox)

    let img = document.createElement("img");
    img.classList.add('preview-foto')
    img.src = URL.createObjectURL(file)

    box.appendChild(img); 
    box.appendChild(button); 

    preview.appendChild(box); 
} 


function deleteFotoBox(event) {
    let item = event.target
    
    let parent = item.parentElement
    let name = parent.dataset.name

    let grandParent = parent.parentElement.parentElement
    let fotos = grandParent.querySelector('input')

    const fileList = fotos.files;
    let newFileList = new DataTransfer()
    Array.from(fileList).forEach(file => {
        if (file.name != name) {
            newFileList.items.add(file)
        } 
    })

    fotos.files = newFileList.files
    fotoFiles = newFileList.files

    let preview = grandParent.querySelector('.preview')
    let text = grandParent.querySelector('.span')
    
    showFiles(fotos.files, preview, text)
}



const map = document.getElementById('map')

map.addEventListener('change', (event) => {
    console.log(map.value)
    
    let preview = previews[1]

    const fileList = event.target.files;
    
    let text = document.getElementById("map-path")

    showFiles(fileList, preview, text)
})





//отправка данных на сервер
let form = document.querySelector('.form')

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let result = document.querySelector('.result');

  let data = new FormData(form);
  let url = 'https://api.trackingtravel.me/...........'
  let metod = 'POST'

  console.log(+localStorage.getItem('index'))
  if (+localStorage.getItem('index') !== -1) {
    url = `https://api.trackingtravel.me/..............`
    metod = 'PUT'
  }

  /* fetch(url, {
    method: metod,
    body: data
  })

  .then(function(response) {
    console.log(response.status )    //=> number 100–599

    localStorage.index = -1;

    let body = document.querySelector('body');
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    body.append(overlay);
    
    if (response.status > 299) {
        let mistake = document.querySelector('.mistake')
        
        toggleChoiseField(mistake)
        setTimeout(() => {
            toggleChoiseField(mistake);
            body.removeChild(document.querySelector('.overlay'));
        }, 3000)
        return
    }

    toggleChoiseField(result)
    addEvensForButtons(result, body)
    }) */

    let body = document.querySelector('body');
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    body.append(overlay);

    let demo = document.querySelector('.demo')
    toggleChoiseField(demo)
    setTimeout(() => {
        toggleChoiseField(demo);
        body.removeChild(document.querySelector('.overlay'));
    }, 3000)        
        

})


//вывод поля с кнопками после успешной отправки формы
function toggleChoiseField(field) {
    field.classList.toggle('view')
}

function addEvensForButtons(parent, body) {
    let goToMain = parent.querySelector('.return') 
    goToMain.addEventListener('click', () => {
        document.location='../index.html'
    })

    let oneMore = parent.querySelector('.oneMore') 
    oneMore.addEventListener('click', () => {
        console.log('hello')
        clearForm(form)
        
        toggleChoiseField(document.querySelector('.result'))
        body.removeChild(document.querySelector('.overlay'))
    })
}

//очистка формы перед ее повторным заполнением
function clearForm(form) {
    const { elements } = form
    const data = Array.from(elements)
    .filter((item) => !!item.name)
    .forEach(element => {
      element.value = ''
    })

    document.getElementById("foto-path").textContent = '';
    document.getElementById("map-path").textContent = '';
    document.querySelector('.counter').textContent = '0';

    document.querySelectorAll('.preview').forEach(item => {
        item.innerHTML = '';
    })
}


//вернуться на главную
let btnMain = document.querySelector('.button-create')

btnMain.addEventListener('click', () => {
    document.location='../index.html'
})
