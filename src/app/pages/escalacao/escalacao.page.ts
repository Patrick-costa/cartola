import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-escalacao',
  templateUrl: './escalacao.page.html',
  styleUrls: ['./escalacao.page.scss'],
})
export class EscalacaoPage implements OnInit {

  @ViewChild('opcao2', { read: ElementRef }) el2!: ElementRef;
  @ViewChild('opcao1', { read: ElementRef }) el1!: ElementRef;
  @ViewChild('splash', { read: ElementRef }) splash!: ElementRef;
  @ViewChild('loader', { read: ElementRef }) loader!: ElementRef;
  constructor(private http: HttpClient, private modalController: ModalController) { }

  status = {};
  dataStatus: any;
  token = "1d05015f5c1fe8d822740a1bb678e0b2c674b636938664e6b774d384c6541554d4e644a417243495267436e48666d3049376a6678503233743879544371394a516a634251706378576d4747654d5772355f7265326c3875716277395437505938477369674a513d3d3a303a7061747269636b32335f636f7374612e32303135";
  usuario = {};
  valorTime;
  cartoletasRestantes;
  esquemas = [];
  esquemaAtual;
  esquemaAtualList = [];
  esquemaAtualId;
  gol = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  zag2 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  zag1 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  zag3 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  lat1 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  lat2 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  mei1 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  mei2 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  mei3 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  mei4 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  mei5 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  ata1 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  ata2 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  ata3 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  ata4 = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  tec = {'preco_num':"", 'apelido_abreviado': "", 'pontos_num': '', 'foto':''};
  modificaJogador = [];
  posicao = [
    {
      "id": 1,
      "nome": "Goleiro",
      "abreviacao": "gol"
    },
    {
      "id": 3,
      "nome": "Zagueiro",
      "abreviacao": "zag"
    },
    {
      "id": 2,
      "nome": "Lateral",
      "abreviacao": "lat"
    },
    {
      "id": 4,
      "nome": "Meia",
      "abreviacao": "mei"
    },
    {
      "id": 5,
      "nome": "Atacante",
      "abreviacao": "ata"
    },
    {
      "id": 6,
      "nome": "Técnico",
      "abreviacao": "tec"
    }
  ];
  status_dm = [
    {
      "id": 7,
      "nome": "Provável",
      "slug": "provavel"
    },
    {
      "id": 5,
      "nome": "Contudido",
      "slug": "contundido"
    },
    {
      "id": 2,
      "nome": "Dúvida",
      "slug": "duvida"
    },
    {
      "id": 3,
      "nome": "Suspenso",
      "slug": "suspenso"
    },
    {
      "id": 6,
      "nome": "Nulo",
      "slug": "nulo"
    }
  ];
  listaClubes = [];
  parciais = [];
  listaEscalados = [];
  atletas = [];
  time;
  listaJogadoresFicha = [];
  visualizarCampo: boolean = true;
  visualizarFicha: boolean = false;
  capitao;
  parcial = 0;

  teste = {
    "esquema": 3,
    "atletas": [
      81881,
      101727,
      68808,
      97908,
      89274,
      94583,
      108422,
      101728,
      88037,
      102878,
      98484,
      90285
    ],
    "capitao": 101728
  }

  ionViewDidEnter() {
    this.carregarClubes();
    this.carregarAtletas();
    this.carregarStatus();
  }
  ngOnInit() {
    this.carregarUsuario();
  }

