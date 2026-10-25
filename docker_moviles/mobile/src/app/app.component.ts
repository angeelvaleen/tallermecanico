import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  standalone: false,
})
export class AppComponent {
  constructor() {}
  links: { path: string; text: string }[] = [
    { path: "/colors/list", text: "Colores" },
    { path: "/brands/list", text: "Marcas" },
    { path: "/models/list", text: "Modelos" },
    { path: "/fuels/list", text: "Combustibles" },
    { path: "/parts/list", text: "Refacciones" },
    { path: "/services/list", text: "Servicios" },
    { path: "/vehicles/list", text: "Vehiculos" },
    { path: "/quotes/list", text: "Coutas" },
    { path: "/workorders/list", text: "Ordenes" },
    { path: "/appointments/list", text: "Citas" },
    { path: "/payment/list", text: "Pagos" },
    { path: "/methods/list", text: "Metodos de pago" },
    { path: "/diagnoses/list", text: "Diagnosticos" },



  ];
}
