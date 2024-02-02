var intervaloCronometro;
var tempoRestante;
var lutaEmAndamento = false;
var faltasLutador1 = 0;
var faltasLutador2 = 0;
var primeiroPontuador = null;
var historicoAcoes = [];

function adicionarPonto(lutador, pontosAdicionados) {
    if (!lutaEmAndamento) {
        return;
    }

    var elementoPontos = document.getElementById('pontos' + lutador.charAt(0).toUpperCase() + lutador.slice(1));
    var pontos = parseInt(elementoPontos.innerText);
    pontos += pontosAdicionados;
    elementoPontos.innerText = pontos;

    if (pontos >= 4) {
        encerrarLuta();
    }

    historicoAcoes.push({ tipo: 'ponto', lutador: lutador, pontos: pontosAdicionados });

    if (primeiroPontuador === null) {
        primeiroPontuador = lutador;
    }
}

function registrarFalta(lutador) {
    if (!lutaEmAndamento) {
        return;
    }

    if (lutador === 'lutador1') {
        faltasLutador1++;
        document.getElementById('faltasLutador1').innerText = faltasLutador1;
        if (faltasLutador1 >= 5) {
            encerrarLutaPorFaltas('lutador2');
        }
    } else if (lutador === 'lutador2') {
        faltasLutador2++;
        document.getElementById('faltasLutador2').innerText = faltasLutador2;
        if (faltasLutador2 >= 5) {
            encerrarLutaPorFaltas('lutador1');
        }
    }

    historicoAcoes.push({ tipo: 'falta', lutador: lutador });
}

function desfazerUltimaAcao() {
    if (historicoAcoes.length === 0 || !lutaEmAndamento) {
        return;
    }

    var ultimaAcao = historicoAcoes.pop();

    if (ultimaAcao.tipo === 'ponto') {
        var elementoPontos = document.getElementById('pontos' + ultimaAcao.lutador.charAt(0).toUpperCase() + ultimaAcao.lutador.slice(1));
        var pontos = parseInt(elementoPontos.innerText);
        pontos -= ultimaAcao.pontos;
        pontos = Math.max(0, pontos);
        elementoPontos.innerText = pontos;

        if (primeiroPontuador === ultimaAcao.lutador && pontos === 0) {
            primeiroPontuador = encontrarProximoPrimeiroPontuador();
        }
    } else if (ultimaAcao.tipo === 'falta') {
        if (ultimaAcao.lutador === 'lutador1') {
            faltasLutador1 = Math.max(0, faltasLutador1 - 1);
            document.getElementById('faltasLutador1').innerText = faltasLutador1;
        } else {
            faltasLutador2 = Math.max(0, faltasLutador2 - 1);
            document.getElementById('faltasLutador2').innerText = faltasLutador2;
        }
    }
}

function encontrarProximoPrimeiroPontuador() {
    for (var acao of historicoAcoes) {
        if (acao.tipo === 'ponto' && acao.pontos > 0) {
            return acao.lutador;
        }
    }
    return null;
}

function encerrarLutaPorFaltas(vencedor) {
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
    }
    lutaEmAndamento = false;
    var mensagem = vencedor === 'lutador1' ? 'Aka venceu!' : 'Shiro venceu!';
    document.getElementById('mensagemVencedor').innerText = mensagem;
}

function iniciarCronometro() {
    intervaloCronometro = setInterval(atualizarCronometro, 1000);
}

function atualizarCronometro() {
    tempoRestante--;
    document.getElementById('cronometro').innerText = formatarTempo(tempoRestante);

    if (tempoRestante <= 0) {
        encerrarLuta();
    }
}

function formatarTempo(segundos) {
    var minutos = Math.floor(segundos / 60);
    var segundosRestantes = segundos % 60;
    return minutos.toString().padStart(2, '0') + ':' + segundosRestantes.toString().padStart(2, '0');
}

