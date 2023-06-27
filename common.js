function $(s){return document.querySelector(s)}
function $$(s){return document.querySelectorAll(s)}

function createElement(elementName, value, classList) {
    classList = classList || "";
    var el = document.createElement(elementName);
    if(value) el.innerHTML = value;
    el.className = classList
    return el;
}

function createFormElement(elementName, attr, classList) {
    classList = classList || "";
    var el = document.createElement(elementName);
    el.className = classList
    if(attr){
        if(Object.keys(attr).length>0) {
            for(var i in attr) {
                el.setAttribute(i, attr[i])
            }
        }
    }
    return el;
}

function get(item, deserialize = false) {
    if(deserialize) {
        return JSON.parse(localStorage.getItem(item));
    }
    return localStorage.getItem(item)
}

function set(item, value, serialize = false) {
    if(serialize) {
        return localStorage.setItem(item, JSON.stringify(value))
    }
    
    return localStorage.setItem(item, value)
}

function insertPlayersToOptions(players, to) {
    players.forEach(option=>{
        document.querySelector(to)
            .insertAdjacentElement('beforeend', createElement('option', option))
    });
}

function getSec(s) {
    return Math.round((new Date().valueOf() - s) / 1000)
}

function getMatchSec(){
    return Math.round( (new Date().valueOf() - localStorage.getItem('matchStarts') ) / 1000 )
}