import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderIdComponent } from './provider-id.component';

describe('ProviderIdComponent', () => {
  let component: ProviderIdComponent;
  let fixture: ComponentFixture<ProviderIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProviderIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProviderIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
