let btnCreate = document.querySelector('.button-create')

btnCreate.addEventListener('click', () => {
  localStorage.setItem('index', -1);
  document.location='pages/form.html'
})


document.addEventListener("DOMContentLoaded", getAllRoads);

function getAllRoads() {
  fetch('https://api.trackingtravel.me/test-routes', {
    method: 'GET',
  })

  .then(response => response.json())

  .then(data => {
    console.log(data)
    let main = document.querySelector('.main')
    main.innerHTML = '';

    data.forEach(item => {
      createSection(main, item)
    })
  })

  .catch(() => {
    console.log('Ошибка')
  })
}




function createSection(main, item) {
  let section = document.createElement('section');
  section.classList.add('section');
  
  section.append(createManagment(item));
  
  section.append(createTable(item));

  let titleArray = ['Description', 'Photo'];

  item.photo.push(item.mapPhoto[0])

  let valueArray = [item.description, item.photo];
  let lastTablePart = addTablePart(titleArray, valueArray);
  lastTablePart.classList.add('last')
  section.append(lastTablePart);

  main.append(section);
}


function createManagment(item) {
  let management = document.createElement('div');
  management.classList.add('management');

  management.append(createManagmentItem(item));
  management.append(addButtons(item.id))
  
  return management;
}


function createManagmentItem(item) {
  let managementItem = document.createElement('div');
  managementItem.classList.add('managmant-item');

  let paragraph = document.createElement('p');
  paragraph.classList.add('item-id');
  paragraph.innerHTML = `ID <span id="id">${item.id}</span>`;

  managementItem.append(paragraph);
  return managementItem;
}


function addButtons(index) {
  let div = document.createElement('div');
  div.classList.add('management-buttons-box')
  
  let edit = addButton(['buttons', 'buttons-edit'], "", "", index);
  div.append(edit);

  let del = addButton(['buttons', 'buttons-del'], "./icon/delete.svg", "delete", index);
  div.append(del);
  return div;
}


function addButton(classes, url, text, index) {
  let button = document.createElement('button');
  classes.forEach(clas => {
    button.classList.add(clas);
  })

  button.dataset.index = index;
  
  if (button.classList.contains('buttons-del')) {
    let img = document.createElement('img');
    img.src = url;
    img.alt = text;
    button.append(img);
  }

  button.addEventListener('click', (event) => {   
    let id = +event.currentTarget.dataset.index;
    if (button.classList.contains('buttons-del')) {
      removeRoad(event, id);
    } else {
      localStorage.setItem('index', id);
      document.location='pages/form.html';
    }
    
  })
  return button;
}


function removeRoad(event, id) {
  let body = document.querySelector('body');
  let overlay = document.createElement('div');
  overlay.classList.add('overlay');
  body.append(overlay);

  let parent = event.currentTarget.parentElement.parentElement;

  let div = document.createElement('div');
  div.classList.add('removeInfo');

  let paragraph = document.createElement('p');
  paragraph.classList.add('removeTitle');
  paragraph.textContent = 'Вы уверены, что хотите удалить данный маршрут?';
  div.append(paragraph);

  let box = document.createElement('div');
  box.classList.add('removeInfo-button-box');

  let buttonNo = document.createElement('button');
  buttonNo.classList.add('buttons-edit', 'removeInfo-button');
  buttonNo.textContent = 'Отмена';
  buttonNo.addEventListener('click', (event) => {
    let child = event.currentTarget.parentElement.parentElement;
    parent.removeChild(child);
    body.removeChild(document.querySelector('.overlay'))
  })
  box.append(buttonNo);

  

  let buttonYes = document.createElement('button');
  buttonYes.classList.add('buttons-del', 'removeInfo-button');
  buttonYes.textContent = 'Удалить';
  buttonYes.addEventListener('click', (event) => {
    console.log(event.currentTarget.parentElement)
    let child = event.currentTarget.parentElement;
    child.innerHTML = "Это демонстрационная версия. <br>Данная функция в ней отключена";
    setTimeout(() => {  
      parent.removeChild(child.parentElement);
      body.removeChild(document.querySelector('.overlay'))
    }, 2000);
  })
  /* buttonYes.addEventListener('click', (event) => {
    fetch(`https://api.trackingtravel.me/..........`, {
      method: 'DELETE',
    })

    .then(response => {
      console.log(response.status);
      parent.innerHTML = 'Маршрут удален';
      setTimeout(() => {
        body.removeChild(document.querySelector('.overlay'))
        getAllRoads()
      }, 2000);
    })
  }) */
  box.append(buttonYes);

    
  div.append(box);
  parent.append(div);
}


function createTable(item) { 
  let table = document.createElement('div');
  table.classList.add('table');
  
  let titleArray = ['Title', 'Country', 'Link to Map'];
  let valueArray = [item.title, item.country.nameOfCountry, item.linkToMap];
  table.append(addTablePart(titleArray, valueArray));

  titleArray = ['Distance', 'Duration', 'Height Peak'];
  valueArray = [item.distanceRoute, item.durationRoute, item.heightPeak];
  table.append(addTablePart(titleArray, valueArray, 'width'));
  return table;
}


function addTablePart(titleArray, valueArray, newItemClass) {
  let tablePart = document.createElement('div');
  tablePart.classList.add('table-part');

  for (let i = 0; i < titleArray.length; i++) {
    tablePart.append(addTableItem(titleArray[i], valueArray[i], newItemClass));
  }

  return tablePart;
}


function addTableItem(title, text, newItemClass) {
  let div = document.createElement('div');
  div.classList.add('table-item');

  let itemName = document.createElement('div');
  itemName.classList.add('table-item-name');
  itemName.textContent = title;
  div.append(itemName);

  let itemValue = document.createElement('div');
  itemValue.classList.add('table-item-value');
  if (newItemClass) {
    itemValue.classList.add(newItemClass);
  }

  if (title === 'Link to Map') {
    let link = document.createElement('a');
    link.href = text
    link.target = '_blank';
    link.textContent = 'Link';
    itemValue.append(link);
  } else if (title === 'Photo') {
    text.forEach(foto => {
      let div = document.createElement('div');
      div.classList.add('photo')
      div.style.backgroundImage = `url(${foto.uri})`

      itemValue.append(div)
    })
  } else {
    itemValue.textContent = text;
  }
  
  div.append(itemValue);

  return div;
}