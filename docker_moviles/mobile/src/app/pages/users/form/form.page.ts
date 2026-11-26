import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

import {
  AuthService,
  DirectusRole,
  User,
} from 'src/app/services/auth/auth';

// ==========================================
// CREAR / EDITAR USUARIO (solo Administrator)
// - Asignación de rol.
// - Contraseña obligatoria solo en creación.
// - Anti-duplicados: pre-chequeo de correo y
//   mensaje claro con el error de Directus.
// ==========================================

@Component({
  selector: 'app-users-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
  standalone: false,
})
export class FormPage implements OnInit {

  userForm!: FormGroup;

  roles: DirectusRole[] = [];
  userId?: string;
  isEdition: boolean = false;

  saving: boolean = false;
  loading: boolean = false;

  validationMessages: Record<string, Record<string, string>> = {
    email: {
      required: 'El correo es obligatorio.',
      email: 'Ingresa un correo válido.',
    },
    first_name: {
      required: 'El nombre es obligatorio.',
    },
    last_name: {
      required: 'El apellido es obligatorio.',
    },
    role: {
      required: 'Selecciona un rol.',
    },
    password: {
      required: 'La contraseña es obligatoria.',
      minlength: 'La contraseña debe tener al menos 8 caracteres.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    // La página puede ser reutilizada por Ionic al navegar de nuevo
    // a users/form: reaccionar a cambios de ?id=... (crear/editar)
    this.route.queryParamMap.subscribe(params => {
      this.applyParams(params.get('id') ?? undefined);
    });
  }

  private async applyParams(id?: string): Promise<void> {
    const changed = id !== this.userId;

    this.isEdition = !!id;
    this.userId = id;

    if (changed || !this.userForm) {
      this.createForm();
      await this.loadRoles();

      if (this.userId) {
        await this.loadUser(this.userId);
      }
    }
  }

  private createForm(): void {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      status: ['active', [Validators.required]],
      password: [
        '',
        this.isEdition
          ? []
          : [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  getError(controlName: string): string {
    const control = this.userForm.get(controlName);

    if (
      !control ||
      !control.errors ||
      !(control.touched || control.dirty)
    ) {
      return '';
    }

    const errorType = Object.keys(control.errors)[0];

    return (
      this.validationMessages[controlName]?.[errorType] ??
      'El valor ingresado no es válido.'
    );
  }

  async saveUser(): Promise<void> {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.saving = true;

    const values = this.userForm.value;

    try {
      if (this.isEdition && this.userId) {
        const payload: Record<string, unknown> = {
          email: String(values.email).trim(),
          first_name: String(values.first_name).trim(),
          last_name: String(values.last_name).trim(),
          role: values.role,
          status: values.status,
        };

        const password = String(values.password ?? '').trim();

        if (password) {
          payload['password'] = password;
        }

        await this.auth.updateUser(this.userId, payload);

        await this.showAlert(
          'Usuario actualizado',
          'El usuario fue actualizado correctamente.'
        );
      } else {
        // Pre-chequeo de duplicados por correo
        const duplicates = await this.findDuplicateEmail(
          String(values.email).trim()
        );

        if (duplicates) {
          await this.showAlert(
            'Usuario duplicado',
            'Ya existe un usuario registrado con ese correo. Usa otro correo o edita el usuario existente.'
          );
          return;
        }

        await this.auth.createUser({
          email: String(values.email).trim(),
          password: String(values.password),
          first_name: String(values.first_name).trim(),
          last_name: String(values.last_name).trim(),
          role: values.role,
          status: values.status,
        });

        await this.showAlert(
          'Usuario creado',
          'El usuario fue registrado correctamente.'
        );
      }

      this.router.navigateByUrl('/users/list');
    } catch (error) {
      console.error('Error al guardar el usuario:', error);

      await this.showAlert(
        'Error',
        this.describeError(error)
      );
    } finally {
      this.saving = false;
    }
  }

  private async findDuplicateEmail(email: string): Promise<boolean> {
    try {
      const users = await firstValueFrom(this.auth.listUsers());
      return users.some(
        user => user.email.toLowerCase() === email.toLowerCase()
      );
    } catch {
      // Sin pre-chequeo no bloqueamos el guardado: Directus valida igual
      return false;
    }
  }

  private describeError(error: unknown): string {
    const axiosError = error as {
      response?: { data?: { errors?: { message?: string }[] } };
    };

    const serverMessage =
      axiosError?.response?.data?.errors?.[0]?.message;

    if (serverMessage) {
      return `No fue posible guardar el usuario: ${serverMessage}`;
    }

    return 'No fue posible guardar el usuario. Revisa los datos, la conexión y los permisos de Directus.';
  }

  private async loadRoles(): Promise<void> {
    try {
      this.roles = await firstValueFrom(this.auth.listRoles());
    } catch (error) {
      console.error('Error al cargar los roles:', error);
    }
  }

  private async loadUser(id: string): Promise<void> {
    this.loading = true;

    try {
      const user: User = await firstValueFrom(this.auth.getUser(id));

      this.userForm.patchValue({
        email: user.email,
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        role: user.role?.id ?? '',
        status: user.status ?? 'active',
      });
    } catch (error) {
      console.error('Error al cargar el usuario:', error);

      await this.showAlert(
        'Error',
        'No fue posible cargar los datos del usuario. Revisa la conexión y los permisos de Directus.'
      );
    } finally {
      this.loading = false;
    }
  }

  private async showAlert(
    header: string,
    message: string
  ): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['Aceptar'],
    });

    await alert.present();
    await alert.onDidDismiss();
  }

}
