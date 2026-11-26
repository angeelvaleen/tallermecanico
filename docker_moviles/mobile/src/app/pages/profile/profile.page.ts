import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, ProfileUpdate, User } from 'src/app/services/auth/auth';

// ==========================================
// PERFIL DEL USUARIO AUTENTICADO
// - Todos los roles pueden abrir su perfil.
// - Muestra datos personales y rol.
// - Edita solo el perfil propio: nombre,
//   apellido, descripcion y fotografia.
// - Directus no permite actualizar
//   directus_users con estos roles, por eso
//   se usa el endpoint local
//   /vexora-profile/me, que toma el usuario
//   de la sesion y aplica una lista blanca
//   (no acepta rol, correo, contrasena ni
//   estado). Documentado en ESTADO_VEXORA.md.
// - Administrator accede a Gestion de Usuarios.
// ==========================================

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit, OnDestroy {

  profile: User | null = null;
  profileForm!: FormGroup;

  loading: boolean = true;
  saving: boolean = false;

  avatarUrl: string | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  private selectedFile: File | null = null;
  private removePhoto: boolean = false;
  private objectUrl: string | null = null;

  validationMessages: Record<string, Record<string, string>> = {
    first_name: {
      required: 'El nombre es obligatorio.',
      maxlength: 'El nombre no puede superar 50 caracteres.',
    },
    last_name: {
      maxlength: 'El apellido no puede superar 50 caracteres.',
    },
    description: {
      maxlength: 'La descripcion no puede superar 500 caracteres.',
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
  ) {}

  get isAdmin(): boolean {
    return this.auth.canByRole(['Administrator']);
  }

  // Subir o cambiar la foto exige crear archivos en Directus. El rol client
  // solo tiene lectura, asi que se oculta el selector y se conserva la
  // visualizacion y la opcion de quitar la foto.
  get canUploadPhoto(): boolean {
    return this.auth.can('directus_files', 'create');
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.profile = await this.auth.getProfile();

      this.createForm();
      await this.loadAvatar(this.profile.avatar ?? null);
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
      this.errorMessage = 'No se pudo cargar el perfil.';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.releaseObjectUrl();
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group({
      first_name: [
        this.profile?.first_name ?? '',
        [
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      last_name: [
        this.profile?.last_name ?? '',
        [
          Validators.maxLength(50),
        ],
      ],
      description: [
        this.profile?.description ?? '',
        [
          Validators.maxLength(500),
        ],
      ],
    });
  }

  getError(controlName: string): string {
    const control = this.profileForm.get(controlName);

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
      'Revisa este campo.'
    );
  }

  // Selecciona una fotografia local; se sube al guardar.
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    input.value = '';

    this.successMessage = '';

    if (!file) {
      return;
    }

    if (!AVATAR_TYPES.includes(file.type)) {
      this.errorMessage = 'Formato no permitido. Usa JPG, PNG o WEBP.';
      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      this.errorMessage = 'La imagen no puede superar 5 MB.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.selectedFile = file;
    this.removePhoto = false;
    this.releaseObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.avatarUrl = this.objectUrl;
  }

  // Quita la fotografia; se aplica al guardar.
  removeAvatar(): void {
    this.selectedFile = null;
    this.removePhoto = true;
    this.releaseObjectUrl();
    this.avatarUrl = null;
    this.successMessage = '';
  }

  async saveProfile(): Promise<void> {
    if (!this.profileForm || this.profileForm.invalid) {
      this.profileForm?.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const values = this.profileForm.getRawValue();

      const payload: ProfileUpdate = {
        first_name: values.first_name,
        last_name: values.last_name,
        description: values.description,
      };

      // El avatar solo se envia cuando el usuario lo cambia. Si un
      // administrador lo asigno, reenviarlo haria fallar el guardado
      // porque el archivo pertenece a otro usuario.
      if (this.selectedFile) {
        payload.avatar = await this.auth.uploadAvatar(this.selectedFile);
      } else if (this.removePhoto) {
        payload.avatar = null;
      }

      const updated = await this.auth.updateProfile(payload);

      this.profile = {
        ...this.profile!,
        ...updated,
      };

      this.selectedFile = null;
      this.removePhoto = false;

      await this.loadAvatar(this.profile.avatar ?? null);

      this.profileForm.markAsPristine();
      this.successMessage = 'Perfil actualizado correctamente.';
    } catch (error: any) {
      const message =
        error?.response?.data?.errors?.[0]?.message;

      this.errorMessage =
        message ?? 'No se pudo guardar el perfil. Intenta de nuevo.';

      console.error('Error al guardar el perfil:', error);
    } finally {
      this.saving = false;
    }
  }

  // Carga la fotografia actual como object URL autenticado.
  private async loadAvatar(fileId: string | null): Promise<void> {
    this.releaseObjectUrl();

    if (!fileId) {
      this.avatarUrl = null;
      return;
    }

    try {
      this.objectUrl = await this.auth.assetObjectUrl(fileId);
      this.avatarUrl = this.objectUrl;
    } catch (error) {
      console.error('Error al cargar la fotografia:', error);
      this.avatarUrl = null;
    }
  }

  private releaseObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }

}
