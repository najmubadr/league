// var players = document.querySelectorAll('.modal-content select.selector');
var matchStarts = localStorage.getItem('matchStarts');
var matchLog = $('.match-log');
var log, cmd1, cmd2;

if(matchStarts){
    // матч запущен
    $('#versus').classList.add('hidden')
    $('.stat-wrap').classList.remove('hidden')
    
    log  = get('log', true);
    cmd1 = get('cmd1', true);
    cmd2 = get('cmd2', true);
    
    bindData()
} else {
    // матч не начался
    versus = $('#versus');
    selector1 = $('.versus #cmd-1');
    selector2 = $('.versus #cmd-2');
    
    teams.forEach(team=>{
        selector1.append(createElement('option', team.title));
        selector2.append(createElement('option', team.title));
    })

    versus.querySelector('.match-start')
        .addEventListener('click', e => {
            cmd1 = selector1.value;
            cmd2 = selector2.value;
            versus.addEventListener('submit', e => {
                e.preventDefault()
                e.target.classList.add('hidden')
                $('.stat-wrap').classList.remove('hidden')
            })
            
            initStat()
        })
}

function initStat(){
    var stat = {goal: [],foul: 0, card:[]};
    
    teams.forEach(team=>{
        if (team.title == cmd1) cmd1 = {...team, ...stat}
        if (team.title == cmd2) cmd2 = {...team, ...stat}
    })

    set('matchStarts', new Date().valueOf());
    set('foul1', 0);
    set('foul2', 0);
    set('log', '[]');
    set('cmd1', cmd1, true);
    set('cmd2', cmd2, true);
    // Timer
    set('secondTime', false);
    set('pause', false);
    set('pauseTotal', 0);
    
    bindData()
}

document.querySelector('.second-time input')
    .addEventListener("change", e=>{
        set('secondTime', e.currentTarget.checked);
        set('foul1', 0), set('foul2', 0);
        $('.foul .cmd-1').innerHTML = get('foul1');
        $('.foul .cmd-2').innerHTML = get('foul2');
    });

document.querySelector('.pause input')
    .addEventListener("change", e => {
        var duration = 15;
        var status = e.currentTarget.checked;
        set('pause', status)

        if(status){
            set('pauseStart', new Date().valueOf())
        }

        if(!status) {
            if(getSec(get('pauseStart', true)) > duration) {
                set("pauseTotal", getSec(get("pauseStart", true)) + get("pauseTotal", true))
            }
        }
    });




$('.btn-select').addEventListener('click', e=>{
    var selected = $('.modal-content .selected');
    var forms = $$('.modal-content .selected form');
    var action = {}
    var matchTime = 0;
    forms.forEach(form => {
        if(form.checkValidity()) {
            addAction(getMatchTime(), Object.fromEntries(new FormData(form)))
            logF(getMatchTime(), Object.fromEntries(new FormData(form)))
            form.parentElement.remove();
        } else {
            form.querySelector('.submit-form').click(); 
        }
    });

    if(!Object.keys(action).length && !selected.children.length) {
        modalToggle();
    }
})




function addAction(time, data){
    console.log(data)
    switch (data.action) {
        case 'red':
            this['cmd'+data.cmd].card.push({time: time, color: data.action, player: data.player })
            break;
        case 'yellow':
            this['cmd'+data.cmd].card.push({time: time, color: data.action, player: data.player })
            break;

        case 'goal':
            this['cmd'+data.cmd].goal.push({time: time, player: data.player })
            break;
        case 'assist':
            this['cmd'+data.cmd].goal[this['cmd'+data.cmd].goal.length - 1].assist = data.player;
            break;
        case 'auto':
            if(parseInt(data.cmd) == 1) {
                cmd2.goal.push({time: time, player: data.player, auto: true})
            } else {
                cmd1.goal.push({time: time, player: data.player, auto: true})
            }
            break;
        
    }
    saveData();
}
function logF(time, data){

    log.push({time: time, action: data.action, player: data.player})

    switch (data.action) {
        case 'red':
            matchLog.append(createElement('pre', `${time} <span class='action-log-icon'>🟥</span> ${data.player}`))
            break;
        case 'yellow':
            matchLog.append(createElement('pre', `${time} <span class='action-log-icon'>🟨</span> ${data.player}`))
            break;

        case 'goal':
            matchLog.append(createElement('pre', `${time} <span class='action-log-icon'>⚽️</span> ${data.player}`))
            break;
        case 'assist':
            matchLog.append(createElement('pre', `${time} <span class='action-log-icon'>👟</span> ${data.player}`))
            break;
        case 'auto':
            matchLog.append(createElement('pre', `${time} <span class='action-log-icon'>🗿</span> ${data.player}`))
            break;
    }
    saveData();
}

function saveData() {
    $('.match-log').scrollTop = $('.match-log').scrollHeight;
    set('cmd1', cmd1, true);
    set('cmd2', cmd2, true);
    set('log', log, true);
}

