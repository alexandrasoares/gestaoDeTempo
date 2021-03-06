const circuloElement = document.querySelector('.circle');
const tempoElement = document.querySelector('.tempo');
const turnoElement = document.querySelector('.turno');
const tipoTempoElement = document.querySelector('.tipo-tempo');
const controleTempo = document.querySelector('.controle-tempo');
const reinicio = document.querySelector('.reinicio');
const somNotificacao = document.querySelector('#notificacao');

let rodando,
    descanso,
    tempoTrabalho,
    pausaTrabalho,
    pausaLongaTrabalho,
    totalTurnos,
    turnoAtual,
    tempoTotal,
    tempoRestante,
    temporizador;

controleTempo.addEventListener('click', despausarPausar);
reinicio.addEventListener('click', reiniciar);

function iniciarValores() {
    rodando = false;
    descanso = false;
    tempoTrabalho = 1 * 5, // 24 * 60
    pausaTrabalho = 1 * 5, // 5 * 60
    pausaLongaTrabalho = 15 * 60,
    totalTurnos = 4,
    turnoAtual = 1,
    tempoTotal = tempoTrabalho;
    tempoRestante = tempoTotal;
    temporizador = null;
}

function despausarPausar() {
    rodando ? pausar() : iniciar();
}

function passarPorcentagemCirculo(porcentagem) {
    const perimetroCirculo = 597;
    const dashoffset = (perimetroCirculo * (porcentagem / 100)); 
    circuloElement.style.setProperty('--dash-offset', perimetroCirculo - dashoffset)
}

function iniciar() {
    rodando = true;
    controleTempo.innerText = 'Pausar';
    temporizador = setInterval(atualizarTempo, 1000);
}

function pausar() {
    rodando = false;
    controleTempo.innerText = 'Iniciar';
    clearInterval(temporizador);
}

function desenharTempo() {
    const minutes = Math.floor(tempoRestante/60).toString().padStart(2, '0');
    const seconds = Math.floor(tempoRestante%60).toString().padStart(2, '0');

    tempoElement.innerText = `${minutes}:${seconds}`;
    passarPorcentagemCirculo(tempoRestante/tempoTotal*100);
}

function desenharTurno() {
    let tipoTempo = 'Trabalho';
    if (descanso) {
        tipoTempo = turnoAtual < totalTurnos ? 'Descanso' : 'Descanso Longo';
    }

    tipoTempoElement.innerText = tipoTempo;
    turnoElement.innerText = `${turnoAtual} / ${totalTurnos}`
}

function reiniciar() {
    pausar();
    iniciarValores();
    desenharTempo();
    desenharTurno();
}

function atualizarTempo() {
    if (tempoRestante > 0) {
        tempoRestante --;
    } else {
        finalizarTurno();
    }

    desenharTempo();
}

function finalizarTurno() {
    pausar();
    somNotificacao.play();
    mudarProximoTurno();
    desenharTurno();
}

function mudarProximoTurno(){
    descanso = !descanso;
    if (!descanso) {
        turnoAtual++;
    }

    if (turnoAtual <= totalTurnos) {
        if (descanso) {
            if (turnoAtual < tempoTotal) {
                tempoTotal = pausaTrabalho;
            } else {
                tempoTotal = pausaLongaTrabalho;
            } 
        } else {
            tempoTotal = tempoTrabalho;
        }

        tempoRestante = tempoTotal;
    } else {
        reiniciar();
    }
}

reiniciar();

export default RelogioTrabalho;