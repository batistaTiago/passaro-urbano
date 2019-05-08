import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaPendenteComponent } from './venda-pendente.component';

describe('VendaPendenteComponent', () => {
  let component: VendaPendenteComponent;
  let fixture: ComponentFixture<VendaPendenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendaPendenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendaPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