function bindData(){
    log = get('log', true);
    if(log.length){
        log.forEach(rec=>{
            switch (rec.action) {
                case 'red':
                    matchLog.append(createElement('pre', `${rec.time}' <span class='action-log-icon'>🟥</span> ${rec.player}`))
                    break;
                case 'yellow':
                    matchLog.append(createElement('pre', `${rec.time}' <span class='action-log-icon'>🟨</span> ${rec.player}`))
                    break;
        
                case 'goal':
                    matchLog.append(createElement('pre', `${rec.time}' <span class='action-log-icon'>⚽️</span> ${rec.player}`))
                    break;
                case 'assist':
                    matchLog.append(createElement('pre', `${rec.time}' <span class='action-log-icon'>👟</span> ${rec.player}`))
                    break;
                case 'auto':
                    matchLog.append(createElement('pre', `${rec.time}' <span class='action-log-icon'>🗿</span> ${rec.player}`))
                    break;
            }
        });
        $('.match-log').scrollTop = $('.match-log').scrollHeight;
    }
    
    $('.pause input').checked = get('pause', true);
    $('.second-time input').checked = get('secondTime', true);

    $('.foul .cmd-1').innerHTML = get('foul1');
    $('.foul .cmd-2').innerHTML = get('foul2');
    
    $('.stat-result .cmd-1').innerHTML = cmd1.title;
    $('.stat-result .cmd-2').innerHTML = cmd2.title;
    
    $('.score .score-1').innerHTML = Object.keys(cmd1.goal).length;
    $('.score .score-2').innerHTML = Object.keys(cmd2.goal).length;
    
    $('label[for="cmd-1-tab"]').innerHTML = cmd1.title
    $('label[for="cmd-2-tab"]').innerHTML = cmd2.title
    
    insertPlayersToOptions(cmd1.players, '.selector-cmd-1 select')
    insertPlayersToOptions(cmd2.players, '.selector-cmd-2 select')
}

function getMatchTime(s){
    var pause = get('pauseTotal');
    var matchStarts = getMatchSec(matchStarts);
    var matchTime = Math.round( (matchStarts - pause) / 60);
    if($('.second-time input').checked){
        if( matchTime > 40) return '40+'
        return matchTime

    } else {
        if( matchTime > 20) return '20+'
        return matchTime
    }
}

document.querySelectorAll('.foul button').forEach(el=>{
    el.addEventListener('click', e=>{
        var target = e.currentTarget;
        var value = parseInt(target.innerHTML);

        if(target.classList.contains('cmd-1')){
            cmd1.foul += 1;
            set('foul1', parseInt(get('foul1')) + 1)
            
            if(value > 4) {
                alert('6 FOULS. IT\'S PENALTY!',)
                $('.foul .cmd-1').innerHTML = 0;
                set('foul1', 0)    
            }
        } else {
            cmd2.foul += 1;
            set('foul2', parseInt(get('foul2')) + 1)
            
            if(value > 5) {
                alert('Its penalty',)
                $('.foul .cmd-2').innerHTML = 0;
                set('foul2', 0)    
            }
        }

        saveData();
        $('.foul .cmd-1').innerHTML = get('foul1');
        $('.foul .cmd-2').innerHTML = get('foul2');
    })
    
})

$(".btn-complete-match")?.addEventListener("click", e=>{
    if(confirm("Вы уверены что хотите завершить матч?")){
        $(".stat-wrap").classList.add("hidden")
        $(".results").classList.remove("hidden")

        $(".match .cmd-1 .cmd-logo img").setAttribute("src", cmd1.logo);
        $(".match .cmd-2 .cmd-logo img").setAttribute("src", cmd2.logo);
        
        $(".match .cmd-1 .cmd-name").innerHTML = cmd1.title
        $(".match .cmd-2 .cmd-name").innerHTML = cmd2.title
        
        $('.results .match-result .cmd-1').innerHTML = Object.keys(cmd1.goal).length;
        $('.results .match-result .cmd-2').innerHTML = Object.keys(cmd2.goal).length;
        
        $('.control.goal .cmd-1').innerHTML = Object.keys(cmd1.goal).length;
        $('.control.goal .cmd-2').innerHTML = Object.keys(cmd2.goal).length;
        
        $('.control.foul .cmd-1').innerHTML = cmd1.foul;
        $('.control.foul .cmd-2').innerHTML = cmd2.foul;
        
        var cmd1Goals = $('.control-details.goal .cmd-1 ul');
        var cmd2Goals = $('.control-details.goal .cmd-2 ul');
        
        var cmd1Cards = $('.control-details.foul .cmd-1 ul');
        var cmd2Cards = $('.control-details.foul .cmd-2 ul');
        
        cmd1.goal.forEach(goal=>{cmd1Goals.append(renderGoal(goal))})
        cmd2.goal.forEach(goal=>{cmd2Goals.append(renderGoal(goal))})
        cmd1.card.forEach(card=>{cmd1Cards.append(renderCard(card))})
        cmd2.card.forEach(card=>{cmd2Cards.append(renderCard(card))})
        
        $$(".results .control, .results .control-details").forEach(el=>el.setAttribute("contenteditable",true))
        
    }
})

$('.new-match').addEventListener('click', ()=>{
    if(confirm("Все данные будут стёрты. Вы уверены, что хотите этого")){
        localStorage.clear()
        window.location.reload()
    }

})


function renderGoal(goal){
    li = createElement('li')
    time = createElement('div', goal.time+'\'&nbsp;')
    time.classList.add('time');

    li.append(time);

    info = createElement('div')
    info.classList.add('info')
    if(goal.auto){
        g = createElement('span', '🗿 Автогол (' + goal.player +')')
    } else {
        g = createElement('span', '⚽️ ' + goal.player)
    }
    info.append(g)

    if(goal.assist) {
        assist = createElement('span', '👟 ' + goal.assist)
        info.append(assist)
    }
    li.append(info)
    return li
}

function renderCard(card, color){
    li = createElement('li')
    time = createElement('div', card.time+'\'&nbsp;')
    time.classList.add('time');

    li.append(time);

    
    if(card.color == 'red'){
        info = createElement('div', '🟥 ' + card.player)
    } else {
        info = createElement('div', '🟨 ' + card.player)
    }

    li.append(info)
    return li
}