import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router"
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { switchMap } from 'rxjs/operators';

import toastr from "toastr";

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMenssages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparetor:'',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBR={
    firstDayOfWeek: 0,
    dayNames:['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sabado',],
    dayNamesShort:['Dom','Seg','Ter','Qua','Qui','Sex','Sab',],
    dayNamesMin:['Do','Se','Te','Qu','Qu','Se','Sa',],
    monthNames:['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agoste','Setembro','Outubro','Novembro','Dezembro'],
    monthNamesShort:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Agos','Set','Out','Nov','Dez'],
    today:'Hoje',
    clear:'Limpar'


  }

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new'){
      this.createEntry();
    }else{
      this.updateEntry();
    }
  }

  ngAfterContentChecked() {
    this.setPageTitle()

  }
  //Metodos Privados

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new"
    } else
      this.currentAction = "edit"
  }

  private buildEntryForm() {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null,[Validators.required]],
      amount: [null,[Validators.required]],
      date: [null,[Validators.required]],
      paid: [null,[Validators.required]],
      categoryId: [null,[Validators.required]],
    })
  }

  private loadEntry() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get("id")))
      )
        .subscribe(
          (entry) => {
            this.entry = entry
            this.entryForm.patchValue(entry)// bind loaded entry data to EntryForm.
          },
          (error) => alert('Ocorreu um Erro No Servidor, Tente mais tarde.')
        )
    }
  }

  private setPageTitle() {
    if (this.currentAction == 'new') 
      this.pageTitle = 'Cadastro de Novo Lançamento'
    else {
      const entryName = this.entry.name || ""
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private createEntry(){
    const entry: Entry = Object.assign (new Entry(), this.entryForm.value);
    this.entryService.create(entry)
      .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
    
  }

  private updateEntry(){
    const entry: Entry = Object.assign (new Entry(), this.entryForm.value);

    this.entryService.update(entry)
    .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  actionsForError(error){
    toastr.error('Ocorreu eum erro ao processar a sua socilicitação');

    this.submittingForm = false

    if(error.status === 422){
      this.serverErrorMenssages = JSON.parse(error._body).errors;
    }else{
      this.serverErrorMenssages = ["Falha na comunicação com o servidor tente novamente mais tarde"]
    }
  }
  
  actionsForSuccess(entry: Entry) {
    toastr.success("Solicitação processada com Sucesso!");
    //redirect/reolad component page
    this.router.navigateByUrl("entries", {skipLocationChange: true}).then(
      () =>this.router.navigate(["entries", entry.id, "edit"])
    )
  }
  
}
