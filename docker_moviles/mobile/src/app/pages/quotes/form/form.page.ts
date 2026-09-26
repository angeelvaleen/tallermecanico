import {
  Component,
  Input,
  OnInit,
} from "@angular/core";

import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

import {
  AlertController,
  ModalController,
} from "@ionic/angular";

import axios from "axios";

import { environment } from "src/environments/environment";

interface Workorder {
  id: number;
}

interface Service {
  id: number;
  name: string;
  price: number;
}

interface Part {
  id: number;
  name: string;
  price: number;
}

interface QuoteCreate {
  workorder_id: number;
  user_id: number;
  status_id: number;
  subtotal: number;
  tax: number;
  total: number;
  validity: string;
}

interface QuoteItemCreate {
  quote_id: number;
  service_id: number;
  price: number;
  discount: number;
  amount: number;
  is_approved: boolean;
}

interface QuotePartCreate {
  quote_id: number;
  part_id: number;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  is_approved: boolean;
}

@Component({
  selector: "app-quotes-form",
  templateUrl: "./form.page.html",
  styleUrls: ["./form.page.scss"],
  standalone: false,
})
export class FormPage implements OnInit {

  @Input() workorderId?: number;

  quoteForm!: FormGroup;

  saved: boolean = false;

  workorders: Workorder[] = [];

  services: Service[] = [];

  parts: Part[] = [];

  private readonly TAX_RATE = 0.16;

  validatorsMessage: Record<
    string,
    Record<string, string>
  > = {

    workorder_id: {
      required:
        "La orden de trabajo es requerida",
    },

    validity: {
      required:
        "La vigencia es requerida",
    },
  };

  constructor(
    private formBuilder: FormBuilder,

    private alertController: AlertController,

    private modalController: ModalController,
  ) {}

  ngOnInit() {

    this.createForm();

    this.loadData();
  }

  private createForm(): void {

    this.quoteForm =
      this.formBuilder.group({

        workorder_id: [
          "",
          [
            Validators.required,
          ],
        ],

        validity: [
          "",
          [
            Validators.required,
          ],
        ],

        items:
          this.formBuilder.array([]),

        parts:
          this.formBuilder.array([]),

        subtotal: [
          {
            value: 0,
            disabled: true,
          },
        ],

        tax: [
          {
            value: 0,
            disabled: true,
          },
        ],

        total: [
          {
            value: 0,
            disabled: true,
          },
        ],
      });

    if (
      this.workorderId !== undefined
    ) {

      const control =
        this.quoteForm.get(
          "workorder_id",
        );

      control?.setValue(
        this.workorderId,
      );

      control?.disable();
    }
  }

  get items(): FormArray {

    return this.quoteForm.get(
      "items",
    ) as FormArray;
  }

  get partsArray(): FormArray {

    return this.quoteForm.get(
      "parts",
    ) as FormArray;
  }