function iniciarOuPausarLuta() {
    var botao = document.getElementById('botaoIniciarPausarLuta');

    if (!lutaEmAndamento) {
        resetarPontos();
        tempoRestante = 120;
        lutaEmAndamento = true;
        iniciarCronometro();
        botao.innerText = 'Pausar Luta';
    } else {
        if (intervaloCronometro) {
            clearInterval(intervaloCronometro);
            intervaloCronometro = null;
            botao.innerText = 'Despausar Luta';
        } else {
            iniciarCronometro();
            botao.innerText = 'Pausar Luta';
        }
    }
}

function encerrarLuta() {
    clearInterval(intervaloCronometro);
    lutaEmAndamento = false;
    declararVencedor();
    document.getElementById('botaoIniciarPausarLuta').innerText = 'Iniciar Luta';
}

function declararVencedor() {
    var pontosLutador1 = parseInt(document.getElementById('pontosLutador1').innerText);
    var pontosLutador2 = parseInt(document.getElementById('pontosLutador2').innerText);
    var mensagem;

    if (pontosLutador1 > pontosLutador2) {
        mensagem = 'Aka venceu!';
    } else if (pontosLutador2 > pontosLutador1) {
        mensagem = 'Shiro venceu!';
    } else {
        if (primeiroPontuador === 'lutador1') {
            mensagem = 'Aka venceu por Senchu!';
        } else if (primeiroPontuador === 'lutador2') {
            mensagem = 'Shiro venceu por Senchu!';
        } else {
            mensagem = 'Empate sem pontos!';
        }
    }

    document.getElementById('mensagemVencedor').innerText = mensagem;
}

function resetarPontos() {
    document.getElementById('pontosLutador1').innerText = '0';
    document.getElementById('pontosLutador2').innerText = '0';
    document.getElementById('mensagemVencedor').innerText = '';
    tempoRestante = 120; 
    document.getElementById('cronometro').innerText = formatarTempo(tempoRestante);
    resetarFaltas();
}

function resetarFaltas() {
    faltasLutador1 = 0;
    faltasLutador2 = 0;
    document.getElementById('faltasLutador1').innerText = 0;
    document.getElementById('faltasLutador2').innerText = 0;
}

function resetarLutaCompleta() {
    if (intervaloCronometro) {
        clearInterval(intervaloCronometro);
        intervaloCronometro = null;
    }
    resetarPontos();
    lutaEmAndamento = false;
    document.getElementById('cronometro').innerText = '02:00';
    document.getElementById('mensagemVencedor').innerText = '';
    document.getElementById('botaoIniciarPausarLuta').innerText = 'Iniciar Luta';
    resetarFaltas();
    historicoAcoes = [];
    primeiroPontuador = null;

    document.getElementById('nomeLutador1').value = '';
    document.getElementById('dojoLutador1').value = '';
    document.getElementById('nomeLutador2').value = '';
    document.getElementById('dojoLutador2').value = '';

    document.getElementById('nomeDisplayLutador1').innerText = 'AKA';
    document.getElementById('dojoDisplayLutador1').innerText = '';
    document.getElementById('nomeDisplayLutador2').innerText = 'Shiro';
    document.getElementById('dojoDisplayLutador2').innerText = '';
}

function atualizarCronometro() {
    tempoRestante--;
    document.getElementById('cronometro').innerText = formatarTempo(tempoRestante);

    if (tempoRestante === 30) {
        document.getElementById('audio30Segundos').play();
        document.getElementById('cronometro').classList.add('piscar-vermelho');
    }

    if (tempoRestante <= 0) {
        document.getElementById('audioFimLuta').play();
        encerrarLuta();
        document.getElementById('cronometro').classList.remove('piscar-vermelho');
    }
}


function encerrarLuta() {
    clearInterval(intervaloCronometro);
    lutaEmAndamento = false;
    declararVencedor();
    document.getElementById('botaoIniciarPausarLuta').innerText = 'Iniciar Luta';
    document.getElementById('cronometro').classList.remove('piscar-vermelho'); 
}
