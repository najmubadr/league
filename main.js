// var players = document.querySelectorAll('.modal-content select.selector');
var matchStarts = localStorage.getItem('matchStarts');
var log, cmd1, cmd2;

if(matchStarts){
    // матч запущен
    $('#versus').classList.add('hidden')
    $('.stat-wrap').classList.remove('hidden')
    
    log   = get('log', true);
    cmd1 = get('cmd1', true);
    cmd2 = get('cmd2', true);
    
    for(var rec in log) {
        matchLog.append(createElement('pre', `${rec} ${log[rec]}`))
    }
    
    $('.pause input').checked = get('pause', true);
    $('.second-time input').checked = get('secondTime', true);

    $('.foul .cmd-1').innerHTML = cmd1.foul;
    $('.foul .cmd-2').innerHTML = cmd2.foul;
    
    $('.stat-result .cmd-1').innerHTML = cmd1.title;
    $('.stat-result .cmd-2').innerHTML = cmd2.title;
    
    $('.score .score-1').innerHTML = Object.keys(cmd1.goal).length;
    $('.score .score-2').innerHTML = Object.keys(cmd2.goal).length;
    
    $('label[for="cmd-1-tab"]').innerHTML = cmd1.title
    $('label[for="cmd-2-tab"]').innerHTML = cmd2.title
    
    insertPlayersToOptions(cmd1.players, '.selector-cmd-1 select')
    insertPlayersToOptions(cmd2.players, '.selector-cmd-2 select')


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
    var stat = {goal: {},red: {},yellow: {},foul: 0, auto: {}};
    
    teams.forEach(team=>{
        if (team.title == cmd1) cmd1 = {...team, ...stat}
        if (team.title == cmd2) cmd2 = {...team, ...stat}
    })

    set('matchStarts', new Date().valueOf());
    set('log', '{}');
    set('cmd1', cmd1, true);
    set('cmd2', cmd2, true);
    // Timer
    set('secondTime', false);
    set('pause', false);
    set('fps', 0);
    set('sps', 0);
    

}

document.querySelector('.second-time input')
    .addEventListener("change", e=>{
        set('secondTime', e.currentTarget.checked);
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
                if(get('secondTime', true) == false) {
                    set("fps", getSec(get("pauseStart", true)) + get("fps", true))
                } else {
                    set("sps", getSec(get("pauseStart", true)) + get("sps", true))
                }
            }
        }
    });


function addAction(){
    var selected = $('.modal-content .selected');
    var forms = $$('.modal-content .selected form');
    var action = {};
    var fixTime = 0;
    var hasInvadil = false;
    var log = JSON.parse(localStorage.getItem('log'));
    forms.forEach(form => {
        if(form.checkValidity()) {
            action[fixTime] = Object.fromEntries(new FormData(form))
            form.parentElement.remove();
            fixTime++
            // log[1] = form
        } else {
            form.querySelector('.submit-form').click();
            
        }
    });
    console.log(action)
    if(Object.keys(action).length == 0 && selected.children.length == 0) {
        modalToggle();
    } else if(!selected.children.length && !Object.keys(action).length) {
        modalToggle();
    }
}

$('.btn-select').addEventListener('click', e=>{
    addAction();
    // modalToggle();
})

function logf(time, form){
    if(form.action == 'goal') {
        if(form.cmd = 1) {
            
        }
    }
}


function bindData(){

}
function getMatchTime(){
    // get(pauseSum)
}