  private createItem(): FormGroup {

    return this.formBuilder.group({

      service_id: [
        "",
        [
          Validators.required,
        ],
      ],

      price: [
        {
          value: 0,
          disabled: true,
        },
      ],

      discount: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(
            "^[0-9]+(\\.[0-9]{1,2})?$",
          ),
        ],
      ],

      amount: [
        {
          value: 0,
          disabled: true,
        },
      ],
    });
  }

  private createPart(): FormGroup {

    return this.formBuilder.group({

      part_id: [
        "",
        [
          Validators.required,
        ],
      ],

      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.pattern(
            "^[1-9][0-9]*$",
          ),
        ],
      ],

      price: [
        {
          value: 0,
          disabled: true,
        },
      ],

      discount: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
          Validators.pattern(
            "^[0-9]+(\\.[0-9]{1,2})?$",
          ),
        ],
      ],

      amount: [
        {
          value: 0,
          disabled: true,
        },
      ],
    });
  }

  addService(): void {

    this.items.push(
      this.createItem(),
    );

    this.calculateTotals();
  }

  removeService(
    index: number,
  ): void {

    this.items.removeAt(index);

    this.calculateTotals();
  }

  addPart(): void {

    this.partsArray.push(
      this.createPart(),
    );

    this.calculateTotals();
  }

  removePart(
    index: number,
  ): void {

    this.partsArray.removeAt(index);

    this.calculateTotals();
  }

  onServiceChange(
    index: number,
  ): void {

    const item =
      this.items.at(
        index,
      ) as FormGroup;

    const serviceId =
      Number(
        item.get(
          "service_id",
        )?.value,
      );

    const service =
      this.services.find(
        (service) =>
          service.id === serviceId,
      );

    if (!service) {

      item.patchValue({
        price: 0,
        amount: 0,
      });

      this.calculateTotals();

      return;
    }

    item.patchValue({
      price: service.price,
    });

    this.calculateItemAmount(
      index,
    );
  }

  onPartChange(
    index: number,
  ): void {

    const item =
      this.partsArray.at(
        index,
      ) as FormGroup;

    const partId =
      Number(
        item.get(
          "part_id",
        )?.value,
      );

    const part =
      this.parts.find(
        (part) =>
          part.id === partId,
      );

    if (!part) {

      item.patchValue({
        price: 0,
        amount: 0,
      });

      this.calculateTotals();

      return;
    }

    item.patchValue({
      price: part.price,
    });

    this.calculatePartAmount(
      index,
    );
  }

  calculateItemAmount(
    index: number,
  ): void {

    const item =
      this.items.at(
        index,
      ) as FormGroup;

    const price =
      Number(
        item.get(
          "price",
        )?.value ?? 0,
      );

    const discount =
      Number(
        item.get(
          "discount",
        )?.value ?? 0,
      );

    const amount =
      this.calculateDiscount(
        price,
        discount,
      );

    item.patchValue(
      {
        amount:
          Number(
            amount.toFixed(2),
          ),
      },
      {
        emitEvent: false,
      },
    );

    this.calculateTotals();
  }

  calculatePartAmount(
    index: number,
  ): void {

    const item =
      this.partsArray.at(
        index,
      ) as FormGroup;

    const quantity =
      Number(
        item.get(
          "quantity",
        )?.value ?? 1,
      );

    const price =
      Number(
        item.get(
          "price",
        )?.value ?? 0,
      );

    const discount =
      Number(
        item.get(
          "discount",
        )?.value ?? 0,
      );

    const subtotal =
      price * quantity;

    const amount =
      this.calculateDiscount(
        subtotal,
        discount,
      );

    item.patchValue(
      {
        amount:
          Number(
            amount.toFixed(2),
          ),
      },
      {
        emitEvent: false,
      },
    );

    this.calculateTotals();
  }

  private calculateDiscount(
    amount: number,
    discount: number,
  ): number {

    return (
      amount -
      amount * (discount / 100)
    );
  }

  calculateTotals(): void {

    let subtotal = 0;

    for (
      const item of
      this.items.controls
    ) {

      subtotal += Number(
        item.get(
          "amount",
        )?.value ?? 0,
      );
    }

    for (
      const item of
      this.partsArray.controls
    ) {

      subtotal += Number(
        item.get(
          "amount",
        )?.value ?? 0,
      );
    }

    const tax =
      subtotal * this.TAX_RATE;

    const total =
      subtotal + tax;

    this.quoteForm.patchValue(
      {
        subtotal:
          Number(
            subtotal.toFixed(2),
          ),

        tax:
          Number(
            tax.toFixed(2),
          ),

        total:
          Number(
            total.toFixed(2),
          ),
      },
      {
        emitEvent: false,
      },
    );
  }

  getError(
    controlName: string,
  ): string {

    const control =
      this.quoteForm.get(
        controlName,
      );

    if (
      !control ||
      !control.errors ||
      !(
        control.touched ||
        control.dirty
      )
    ) {
      return "";
    }

    const typeError =
      Object.keys(
        control.errors,
      )[0];

    return (
      this.validatorsMessage[
        controlName
      ]?.[typeError] ??
      "El valor ingresado no es válido"
    );
  }

  getItemError(
    index: number,
    controlName: string,
  ): string {

    const control =
      this.items
        .at(index)
        ?.get(controlName);

    if (
      !control ||
      !control.errors ||
      !(
        control.touched ||
        control.dirty
      )
    ) {
      return "";
    }

    const typeError =
      Object.keys(
        control.errors,
      )[0];

    const messages: Record<
      string,
      string
    > = {

      required:
        "Este campo es requerido",

      min:
        "El valor debe ser mayor",

      max:
        "El descuento no puede superar 100%",

      pattern:
        "El valor ingresado no es válido",
    };

    return (
      messages[typeError] ??
      "El valor ingresado no es válido"
    );
  }

  getPartError(
    index: number,
    controlName: string,
  ): string {

    const control =
      this.partsArray
        .at(index)
        ?.get(controlName);

    if (
      !control ||
      !control.errors ||
      !(
        control.touched ||
        control.dirty
      )
    ) {
      return "";
    }

    const typeError =
      Object.keys(
        control.errors,
      )[0];

    const messages: Record<
      string,
      string
    > = {

      required:
        "Este campo es requerido",

      min:
        "El valor debe ser mayor",

      max:
        "El descuento no puede superar 100%",

      pattern:
        "El valor ingresado no es válido",
    };

    return (
      messages[typeError] ??
      "El valor ingresado no es válido"
    );
  }

  private async loadData(): Promise<void> {

    try {

      const requests: Promise<any>[] = [];

      if (
        this.workorderId === undefined
      ) {

        requests.push(
          axios.get<{
            data: Workorder[];
          }>(
            `${environment.apiUrl}/workorders`,
          ),
        );
      }

      requests.push(
        axios.get<{
          data: Service[];
        }>(
          `${environment.apiUrl}/services`,
        ),
      );

      requests.push(
        axios.get<{
          data: Part[];
        }>(
          `${environment.apiUrl}/parts`,
        ),
      );

      const responses =
        await Promise.all(
          requests,
        );

      let index = 0;

      if (
        this.workorderId === undefined
      ) {

        this.workorders =
          responses[
            index
          ].data.data;

        index++;
      }

      this.services =
        responses[
          index
        ].data.data;

      index++;

      this.parts =
        responses[
          index
        ].data.data;

    } catch (error) {

      console.log(
        "Error al cargar datos de la cotización",
        error,
      );

      const alert =
        await this.alertController.create({

          header: "Error",

          message:
            "No fue posible cargar las órdenes, servicios o refacciones.",

          buttons: [
            "Aceptar",
          ],
        });

      await alert.present();
    }
  }

  async closeModal(): Promise<void> {

    await this.modalController.dismiss({
      saved: false,
    });
  }

  async saveQuote(): Promise<void> {

    if (
      this.quoteForm.invalid
    ) {

      this.quoteForm
        .markAllAsTouched();

      for (
        const item of
        this.items.controls
      ) {
        item.markAllAsTouched();
      }

      for (
        const part of
        this.partsArray.controls
      ) {
        part.markAllAsTouched();
      }

      return;
    }

    this.saved = true;

    this.calculateTotals();

    const values =
      this.quoteForm
        .getRawValue();

    const quote:
      QuoteCreate = {

      workorder_id:
        Number(
          values.workorder_id,
        ),

      user_id: 1,

      status_id: 9,

      subtotal:
        Number(
          values.subtotal,
        ),

      tax:
        Number(
          values.tax,
        ),

      total:
        Number(
          values.total,
        ),

      validity:
        values.validity,
    };

    try {

      const quoteResponse =
        await axios.post<{
          data: {
            id: number;
          };
        }>(
          `${environment.apiUrl}/quotes`,
          quote,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

      const quoteId =
        quoteResponse.data.data.id;

      for (
        const item of values.items
      ) {

        const quoteItem:
          QuoteItemCreate = {

          quote_id:
            quoteId,

          service_id:
            Number(
              item.service_id,
            ),

          price:
            Number(
              item.price,
            ),

          discount:
            Number(
              item.discount,
            ),

          amount:
            Number(
              item.amount,
            ),

          is_approved:
            false,
        };

        await axios.post(
          `${environment.apiUrl}/quoteitems`,
          quoteItem,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );
      }

      for (
        const part of values.parts
      ) {

        const quotePart:
          QuotePartCreate = {

          quote_id:
            quoteId,

          part_id:
            Number(
              part.part_id,
            ),

          quantity:
            Number(
              part.quantity,
            ),

          price:
            Number(
              part.price,
            ),

          discount:
            Number(
              part.discount,
            ),

          amount:
            Number(
              part.amount,
            ),

          is_approved:
            false,
        };

        await axios.post(
          `${environment.apiUrl}/quoteparts`,
          quotePart,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );
      }

      const alert =
        await this.alertController.create({

          header:
            "Cotización guardada",

          message:
            "La cotización fue guardada exitosamente.",

          buttons: [
            "Aceptar",
          ],
        });

      await alert.present();

      await alert.onDidDismiss();

      await this.modalController.dismiss({
        saved: true,
      });

    } catch (error) {

      console.log(
        "Error al guardar la cotización",
        error,
      );

      const alert =
        await this.alertController.create({

          header: "Error",

          message:
            "No fue posible guardar la cotización. Revisar los datos, la conexión o los permisos de Directus.",

          buttons: [
            "Aceptar",
          ],
        });

      await alert.present();

    } finally {

      this.saved = false;
    }
  }
}