  testeEnviar() {
    let headers = new HttpHeaders(
      {
        'X-GLB-Token': this.token,
      }
    );
    this.http.post('https://cors-anywhere.herokuapp.com/https://api.cartola.globo.com/auth/time/salvar', this.teste, { headers: headers }).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err.message);
      }
    )
  }

  carregarUsuario() {
    let headers = new HttpHeaders().append('X-GLB-Token', this.token);

    this.http.get('https://cors-anywhere.herokuapp.com/https://api.cartolafc.globo.com/auth/time', { headers }).subscribe(x => {
      this.usuario = x;
      console.log(x);
      this.esquemaAtualId = this.usuario['time'].esquema_id;
      this.capitao = this.usuario['capitao_id'];
      //Simplificar para 2 casas decimais
      this.valorTime = Math.round(this.usuario['valor_time'] * 100) / 100;
      this.cartoletasRestantes = Math.round((x['patrimonio'] - this.usuario['valor_time']) * 100) / 100;

      //Separar lista para POST de salvar escalação
      for (var i = 0; i < 12; i++) {
        this.listaEscalados[i] = this.usuario['atletas'][i].atleta_id;
      }

      setTimeout(() => {
        if (this.status['status_mercado'] == 2) {

          //Retorna os atletas pontuados e realiza filtragem com os atletas escalados pelo usuario
          this.http.get('https://api.cartola.globo.com/atletas/pontuados').subscribe(x => {
            const result = [x];
            result.filter(x => {
              for (var i = 0; i < 12; i++) {
                this.parciais[i] = [x['atletas'][this.listaEscalados[i]]];
                if (this.parciais[i][0] == undefined) {
                  this.parciais[i][0] = [{ 'apelido': '' }]
                }
              }
            });
          });
        }
      }, 1000);

      //Chamar esquemas de jogos e manipula-los
      this.http.get('https://api.cartola.globo.com/esquemas').subscribe(e => {
        this.esquemas = Object.values(e);
        this.esquemaAtualList = this.esquemas.filter(x => {
          return x.esquema_id == this.esquemaAtualId
        });
        this.esquemas.filter(f => {
          if (f.esquema_id == this.esquemaAtualId) {
            this.esquemaAtual = f.nome;
          }
        });
      })
    });



  }

  carregarAtletas() {
    setTimeout(() => {
      this.http.get('https://api.cartola.globo.com/atletas/mercado').subscribe(x => {
        this.atletas = [11];
        [x].filter(x => {
          const array = x['atletas']
          for (var i = 0; i < array.length; i++) {
            if (array[i].atleta_id == this.listaEscalados[0]) {
              this.atletas[0] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[1]) {
              this.atletas[1] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[2]) {
              this.atletas[2] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[3]) {
              this.atletas[3] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[4]) {
              this.atletas[4] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[5]) {
              this.atletas[5] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[6]) {
              this.atletas[6] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[7]) {
              this.atletas[7] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[8]) {
              this.atletas[8] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[9]) {
              this.atletas[9] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[10]) {
              this.atletas[10] = array[i]
            }
            if (array[i].atleta_id == this.listaEscalados[11]) {
              this.atletas[11] = array[i]
            }
          }
        });
      });

      setTimeout(() => {
        const array = this.atletas;
        this.time = [{
          'gol': array.filter(x => {
            for (var i = 0; i < 12; i++) {
              if (x.atleta_id == this.listaEscalados[i]) {
                return x.posicao_id == 1;
              }
            }
          }),
          'tec': array.filter(x => {
            for (var i = 0; i < 12; i++) {
              if (x.atleta_id == this.listaEscalados[i]) {
                return x.posicao_id == 6;
              }
            }
          })
        },
        {
          'zaga': array.filter(x => {
            for (var i = 0; i < 12; i++) {
              if (x.atleta_id == this.listaEscalados[i]) {
                return x.posicao_id == 3;
              }
            }
          }),
          'lateral': array.filter(x => {
            for (var i = 0; i < 12; i++) {
              if (x.atleta_id == this.listaEscalados[i]) {
                return x.posicao_id == 2;
              }
            }
          }),
        },
        {
          'meio': array.filter(x => {
            for (var i = 0; i < 12; i++) {
              if (x.atleta_id == this.listaEscalados[i]) {
                return x.posicao_id == 4;
              }
            }
          }),
        },
        {
          'ataque': array.filter(x => {
            for (var i = 0; i < 12; i++) {
              if (x.atleta_id == this.listaEscalados[i]) {
                return x.posicao_id == 5;
              }
            }
          }),
        },

        ];
        const gol = this.time[0].gol;
        const zag = [this.time[1].zaga];
        const lat = [this.time[1].lateral];
        const mei = [this.time[2].meio];
        const ata = [this.time[3].ataque];
        const tec = [this.time[0].tec];


        gol.forEach(x => {
          x.foto = x.foto.replace('FORMATO', '140x140');
          if (this.status['status_mercado'] == 2) {
            for (var i = 0; i < 12; i++) {
              if (x.apelido == this.parciais[i][0].apelido) {
                if (x.atleta_id == this.capitao) {
                  x.pontos_num = (this.parciais[i][0].pontuacao * 2).toFixed(2);
                } else {
                  x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                }
              }
              if (x.pontos_num == 0) {
                x.pontos_num = '-'
              }
            }
          }
        });
        zag.forEach(x => {
          x.forEach(x => {
            x.foto = x.foto.replace('FORMATO', '140x140');
            if (this.status['status_mercado'] == 2) {
              for (var i = 0; i < 12; i++) {
                if (x.apelido == this.parciais[i][0].apelido) {
                  if (this.capitao == x.atleta_id) {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                    x.pontos_num = x.pontos_num * 2;
                  } else {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                  }

                }
                if (x.pontos_num == 0) {
                  x.pontos_num = '-'
                }
              }
            }
          })
        });
        lat.forEach(x => {
          x.forEach(x => {
            x.foto = x.foto.replace('FORMATO', '140x140');
            if (this.status['status_mercado'] == 2) {
              for (var i = 0; i < 12; i++) {
                if (x.apelido == this.parciais[i][0].apelido) {
                  if (this.capitao == x.atleta_id) {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                    x.pontos_num = x.pontos_num * 2;
                  } else {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                  }

                }
                if (x.pontos_num == 0) {
                  x.pontos_num = '-'
                }
              }
            }
          })
        });
        mei.forEach(x => {
          x.forEach(x => {
            x.foto = x.foto.replace('FORMATO', '140x140');
            if (this.status['status_mercado'] == 2) {
              for (var i = 0; i < 12; i++) {
                if (x.apelido == this.parciais[i][0].apelido) {
                  if (this.capitao == x.atleta_id) {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                    x.pontos_num = x.pontos_num * 2;
                  } else {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                  }

                }
                if (x.pontos_num == 0) {
                  x.pontos_num = '-'
                }
              }
            }
          })
        });
        ata.forEach(x => {
          x.forEach(x => {
            x.foto = x.foto.replace('FORMATO', '140x140');
            if (this.status['status_mercado'] == 2) {
              for (var i = 0; i < 12; i++) {
                if (x.apelido == this.parciais[i][0].apelido) {
                  if (this.capitao == x.atleta_id) {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                    x.pontos_num = x.pontos_num * 2;
                  } else {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                  }

                }
                if (x.pontos_num == 0) {
                  x.pontos_num = '-'
                }
              }
            }
          })
        });
        tec.forEach(x => {
          x.forEach(x => {
            x.foto = x.foto.replace('FORMATO', '140x140');
            if (this.status['status_mercado'] == 2) {
              for (var i = 0; i < 12; i++) {
                if (x.apelido == this.parciais[i][0].apelido) {
                  if (this.capitao == x.atleta_id) {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                    x.pontos_num = x.pontos_num * 2;
                  } else {
                    x.pontos_num = (this.parciais[i][0].pontuacao).toFixed(2);
                  }

                }
                if (x.pontos_num == 0) {
                  x.pontos_num = '-'
                }
              }
            }
          })
        });

        // this.gol = this.time[0].gol;
        // this.tec = this.time[0].tec;
        // this.zag = this.time[1].zaga;
        // this.lat = this.time[1].lateral;
        // this.mei = this.time[2].meio;
        // this.ata = this.time[3].ataque;

        if (this.esquemaAtualId == 3) {
          this.gol = this.time[0].gol[0];
          this.zag1 = this.time[1].zaga[0];
          this.zag2 = this.time[1].zaga[1];
          this.lat1 = this.time[1].lateral[0];
          this.lat2 = this.time[1].lateral[1];
          this.mei1 = this.time[2].meio[0];
          this.mei2 = this.time[2].meio[1];
          this.mei3 = this.time[2].meio[2];
          this.ata1 = this.time[3].ataque[0];
          this.ata2 = this.time[3].ataque[1];
          this.ata3 = this.time[3].ataque[2];
          this.tec = this.time[0].tec[0];
          this.listaJogadoresFicha = [this.gol, this.zag1, this.zag2, this.lat1, this.lat2, this.mei1, this.mei2, this.mei3, this.ata1, this.ata2, this.ata3, this.tec];
          for (var i = 0; i < this.listaJogadoresFicha.length; i++) {
            this.listaJogadoresFicha[i].clube_lista = this.listaClubes.filter(result => {
              return result['id'] == this.listaJogadoresFicha[i].clube_id;
            });
            this.listaJogadoresFicha[i].posicao_lista = this.posicao.filter(result => {
              return result['id'] == this.listaJogadoresFicha[i].posicao_id;
            })
            this.listaJogadoresFicha[i].status_lista = this.status_dm.filter(result => {
              return result['id'] == this.listaJogadoresFicha[i].status_id;
            })
          }
          console.log(this.listaJogadoresFicha);
        }


        this.parcial = 0;
        for(var i = 0; i < this.listaJogadoresFicha.length; i++){
          if(this.listaJogadoresFicha[i].pontos_num != "-"){
            this.listaJogadoresFicha[i].pontos_num == parseFloat(this.listaJogadoresFicha[i].pontos_num);
            this.parcial += parseFloat(this.listaJogadoresFicha[i].pontos_num);
          }
        }
        this.parcial = Math.round(this.parcial * 100)/100;
      }, 100);
      setTimeout(() => {        
        this.splash.nativeElement.classList.add('desabilitar-splash');
      }, 500);
    }, 3500);
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

  definirEsquema(esquema) {
    this.esquemaAtual = esquema;
  }

  //Alterar visualização para lista
  opcaoLista() {
    this.el2.nativeElement.classList.add('active');
    this.el1.nativeElement.classList.remove('active');
    this.visualizarCampo = false;
    this.visualizarFicha = true;
  }

  //Alterar visualização para campo
  opcaoCampo() {
    this.el1.nativeElement.classList.add('active');
    this.el2.nativeElement.classList.remove('active');
    this.visualizarCampo = true;
    this.visualizarFicha = false;
  }

  //Função do modal para vender ou tornar capitão
  modificarJogador(obj) {
    this.modificaJogador = [obj];
    console.log(this.modificaJogador);

    for (var i = 0; i < this.modificaJogador.length; i++) {
      this.modificaJogador[i].clube_lista = this.listaClubes.filter(result => {
        return result['id'] == this.modificaJogador[i].clube_id;
      });
      this.modificaJogador[i].posicao_lista = this.posicao.filter(result => {
        return result['id'] == this.modificaJogador[i].posicao_id;
      })
      this.modificaJogador[i].status_lista = this.status_dm.filter(result => {
        return result['id'] == this.modificaJogador[i].status_id;
      })
    }
  }

  carregarClubes() {
    this.http.get('https://cors-anywhere.herokuapp.com/https://api.cartolafc.globo.com/clubes').subscribe(x => {
      this.listaClubes = Object.values(x);
      // console.log(this.listaClubes);
    })
  }

  fecharModal() {
    this.modificaJogador = [];
  }

  venderJogador(id) {
    for (var i = 0; i < 12; i++) {
      if (this.listaEscalados[i] == id) {
        this.listaEscalados[i] = '';
        console.log(this.listaEscalados);
        this.carregarAtletas();
        this.fecharModal();
      }
    }

  }


}

