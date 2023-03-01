let form = document.querySelector('.form')
//отправка формы по default событию submit
/* form.action = 'https://api.trackingtravel.me/test-route/create';
form.method = 'POST';  */


//let form = document.querySelector('.form')

form.addEventListener('submit', (event) => {
    event.preventDefault()

    //шестой вариант

    function dataFtomForm(formNode) {
        return new FormData(formNode)
    }

    let oneMore = dataFtomForm(form)


    //седьмой вариант

    fetch(`https://api.trackingtravel.me/test-route/create`, {
      method: 'POST',
      body: oneMore
    })

    .then(function(response) {
      console.log('7', response.status )    //=> number 100–599

      if (response.status > 299) {
        let result = document.querySelector('.result')
        result.innerHTML = ''
        result.innerHTML = '<p>Ошибка отправления</p>'
        return
      }
      console.log('hello')
        /* return response.json() */
      })
/* 
     .then(data => {
        console.log(data)
    })

   .catch((error) => {  
      console.log(error)
    })  */
    
})



