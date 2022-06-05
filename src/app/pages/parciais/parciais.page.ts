import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-parciais',
  templateUrl: './parciais.page.html',
  styleUrls: ['./parciais.page.scss'],
})
export class ParciaisPage implements OnInit {

  constructor(private http: HttpClient) { }
  
  parciais = [];
  tecla: KeyboardEvent;
  @HostListener('document:keydown', ['$event'])
  
  ngOnInit() {
   
  }

  ionViewWillEnter(){
    this.carregarParciais();
  }

  carregarParciais(){
     //Retorna os atletas pontuados e realiza filtragem com os atletas escalados pelo usuario
     this.http.get('https://api.cartola.globo.com/atletas/pontuados').subscribe(x => {
      const result = [x];
      const clubes = Object.values(result[0]['clubes']);
      const posicoes = Object.values(result[0]['posicoes']);
      this.parciais = Object.values(result[0]['atletas']);
      for (var i = 0; i < this.parciais.length; i++) {
        this.parciais[i].clube_lista = clubes.filter(result => {
          return result['id'] == this.parciais[i].clube_id;
        });
        this.parciais[i].posicao_lista = posicoes.filter(result => {
          return result['id'] == this.parciais[i].posicao_id;
        })
      }
      this.parciais = this.parciais.sort((a,b) => {
        if(b.pontuacao < a.pontuacao){
          return -1
        } else {
          return 1;
        }
      });
      this.parciais.forEach(x => {
        x.foto = x.foto.replace('FORMATO','140x140');
      })
      console.log(this.parciais);
    });
  }

  filtrarParciais(evt: any){
    const resultado = evt.srcElement.value;
    this.http.get('https://api.cartola.globo.com/atletas/pontuados').subscribe(x => {
      const result = [x];
      const clubes = Object.values(result[0]['clubes']);
      const posicoes = Object.values(result[0]['posicoes']);
      this.parciais = Object.values(result[0]['atletas']);
      for (var i = 0; i < this.parciais.length; i++) {
        this.parciais[i].clube_lista = clubes.filter(result => {
          return result['id'] == this.parciais[i].clube_id;
        });
        this.parciais[i].posicao_lista = posicoes.filter(result => {
          return result['id'] == this.parciais[i].posicao_id;
        })
      }
      this.parciais = this.parciais.sort((a,b) => {
        if(b.pontuacao < a.pontuacao){
          return -1
        } else {
          return 1;
        }
      });
      this.parciais.forEach(x => {
        x.foto = x.foto.replace('FORMATO','140x140');
      })
      this.parciais = this.parciais.filter(x => {
        return (x['apelido'].toLocaleLowerCase().indexOf(resultado.toLowerCase()) > -1);
      })
    });
  }
}
