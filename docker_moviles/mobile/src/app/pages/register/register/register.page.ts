import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone:false,
})
export class RegisterPage implements OnInit {
  form: FormGroup;
  enviando = false;
  mensaje = '';

  constructor(fb: FormBuilder, private auth: AuthService) {
    this.form = fb.group({ nombre: ['', Validators.required], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] });
  }

  ngOnInit() {
  }

  async registrar(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando = true;
    this.mensaje = '';
    try {
      await this.auth.registrar(this.form.value.email, this.form.value.password, this.form.value.nombre);
      this.mensaje = 'Solicitud recibida. Revisa tu correo para completar el registro si se solicita verificación.';
      this.form.reset();
    } catch { this.mensaje = 'No fue posible completar el registro. Revisa los datos y la configuración de registro de Directus.'; }
    finally { this.enviando = false; }
  }

}
