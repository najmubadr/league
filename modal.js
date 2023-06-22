function selectItem(el){
    var cmd = 0;
    var f = document.createElement('form')
    f.append(createFormElement('input', {type: "text", value: el.value, name: "player"}))
    if(el.classList.contains('cmd-1')){
        cmd = 1;
    } else {
        cmd = 2;
    }
    f.append(createFormElement('input', {type: "number", value: cmd, name:'cmd'},"hidden"))

    var s = document.createElement('select');
    s.insertAdjacentHTML('beforeend', actHtml);
    s.setAttribute('name', 'action')
    s.setAttribute('required', '')
    s.addEventListener('change', e=>e.currentTarget.classList.add('is-valid'))
    var b = createFormElement('input', {type: 'submit', value: 'ok'})
    b.classList.add('hidden', 'submit-form')
    f.append(s)
    f.append(b)


    var li = document.createElement('li');
    li.classList.add('selected-item')
    var a = document.createElement('a');
    a.innerHTML = '❌'
    a.classList.add('delete-selected-item')
    li.append(f);
    li.append(a);

    el.selectedIndex = 0

    document.querySelector('.selected').append(li)
}


document.querySelectorAll('.tabs .selector')
.forEach(el=>{
    el.addEventListener('change', e=>{
        selectItem(e.currentTarget)
    })
})

// document.querySelectorAll('.delete-selected-item')
//     .forEach(el=>{
//         el.addEventListener('click', e => {
//             e.currentTarget.parentElement.remove()
//         })
//     })



const ul = document.querySelector('ul.selected');
ul.addEventListener('click', e => {
    const { target } = e;
    if (target.matches('.delete-selected-item')) {
        document.querySelector('.selector')
            .append(
                createElement(
                    'option',
                    e.target
                        .parentElement
                        .childNodes[0].nodeValue
                )
            )
        e.target.parentElement.remove()

    }
});
var actHtml = `
<option value="">❓Выберите</option>
<option value="goal">⚽️ гол</option>
<option value="assist">👟 пас</option>
<option value="yellow">🟨 карта</option>
<option value="red">🟥 карта</option>
<option value="auto">🗿 автогол</option>
`; 
// ` 



function modalToggle(){
    document.querySelector(".modal .tabs ")
    document.querySelector(".modal")
    .classList.toggle('open')
    document.querySelectorAll('.modal-content .selected > *')
    .forEach(i=>i.remove())
}

document.querySelector('.modal-foot .btn-cancel')
    .addEventListener('click', ()=>modalToggle())

function checkCmd(){

}
document.querySelectorAll('.stat .select-player')
.forEach(el=>{
    el.addEventListener('click', e => {
        modalToggle()
        if(e.currentTarget.classList.contains('cmd-1')){
            document.querySelector('.modal input#cmd-1-tab').checked = true
        } else {
            document.querySelector('.modal input#cmd-2-tab').checked = true
        }
        
    })
})