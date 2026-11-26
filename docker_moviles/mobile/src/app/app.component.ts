import { Component } from "@angular/core";

import { AuthService } from "./services/auth/auth";
import {
  ADMIN_CATALOG_LINKS,
  ADMIN_STANDALONE_LINKS,
} from "./constants/admin_menu";

// ==========================================
// MENÚ DESPLEGABLE EXCLUSIVO DEL ADMINISTRATOR
// Contiene únicamente: Catálogos, Diagnóstico,
// Evidencias. Las pestañas principales no se
// duplican aquí. Los permisos reales de
// Directus siguen protegiendo cada operación.
// ==========================================

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: false,
})
export class AppComponent {
  catalogLinks = ADMIN_CATALOG_LINKS;
  standaloneLinks = ADMIN_STANDALONE_LINKS;

  constructor(private auth: AuthService) {}

  // Solo Administrator ve el menú desplegable
  get isAdmin(): boolean {
    return this.auth.canByRole(["Administrator"]);
  }
}
