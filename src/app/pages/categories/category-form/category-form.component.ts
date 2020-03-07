import { Component, OnInit,AfterContentChecked } from '@angular/core';
import{FormBuilder,FormControl,FormGroup,Validators} from '@angular/forms'

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(){

  }

}
