import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { EvidenceServices, Evidence } from 'src/app/services/evidences/evidences';


@Component({
  selector: 'app-evidences-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: false,
})
export class DetailPage implements OnInit {
  evidence: Evidence | null = null;
  messageError: string = "";

  constructor(
    private route: ActivatedRoute,
    private loading: LoadingController,
    private evidenceServices: EvidenceServices,
  ) {}

  ngOnInit() {
    this.chargerEvidence();
  }

  async chargerEvidence(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if(!id){
      this.messageError="No se proporciono ID";
      return;
    }

    const loading = await this.loading.create({
        message:'Cargando evidencia...',
        spinner:'bubbles',
    });

    await loading.present();
    
    try {
      this.evidence = await firstValueFrom(this.evidenceServices.detail(Number(id)));
    } catch (error) {
      console.log('Error al cargar detalle de evidencia', error);
      this.messageError= "No se pudo cargar el producto. Revisa el ID, la conexión y los permisos de lectura.";
    }finally{
      await loading.dismiss();
    }
  }
}