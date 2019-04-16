import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarOfertaComponent } from './cadastrar-oferta.component';

describe('CadastrarOfertaComponent', () => {
  let component: CadastrarOfertaComponent;
  let fixture: ComponentFixture<CadastrarOfertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastrarOfertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastrarOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
