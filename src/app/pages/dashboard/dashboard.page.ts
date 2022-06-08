import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private http: HttpClient) { }
  
  @ViewChild('splash', { read: ElementRef }) splash!: ElementRef;
  @ViewChild('loader', { read: ElementRef }) loader!: ElementRef;
  time: any;
  resultado = [];
  confrontos = [];
  status = {};
  dataStatus: any;
  token = "1d05015f5c1fe8d822740a1bb678e0b2c674b636938664e6b774d384c6541554d4e644a417243495267436e48666d3049376a6678503233743879544371394a516a634251706378576d4747654d5772355f7265326c3875716277395437505938477369674a513d3d3a303a7061747269636b32335f636f7374612e32303135";
  usuario = {};
  usuarios_time = {};
  fotoPerfil;
  valorTime;
  cartoletasRestantes;
  destaques = [];
  destaquesReservas = [];
  mostrarTodosTitulares: boolean;
  mostrarTodosReservas: boolean;
  parciais = [];
  listaEscalados = [];
  pontuacao = 0;
  jogadoresPontuados = 0;
  capitao;
  patrimonio;
  ultPontuacao;

  ngOnInit() {
    this.carregarTime();
    this.carregarJogos();
    this.carregarStatus();
    this.carregarUsuario();
    this.carregarTitulares();
    this.carregarReservas();
  }

  carregarUsuario() {
    let headers = new HttpHeaders().append('X-GLB-Token', this.token);

    this.http.get('https://cors-anywhere.herokuapp.com/https://api.cartolafc.globo.com/auth/time', { headers }).subscribe(x => {
      console.log(x);
      this.usuario = x;
      this.capitao = this.usuario['capitao_id'];
      this.patrimonio = this.usuario['patrimonio'];
      this.usuario['pontos'] = Math.round((this.usuario['pontos']) * 1000)/1000;
      this.usuario['pontos_campeonato'] = Math.round((this.usuario['pontos_campeonato']) *100)/100;
      this.ultPontuacao = this.usuario['pontos'];
      this.usuarios_time = x['time'];
      this.fotoPerfil = x['time'].foto_perfil;
      this.valorTime = Math.round(this.usuario['valor_time'] * 100) / 100;
      this.cartoletasRestantes = Math.round((x['patrimonio'] - this.usuario['valor_time']) * 100) / 100;

      //Separar lista para POST de salvar escalação
      for (var i = 0; i < 12; i++) {
        this.listaEscalados[i] = this.usuario['atletas'][i].atleta_id;
      }
      console.log(this.listaEscalados)
      
      setTimeout(() => {      
        if(this.status['status_mercado'] == 2){
          //Retorna os atletas pontuados e realiza filtragem com os atletas escalados pelo usuario
          this.http.get('https://api.cartola.globo.com/atletas/pontuados').subscribe(x => {
            const result = [x];
            result.filter(x => {
              for (var i = 0; i < 12; i++) {
                this.parciais[i] = [x['atletas'][this.listaEscalados[i]]];
                if (this.parciais[i][0] == undefined) {
                  this.parciais[i][0] = { 'apelido': '','pontuacao':0};
                }
              }
            });
            console.log(this.parciais);
          });
        }
      }, 500);
    })

    setTimeout(() => {
      if(this.status['status_mercado'] == 2){
      for(var i = 0; i < 12; i++){
        this.pontuacao += (this.parciais[i][0].pontuacao); 
        this.pontuacao = Math.round(this.pontuacao * 100)/100
        console.log(this.pontuacao)
      }
      let array = [];
      array = this.parciais.filter(x => {
        return x[0].apelido != '' && x[0];
      });
      console.log(array)
      this.jogadoresPontuados = array.length;
    }
    setTimeout(() => {        
      this.splash.nativeElement.classList.add('desabilitar-splash');
    }, 500);
    }, 3500);
  }

  carregarTitulares() {
    this.http.get('https://api.cartola.globo.com/mercado/destaques').subscribe(x => {
      this.destaques = Object.values(x);
      this.destaques = this.destaques.slice(0, 5);

      this.destaques.forEach(y => {
        y.Atleta.foto = y.Atleta.foto.replace('FORMATO', '140x140');
        y.escalacoes = (y.escalacoes).toLocaleString("pt-BR", { minimumFractionDigits: 2}).replace(/,00$/, '');
      })

      this.mostrarTodosTitulares = false;

    })

  }

  carregarReservas() {
    this.http.get('https://api.cartola.globo.com/mercado/destaques/reservas').subscribe(x => {
      this.destaquesReservas = Object.values(x);
      this.destaquesReservas = this.destaquesReservas.slice(0, 5);

      this.destaquesReservas.forEach(y => {
        y.Atleta.foto = y.Atleta.foto.replace('FORMATO', '140x140');
        y.escalacoes = (y.escalacoes).toLocaleString("pt-BR", { minimumFractionDigits: 2}).replace(/,00$/, '');
      });
      this.mostrarTodosReservas = false;
      console.log(this.destaquesReservas);
    })
  }

  carregarTodosTitulares() {
    this.http.get('https://api.cartola.globo.com/mercado/destaques').subscribe(x => {
      this.destaques = Object.values(x);

      this.destaques.forEach(y => {
        y.Atleta.foto = y.Atleta.foto.replace('FORMATO', '140x140');
        y.escalacoes = (y.escalacoes).toLocaleString("pt-BR", { minimumFractionDigits: 2}).replace(/,00$/, '');
      });

    });

    this.mostrarTodosTitulares = true;
  }

  carregarTodosReservas() {
    this.http.get('https://api.cartola.globo.com/mercado/destaques').subscribe(x => {
      this.destaquesReservas = Object.values(x);

      this.destaquesReservas.forEach(y => {
        y.Atleta.foto = y.Atleta.foto.replace('FORMATO', '140x140');
        y.escalacoes = (y.escalacoes).toLocaleString("pt-BR", { minimumFractionDigits: 2}).replace(/,00$/, '');
      });

    })

    this.mostrarTodosReservas = true;
  }

  carregarStatus() {
    this.http.get('https://api.cartola.globo.com/mercado/status').subscribe(x => {
      this.status = JSON.parse(JSON.stringify(x));
      let timestamp = x['fechamento']['timestamp'];
      var date = new Date(timestamp*1000).toLocaleDateString("pt-BR").replace('/2022','');
      var hora = new Date(timestamp*1000).getHours()+":"+new Date(timestamp*1000).getMinutes();
      this.dataStatus = date+' - '+hora;
      console.log(this.status)
      console.log(this.dataStatus);
    })
  }

  carregarTime() {
    this.http.get('https://api.cartola.globo.com/times?q=manchester%20capote').subscribe(x => {
      this.time = x;

    })
  }

  carregarJogos() {
    this.http.get('https://api.cartola.globo.com/partidas').subscribe(x => {
      this.resultado = Object.values(x);

      let clubes = Object.values(this.resultado[0]);
      let partidas = Object.values(this.resultado[1]);
      console.log(partidas);
      for (var i = 0; i < 10; i++) {

        this.confrontos[i] = {
          "time_casa": clubes.filter(x => {
            if (x['id'] == partidas[i]['clube_casa_id']) {
              return x['nome'];
            }
          }),
          "time_visitante": clubes.filter(x => {
            if (x['id'] == partidas[i]['clube_visitante_id']) {
              return x['nome'];
            }
          }),
          "historico_casa": partidas[i]['aproveitamento_mandante'],
          "historico_visitante": partidas[i]['aproveitamento_visitante'],
          "local": partidas[i]['local'],
          "placar_mandante": partidas[i]['placar_oficial_mandante'],
          "placar_visitante": partidas[i]['placar_oficial_visitante'],
          "data": partidas[i]['partida_data'],
          "status": partidas[i]['status_transmissao_tr'],
          "validade": partidas[i]['valida'],
          "transmissao": partidas[i]['transmissao'],
        }
      }

      console.log(this.confrontos);



    })
  }
}
