import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-escalacao',
  templateUrl: './escalacao.page.html',
  styleUrls: ['./escalacao.page.scss'],
})
export class EscalacaoPage implements OnInit {

  @ViewChild('opcao2', { read: ElementRef }) el2!:ElementRef;
  
  @ViewChild('opcao1', { read: ElementRef }) el1!:ElementRef;
  
  constructor(private http: HttpClient) { }

  status = {};
  dataStatus = [];
  token = "1d05015f5c1fe8d822740a1bb678e0b2c674b636938664e6b774d384c6541554d4e644a417243495267436e48666d3049376a6678503233743879544371394a516a634251706378576d4747654d5772355f7265326c3875716277395437505938477369674a513d3d3a303a7061747269636b32335f636f7374612e32303135";
  usuario = {};
  usuarios_time = {};
  fotoPerfil;
  valorTime;
  cartoletasRestantes;
  esquemas = [];
  esquemaAtual;
  esquemaAtualId;
  el: any;

  ngOnInit() {
    this.carregarStatus();
    this.carregarUsuario();
  }

  carregarUsuario() {
    let headers = new HttpHeaders().append('X-GLB-Token', this.token);

    this.http.get('https://cors-anywhere.herokuapp.com/https://api.cartolafc.globo.com/auth/time', { headers }).subscribe(x => {
      console.log(x);
      this.usuario = x;
      this.esquemaAtualId = this.usuario['esquema_id'];
      this.usuarios_time = x['time'];
      this.fotoPerfil = x['time'].foto_perfil;
      this.valorTime = Math.round(this.usuario['valor_time'] * 100) / 100;
      this.cartoletasRestantes = Math.round((x['patrimonio'] - this.usuario['valor_time']) * 100) / 100;

      this.http.get('https://api.cartola.globo.com/esquemas').subscribe(e => {
        this.esquemas = Object.values(e);
        this.esquemas.filter(f => {
          if (f.esquema_id == this.usuario['esquema_id']) {
            this.esquemaAtual = f.nome;
          }
        });
      })
    });


  }

  carregarStatus() {
    this.http.get('https://api.cartola.globo.com/mercado/status').subscribe(x => {
      this.status = JSON.parse(JSON.stringify(x));
      this.dataStatus = Object.values(x['fechamento']);
    })
  }

  definirEsquema(esquema){
    this.esquemaAtual = esquema;
  }

  opcaoLista(){
    this.el2.nativeElement.classList.add('active');
    this.el1.nativeElement.classList.remove('active');
  }

  opcaoCampo(){
    this.el1.nativeElement.classList.add('active');
    this.el2.nativeElement.classList.remove('active');
  }

}
