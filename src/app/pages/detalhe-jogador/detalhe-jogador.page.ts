import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from "chartjs-plugin-annotation";

@Component({
  selector: 'app-detalhe-jogador',
  templateUrl: './detalhe-jogador.page.html',
  styleUrls: ['./detalhe-jogador.page.scss'],
})
export class DetalheJogadorPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  @ViewChild("grafico", { static: true })
  grafico!: ElementRef;
  @ViewChild('splash', { read: ElementRef }) splash!: ElementRef;

  id;
  atleta = [];
  atletaCompleto = [];
  clube;
  resultado;
  confrontos = [];
  confronto;
  posicao;
  rodada;
  parcial;
  valorScout;
  statusMercado;
  arrayScout = [];
  valorTotalScout = 0.0;
  historicoParcial;
  rodadaPontuada;
  teste;
  pontosHistorico = [];
  rodadaHistorico = [];
  coresPontos = [];

  ionViewDidEnter() {
    this.id = this.activatedRoute.snapshot.params['id'];
    console.log(this.id);
    this.carregarAtleta();
    this.carregarStatus();
    this.carregarScoutTotal();
    this.carregarHistoricoParcial();
    this.carregarRodadas();
  }
  ngOnInit(): void {
    setTimeout(() => {
      // '#ff0320'
      // Register the plugin to all charts:
      Chart.register(ChartDataLabels);
      Chart.register(annotationPlugin);
      new Chart(
        this.grafico.nativeElement,
        {
          type: 'bar',
          data: {
            labels: this.rodadaHistorico,
            datasets: [
              {
                backgroundColor: this.coresPontos,
                data: this.pontosHistorico,
                borderRadius: 2,
                datalabels: {
                  anchor: 'end',
                  align: 'top',
                }
              },

            ]
          },
          options: {
            layout: {
              padding: {
                top: 20,
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              datalabels: {
                font: {
                  size: 10,
                  weight: 400,
                  family: 'Roboto',
                }
              }
            },
            scales: {
              yAxes: {
                display: false, // Hide Y axis labels
                beginAtZero: true,
                grid: {
                  drawBorder: false,
                  drawOnChartArea: false
                },

              },
              xAxes: {
                display: false,
                grid: {
                  drawBorder: false,
                  drawOnChartArea: false,

                },
              },
              x: {
                stacked: true,
                ticks: {
                  font: {
                    size: 11
                  }
                },
                grid: {
                  display: false,
                },
              }
            }
          }
        },
      );
    }, 1000);
  }

  carregarAtleta() {
    this.http.get('https://api.cartola.globo.com/atletas/mercado').subscribe(x => {
      this.atleta = x['atletas'];
      this.atleta = this.atleta.filter(y => {
        y.posicao_lista = [{ 'abreviacao': '' }];
        return y.atleta_id == this.id;
      });
      this.atleta[0].foto = this.atleta[0].foto.replace('FORMATO', '140x140')
      this.clube = Object.values(x['clubes']);
      this.clube = this.clube.filter(c => {
        return c.id == this.atleta[0].clube_id
      });
      this.http.get('https://api.cartola.globo.com/posicoes').subscribe(p => {
        let array = Object.values(p);
        this.posicao = array.filter(m => {
          return m.id == this.atleta[0].posicao_id;
        });
        this.atleta[0].posicao_lista = this.posicao;
      })
      setTimeout(() => {
        if (this.statusMercado == 2) {
          this.http.get('https://api.cartola.globo.com/atletas/pontuados').subscribe(t => {
            let array = Object.values(t['atletas'])
            this.parcial = array.filter(x => {
              return x['apelido'] == this.atleta[0].apelido;
            });
            this.atleta[0].parcial = this.parcial[0].pontuacao.toFixed(2);
            let arrayScout = [this.parcial[0].scout]
            this.valorScout = arrayScout;
            console.log(this.valorScout)

          })
        }
      }, 500);
      this.valorScout = this.atleta[0].scout;

      let chave = Object.keys(this.valorScout);
      let valor = Object.values(this.valorScout);
      let nome = [];
      let valorPonto = [];

      for (var i = 0; i < 15; i++) {
        if (chave[i] == 'G') {
          nome[i] = 'Gols'
          valorPonto[i] = 8.00;
        } else if (chave[i] == 'A') {
          nome[i] = 'Assistencia';
          valorPonto[i] = 5.00;
        } else if (chave[i] == 'FT') {
          nome[i] = 'Finalização na trave';
          valorPonto[i] = 3.00;
        } else if (chave[i] == 'FD') {
          nome[i] = 'Finalização defendida';
          valorPonto[i] = 1.20;
        } else if (chave[i] == 'PS') {
          nome[i] = 'Penalti sofrido';
          valorPonto[i] = 1.00;
        } else if (chave[i] == 'DS') {
          nome[i] = 'Desarme';
          valorPonto[i] = 1.20;
        } else if (chave[i] == 'FF') {
          nome[i] = 'Finalizações para fora';
          valorPonto[i] = 0.80;
        } else if (chave[i] == 'FS') {
          nome[i] = 'Faltas sofridas';
          valorPonto[i] = 0.50;
        } else if (chave[i] == 'CA') {
          nome[i] = 'Cartão amarelo';
          valorPonto[i] = -1.00;
        } else if (chave[i] == 'CV') {
          nome[i] = 'Cartão vermelho';
          valorPonto[i] = -3.00;
        } else if (chave[i] == 'FC') {
          nome[i] = 'Faltas cometidas';
          valorPonto[i] = -0.30;
        } else if (chave[i] == 'I') {
          nome[i] = 'Impedimentos';
          valorPonto[i] = -0.10;
        } else if (chave[i] == 'PI') {
          nome[i] = 'Passes incompletos';
          valorPonto[i] = -0.10;
        } else if (chave[i] == 'SG') {
          nome[i] = 'Jogo sem sofrer gol';
          valorPonto[i] = 5.00;
        } else if (chave[i] == 'DE') {
          nome[i] = 'Defesas';
          valorPonto[i] = 1.00;
        } else if (chave[i] == 'GS') {
          nome[i] = 'Gols sofridos';
          valorPonto[i] = -1.00;
        } else if (chave[i] == 'PP') {
          nome[i] = 'Pênalti perdido';
          valorPonto[i] = -4.00;
        }

        this.arrayScout[i] = {
          'abreviacao': chave[i],
          'quantidade': valor[i],
          'nome': nome[i],
          'valor': valorPonto[i] * Number(valor[i])
        }
        this.arrayScout[i].valor = (Number(this.arrayScout[i].valor)).toFixed(2);

      }
      this.arrayScout = this.arrayScout.filter(x => {
        return x.abreviacao != undefined;
      })
      console.log(this.arrayScout)
      this.carregarJogos();

      setTimeout(() => {
        this.confronto = this.confrontos.filter(f => {
          return f.time_casa[0].id == this.clube[0].id || f.time_visitante[0].id == this.clube[0].id;
        });
      }, 1000);

      this.atleta[0].clube = this.clube;
      console.log(this.atleta)
    })
    setTimeout(() => {        
      this.splash.nativeElement.classList.add('desabilitar-splash');
    }, 2500);
  }

  async carregarStatus() {
    this.http.get('https://api.cartola.globo.com/mercado/status').subscribe(x => {
      console.log(x);
      this.statusMercado = x['status_mercado'];
      this.rodada = x['rodada_atual'];
    })
  }


  async carregarJogos() {
    setTimeout(() => {
      this.http.get('https://api.cartola.globo.com/partidas/' + this.rodada).subscribe(x => {
        this.resultado = Object.values(x);

        let clubes = Object.values(this.resultado[0]);
        let partidas = Object.values(this.resultado[1]);

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



      })
    }, 500);

  }

  async carregarHistoricoParcial() {
    this.http.get('https://api.cartola.globo.com/auth/mercado/atleta/' + this.id + '/pontuacao').subscribe(x => {
      this.historicoParcial = x;
      console.log(this.historicoParcial)
      this.historicoParcial = this.historicoParcial.filter(x => {
        return x.pontos != null;
      })
      for (var i = 0; i < this.historicoParcial.length; i++) {
        if (this.historicoParcial[i].pontos >= 0) {
          this.coresPontos[i] = '#26ca5e'
        } else {
          this.coresPontos[i] = '#ff0320'
        }
        this.pontosHistorico[i] =
          Number(this.historicoParcial[i].pontos).toFixed(2)
      }

      this.pontosHistorico = Object.values(this.pontosHistorico);
    });

  }

  async carregarRodadas() {
    this.http.get('https://api.cartola.globo.com/rodadas').subscribe(x => {
      let array = Object.values(x);
      for (var i = 0; i < array.length; i++) {
        this.rodadaHistorico[i] = '#' + array[i].rodada_id;
      }
    })

  }

  async carregarScoutTotal() {
    setTimeout(() => {
      for (var i = 0; i < this.arrayScout.length; i++) {

        this.valorTotalScout += parseFloat(this.arrayScout[i].valor);
      }

    }, 3000);
  }
}
