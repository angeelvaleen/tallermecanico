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


import { firstValueFrom } from "rxjs";
import { QuoteCreate,QuoteServices,Quote } from "src/app/services/quotes/quotes";
import { QuoteItemCreate, QuoteitemServices  } from "src/app/services/quoteitems/quoteitems";
import { QuotePartCreate, QuotepartServices } from "src/app/services/quoteparts/quoteparts";
import { Service,ServiceServices } from "src/app/services/services/services";
import { Part,PartServices } from "src/app/services/parts/parts";
import { Workorder, WorkorderServices } from "src/app/services/workorders/workorders";
import { AuthService } from "src/app/services/auth/auth";

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
    private quoteServices: QuoteServices,
    private quoteItemServices: QuoteitemServices,
    private quotePartServices: QuotepartServices,
    private workorderServices: WorkorderServices,
    private serviceServices: ServiceServices,
    private partServices: PartServices,
    private authService: AuthService,
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
         firstValueFrom(this.workorderServices.listWithOutFilter())
        );
      }

      requests.push(
         firstValueFrom(this.serviceServices.listWithOutFilter())
      );

      requests.push(
         firstValueFrom(this.partServices.listWithOutFilter())
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
          responses[index];

        index++;

        this.services =
          responses[index];

        index++;

        this.parts =
          responses[index];
      }else{

        // Con la orden preasignada no se consulta la lista de ordenes:
        // el indice debe empezar en 0 (antes usaba this.workorderId).
        this.services =
          responses[index];

        index++;

        this.parts =
          responses[index];
      }

      

    } catch (error) {


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

  // Recalcula el importe de cada concepto y los totales con los valores
  // actuales del formulario. Se ejecuta antes de guardar para no enviar
  // cifras desfasadas si el usuario edito sin disparar el recalculo.
  private recalculateConcepts(): void {

    for (
      const item of
      this.items.controls
    ) {

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

      item.patchValue(
        {
          amount:
            Number(
              this.calculateDiscount(
                price,
                discount,
              ).toFixed(2),
            ),
        },
        {
          emitEvent: false,
        },
      );
    }

    for (
      const part of
      this.partsArray.controls
    ) {

      const quantity =
        Number(
          part.get(
            "quantity",
          )?.value ?? 1,
        );

      const price =
        Number(
          part.get(
            "price",
          )?.value ?? 0,
        );

      const discount =
        Number(
          part.get(
            "discount",
          )?.value ?? 0,
        );

      const amount =
        this.calculateDiscount(
          price * quantity,
          discount,
        );

      part.patchValue(
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
    }

    this.calculateTotals();
  }

  // Valida los conceptos antes de escribir en Directus: evita crear una
  // cotizacion sin conceptos o con referencias que ya no existen.
  private validateConcepts(): string {

    if (
      !this.items.length &&
      !this.partsArray.length
    ) {

      return "Agrega al menos un servicio o una refaccion antes de guardar la cotizacion.";
    }

    for (
      const item of
      this.items.controls
    ) {

      const serviceId =
        Number(
          item.get(
            "service_id",
          )?.value,
        );

      if (
        !this.services.some(
          (service) =>
            service.id === serviceId,
        )
      ) {

        return "Uno de los servicios seleccionados ya no esta disponible. Actualiza la cotizacion.";
      }

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

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {

        return "El precio de un servicio no es valido.";
      }

      if (
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100
      ) {

        return "El descuento de un servicio debe estar entre 0 y 100.";
      }
    }

    for (
      const part of
      this.partsArray.controls
    ) {

      const partId =
        Number(
          part.get(
            "part_id",
          )?.value,
        );

      if (
        !this.parts.some(
          (item) =>
            item.id === partId,
        )
      ) {

        return "Una de las refacciones seleccionadas ya no esta disponible. Actualiza la cotizacion.";
      }

      const quantity =
        Number(
          part.get(
            "quantity",
          )?.value ?? 0,
        );

      const price =
        Number(
          part.get(
            "price",
          )?.value ?? 0,
        );

      const discount =
        Number(
          part.get(
            "discount",
          )?.value ?? 0,
        );

      if (
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {

        return "La cantidad de una refaccion debe ser un entero mayor o igual a 1.";
      }

      if (
        !Number.isFinite(price) ||
        price < 0
      ) {

        return "El precio de una refaccion no es valido.";
      }

      if (
        !Number.isFinite(discount) ||
        discount < 0 ||
        discount > 100
      ) {

        return "El descuento de una refaccion debe estar entre 0 y 100.";
      }
    }

    return "";
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

    this.recalculateConcepts();

    const validation =
      this.validateConcepts();

    if (validation) {

      const alert =
        await this.alertController.create({

          header: "Cotizacion incompleta",

          message: validation,

          buttons: ["Aceptar"],
        });

      await alert.present();

      return;
    }

    this.saved = true;

    const values =
      this.quoteForm
        .getRawValue();

    const quote:
      QuoteCreate = {

      workorder_id:
        Number(
          values.workorder_id,
        ),

      user_id: this.authService.getID() ?? '' ,

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

    let createdQuoteId:
      number | undefined;

    try {

      const quoteResponse =
        await firstValueFrom(
          this.quoteServices.create(
            quote,
          ),
        );

      const quoteId =
        quoteResponse.id;

      createdQuoteId = quoteId;

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

        await firstValueFrom(
          this.quoteItemServices.create(
            quoteItem,
          ),
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

        await firstValueFrom(
          this.quotePartServices.create(
            quotePart,
          ),
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


      const alert =
        await this.alertController.create({

          header: "Error",

          message:
            createdQuoteId
              ? `La cotización #${createdQuoteId} se creó, pero no fue posible guardar todos sus conceptos. Revísala antes de continuar: no se eliminó nada y puede quedar incompleta.`
              : "No fue posible guardar la cotización. Revisar los datos, la conexión o los permisos de Directus.",

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